import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  const fetchDevinettes = useCallback(async () => {
    const { data, error } = await supabase.from('devinettes').select('*');
    if (error) {
      toast.error('Erreur lors du chargement des devinettes.');
      console.error(error);
    } else {
      setDevinettes(data as Devinette[]);
    }
  }, []);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_devinette_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore 'no rows found' error
      toast.error('Erreur lors du chargement de votre progression.');
      console.error(error);
    } else if (data) {
      setProgress(data);
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
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchDevinettes();
      await fetchProgress();
      setLoading(false);
    };
    fetchData();
  }, [fetchDevinettes, fetchProgress]);

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
