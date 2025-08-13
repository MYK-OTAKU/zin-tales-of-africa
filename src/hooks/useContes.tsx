import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { toast } from 'sonner';

export interface Conte {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  duree_minutes: number;
  is_premium: boolean;
  langues: string[];
  image_url?: string;
  audio_fr_url?: string;
  audio_bambara_url?: string;
  morale?: string;
  ordre_affichage?: number;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContePage {
  id: string;
  conte_id: string;
  numero_page: number;
  contenu: string;
  image_url?: string;
  audio_fr_url?: string;
  audio_bambara_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  conte_id: string;
  derniere_page: number;
  termine: boolean;
  favori: boolean;
  derniere_ecoute: string;
  created_at: string;
  updated_at: string;
}

export const useContes = () => {
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const [contes, setContes] = useState<Conte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('contes')
        .select('*')
        .eq('actif', true)
        .order('ordre_affichage', { ascending: true });

      if (fetchError) throw fetchError;

      // Pour l'instant, on garde les contes existants
      // En production, on filtrerait selon l'abonnement
      const filteredContes = data;

      setContes(filteredContes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des contes';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchContePages = async (conteId: string): Promise<ContePage[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('conte_pages')
        .select('*')
        .eq('conte_id', conteId)
        .order('numero_page', { ascending: true });

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des pages';
      toast.error(errorMessage);
      return [];
    }
  };

  const fetchUserProgress = async (conteId: string): Promise<UserProgress | null> => {
    if (!user) return null;

    try {
      const { data, error: fetchError } = await supabase
        .from('user_conte_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('conte_id', conteId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      console.error('Erreur lors du chargement du progrès:', err);
      return null;
    }
  };

  const updateUserProgress = async (
    conteId: string, 
    page: number, 
    termine = false, 
    favori?: boolean
  ): Promise<void> => {
    if (!user) return;

    try {
      const progressData: any = {
        user_id: user.id,
        conte_id: conteId,
        derniere_page: page,
        termine,
        derniere_ecoute: new Date().toISOString(),
      };

      if (favori !== undefined) {
        progressData.favori = favori;
      }

      const { error } = await supabase
        .from('user_conte_progress')
        .upsert(progressData, { 
          onConflict: 'user_id,conte_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      // Enregistrer l'activité
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          type_activite: 'conte_ecoute',
          conte_id: conteId,
          points_gagnes: termine ? 10 : 0
        });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du progrès';
      toast.error(errorMessage);
      throw err;
    }
  };

  const toggleFavorite = async (conteId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Récupérer le statut actuel
      const currentProgress = await fetchUserProgress(conteId);
      const newFavoriteStatus = !currentProgress?.favori;

      await updateUserProgress(
        conteId, 
        currentProgress?.derniere_page || 1, 
        currentProgress?.termine || false, 
        newFavoriteStatus
      );

      toast.success(newFavoriteStatus ? 'Ajouté aux favoris' : 'Retiré des favoris');
      return newFavoriteStatus;
    } catch (err) {
      toast.error('Erreur lors de la mise à jour des favoris');
      return false;
    }
  };

  const generateImage = async (prompt: string, culturalContext?: string): Promise<string | null> => {
    if (!user) {
      toast.error('Vous devez être connecté pour générer des images');
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('generate-conte-image', {
        body: { 
          prompt, 
          culturalContext,
          style: 'traditional African art, Malian culture'
        }
      });

      if (error) throw error;
      return data.imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération d\'image';
      toast.error(errorMessage);
      return null;
    }
  };

  const canAccessConte = (conte: Conte): boolean => {
    return !conte.is_premium || subscribed;
  };

  const getAccessMessage = (conte: Conte): string | null => {
    if (conte.is_premium && !subscribed) {
      return 'Ce conte est réservé aux abonnés Premium. Abonnez-vous pour y accéder !';
    }
    return null;
  };

  useEffect(() => {
    fetchContes();
  }, [subscribed]);

  const updateConte = async (conteId: string, updates: Partial<Conte>): Promise<Conte | null> => {
    try {
      const { data, error } = await supabase
        .from('contes')
        .update(updates)
        .eq('id', conteId)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour l'état local
      setContes(currentContes =>
        currentContes.map(c => c.id === conteId ? { ...c, ...data } : c)
      );
      toast.success('Le conte a été mis à jour avec succès.');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du conte';
      toast.error(errorMessage);
      return null;
    }
  };

  const updateContePage = async (pageId: string, updates: Partial<ContePage>): Promise<ContePage | null> => {
    try {
      const { data, error } = await supabase
        .from('conte_pages')
        .update(updates)
        .eq('id', pageId)
        .select()
        .single();

      if (error) throw error;

      toast.success('La page du conte a été mise à jour.');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la page';
      toast.error(errorMessage);
      return null;
    }
  };

  return {
    contes,
    loading,
    error,
    fetchContes,
    fetchContePages,
    fetchUserProgress,
    updateUserProgress,
    toggleFavorite,
    generateImage,
    updateConte,
    updateContePage,
    canAccessConte,
    getAccessMessage,
    refetch: fetchContes
  };
};