import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Favorite {
  id: string;
  user_id: string;
  conte_id: string;
  created_at: string;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Charger les favoris de l'utilisateur
  const loadFavorites = async () => {
    if (!user) {
      setFavorites(new Set());
      return;
    }

    try {
      setLoading(true);
      
      // Pour le moment, on simule avec le localStorage
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
      
      // En production, on utiliserait Supabase :
      /*
      const { data, error } = await supabase
        .from('user_conte_progress')
        .select('conte_id')
        .eq('user_id', user.id)
        .eq('favori', true);

      if (error) throw error;
      
      const favoriteIds = new Set(data?.map(item => item.conte_id) || []);
      setFavorites(favoriteIds);
      */
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      toast.error('Erreur lors du chargement des favoris');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter/retirer un conte des favoris
  const toggleFavorite = async (conteId: string): Promise<boolean> => {
    if (!user) {
      toast.error('Connectez-vous pour ajouter aux favoris');
      return false;
    }

    try {
      const newFavorites = new Set(favorites);
      const isFavorite = newFavorites.has(conteId);
      
      if (isFavorite) {
        newFavorites.delete(conteId);
        toast.success('Retiré des favoris');
      } else {
        newFavorites.add(conteId);
        toast.success('Ajouté aux favoris');
      }
      
      setFavorites(newFavorites);
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify([...newFavorites]));
      
      // En production, on utiliserait Supabase :
      /*
      const { error } = await supabase
        .from('user_conte_progress')
        .upsert({
          user_id: user.id,
          conte_id: conteId,
          favori: !isFavorite,
          derniere_page: 1,
          termine: false,
          derniere_ecoute: new Date().toISOString()
        }, {
          onConflict: 'user_id,conte_id'
        });

      if (error) throw error;
      */

      return !isFavorite;
    } catch (error) {
      console.error('Erreur toggle favorite:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
      return false;
    }
  };

  // Vérifier si un conte est en favori
  const isFavorite = (conteId: string): boolean => {
    return favorites.has(conteId);
  };

  // Obtenir la liste des contes favoris
  const getFavoritesList = (): string[] => {
    return Array.from(favorites);
  };

  // Compter le nombre de favoris
  const getFavoritesCount = (): number => {
    return favorites.size;
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    getFavoritesList,
    getFavoritesCount,
    loadFavorites
  };
};