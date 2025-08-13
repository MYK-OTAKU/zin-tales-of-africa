import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { toast } from 'sonner';

export interface Devinette {
  id: string;
  question: string;
  reponse: string;
  indice: string;
  categorie: string;
  difficulte: 'facile' | 'moyen' | 'difficile' | 'expert';
  points: number;
  is_premium: boolean;
  explication?: string;
}

export interface UserDevinetteProgress {
  score: number;
  level: number;
  experience: number;
  streak: number;
  badges: string[];
  completed_devinettes: string[];
}

export const useDevinettes = () => {
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const [devinettes, setDevinettes] = useState<Devinette[]>([]);
  const [progress, setProgress] = useState<UserDevinetteProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      const devinettesPromise = supabase.from('devinettes').select('*');

      const progressPromise = user
        ? supabase.from('user_devinette_progress').select('*').eq('user_id', user.id).single()
        : Promise.resolve({ data: null, error: null });

      const [devinettesResult, progressResult] = await Promise.all([devinettesPromise, progressPromise]);

      // Handle devinettes
      if (devinettesResult.error) {
        toast.error('Erreur lors du chargement des devinettes.');
        console.error(devinettesResult.error);
      } else {
        setDevinettes(shuffleArray(devinettesResult.data as Devinette[]));
      }

      // Handle progress
      if (user) {
        if (progressResult.error && progressResult.error.code !== 'PGRST116') { // Ignore 'no rows found'
          toast.error('Erreur lors du chargement de votre progression.');
          console.error(progressResult.error);
        } else if (progressResult.data) {
          setProgress(progressResult.data);
        } else {
          // Create initial progress for new user
          const { data: newProgress, error: insertError } = await supabase
            .from('user_devinette_progress')
            .insert({ user_id: user.id })
            .select()
            .single();
          if (insertError) {
            toast.error("Erreur lors de la création de votre profil de jeu.");
            console.error(insertError);
          } else {
            setProgress(newProgress);
          }
        }
      } else {
        setProgress(null);
      }

      setLoading(false);
    };

    void fetchAllData();
  }, [user]);

  const updateProgress = async (newProgress: Partial<UserDevinetteProgress>) => {
    if (!user || !progress) return;

    const { data, error } = await supabase
      .from('user_devinette_progress')
      .update(newProgress)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      toast.error('Erreur lors de la sauvegarde de votre progression.');
      console.error(error);
    } else {
      setProgress(data);
    }
  };

  const accessibleDevinettes = devinettes.filter(dev => !dev.is_premium || subscribed);

  return {
    devinettes,
    accessibleDevinettes,
    progress,
    loading,
    updateProgress,
  };
};
