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

      // Contes simulés avec 20 contes au total
      const mockContes = [
        // Contes gratuits (8)
        { id: '1', titre: 'L\'Araignée et l\'Éléphant', description: 'Une histoire sur la ruse et l\'intelligence face à la force brute.', categorie: 'Sagesse', duree_minutes: 8, is_premium: false, langues: ['français', 'bambara'], morale: 'L\'intelligence et la ruse peuvent triompher de la force brute.', ordre_affichage: 1, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '2', titre: 'Le Lion et la Petite Souris', description: 'Conte sur l\'amitié improbable et l\'entraide entre les animaux.', categorie: 'Amitié', duree_minutes: 6, is_premium: false, langues: ['français', 'bambara'], morale: 'La gentillesse et l\'entraide sont toujours récompensées.', ordre_affichage: 2, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '3', titre: 'Le Baobab Magique', description: 'L\'arbre sacré qui exauce les vœux des cœurs purs.', categorie: 'Magie', duree_minutes: 9, is_premium: false, langues: ['français', 'bambara'], morale: 'La pureté du cœur est plus précieuse que toutes les richesses.', ordre_affichage: 3, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '4', titre: 'La Tortue Sage', description: 'Comment la tortue devient la conseillère du roi grâce à sa sagesse.', categorie: 'Sagesse', duree_minutes: 7, is_premium: false, langues: ['français', 'bambara'], morale: 'La sagesse vaut mieux que la rapidité.', ordre_affichage: 4, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '5', titre: 'Le Petit Berger Courageux', description: 'Un jeune berger sauve son village des hyènes grâce à son courage.', categorie: 'Courage', duree_minutes: 10, is_premium: false, langues: ['français', 'bambara'], morale: 'Le courage n\'a pas d\'âge et peut sauver toute une communauté.', ordre_affichage: 5, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '6', titre: 'La Source Enchantée', description: 'Une source magique qui ne donne de l\'eau qu\'aux cœurs généreux.', categorie: 'Générosité', duree_minutes: 8, is_premium: false, langues: ['français', 'bambara'], morale: 'La générosité est récompensée par l\'abondance.', ordre_affichage: 6, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '7', titre: 'Le Lièvre et le Caïman', description: 'Comment le lièvre rusé échappe au caïman affamé.', categorie: 'Ruse', duree_minutes: 6, is_premium: false, langues: ['français', 'bambara'], morale: 'L\'intelligence peut surmonter la force brute.', ordre_affichage: 7, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '8', titre: 'La Fille qui Parlait aux Oiseaux', description: 'Une jeune fille avec le don de communiquer avec les animaux.', categorie: 'Don', duree_minutes: 11, is_premium: false, langues: ['français', 'bambara'], morale: 'Respecter la nature nous connecte à sa sagesse.', ordre_affichage: 8, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        
        // Contes premium (12)
        { id: '9', titre: 'La Princesse des Eaux', description: 'L\'histoire mystique d\'une princesse qui règne sur les rivières.', categorie: 'Mystique', duree_minutes: 12, is_premium: true, langues: ['français', 'bambara'], morale: 'Le respect de la nature apporte la prospérité.', ordre_affichage: 9, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '10', titre: 'Le Griot et ses Trois Fils', description: 'Une leçon sur l\'héritage culturel et la transmission du savoir.', categorie: 'Famille', duree_minutes: 10, is_premium: true, langues: ['français', 'bambara'], morale: 'La sagesse se transmet de génération en génération.', ordre_affichage: 10, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '11', titre: 'Le Chasseur et l\'Esprit de la Forêt', description: 'Une aventure sur le respect de la nature et ses mystères.', categorie: 'Aventure', duree_minutes: 14, is_premium: true, langues: ['français', 'bambara'], morale: 'Il faut respecter la nature pour vivre en harmonie.', ordre_affichage: 11, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '12', titre: 'Le Masque Sacré de Kanaga', description: 'L\'histoire mystérieuse d\'un masque qui révèle les secrets des ancêtres.', categorie: 'Spiritualité', duree_minutes: 15, is_premium: true, langues: ['français', 'bambara'], morale: 'Le respect des traditions protège la communauté.', ordre_affichage: 12, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '13', titre: 'La Femme-Caméléon', description: 'Une femme dotée du pouvoir de se transformer qui aide les villageois.', categorie: 'Magie', duree_minutes: 13, is_premium: true, langues: ['français', 'bambara'], morale: 'L\'acceptation de la différence enrichit la communauté.', ordre_affichage: 13, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '14', titre: 'Le Trésor du Roi Soundiata', description: 'L\'épopée du grand roi du Mali et la quête de son trésor caché.', categorie: 'Histoire', duree_minutes: 18, is_premium: true, langues: ['français', 'bambara'], morale: 'La vraie richesse réside dans l\'unité et la culture.', ordre_affichage: 14, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '15', titre: 'L\'Enfant des Deux Mondes', description: 'Un enfant né entre le monde des vivants et celui des esprits.', categorie: 'Mystique', duree_minutes: 16, is_premium: true, langues: ['français', 'bambara'], morale: 'Chacun doit trouver sa place et assumer ses responsabilités.', ordre_affichage: 15, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '16', titre: 'La Danse de la Pluie', description: 'Comment une jeune danseuse sauve son village de la sécheresse.', categorie: 'Nature', duree_minutes: 11, is_premium: true, langues: ['français', 'bambara'], morale: 'L\'harmonie avec la nature peut surmonter les épreuves.', ordre_affichage: 16, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '17', titre: 'Le Forgeron et le Djinn', description: 'Un maître forgeron conclut un pacte avec un djinn pour créer des objets magiques.', categorie: 'Magie', duree_minutes: 14, is_premium: true, langues: ['français', 'bambara'], morale: 'Tout pouvoir a un prix et la sagesse consiste à savoir s\'arrêter.', ordre_affichage: 17, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '18', titre: 'La Gardienne des Étoiles', description: 'Une femme sage qui lit l\'avenir dans les constellations.', categorie: 'Divination', duree_minutes: 13, is_premium: true, langues: ['français', 'bambara'], morale: 'Le destin se lit dans les signes pour qui sait observer.', ordre_affichage: 18, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '19', titre: 'Le Royaume des Morts', description: 'Un voyage initiatique dans l\'au-delà pour sauver un être cher.', categorie: 'Spiritualité', duree_minutes: 20, is_premium: true, langues: ['français', 'bambara'], morale: 'L\'amour transcende la mort et unit les mondes.', ordre_affichage: 19, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '20', titre: 'L\'Oracle du Baobab Millénaire', description: 'Le plus ancien baobab du Mali révèle les secrets de l\'univers.', categorie: 'Sagesse', duree_minutes: 17, is_premium: true, langues: ['français', 'bambara'], morale: 'La vraie sagesse vient de l\'écoute de la nature et des ancêtres.', ordre_affichage: 20, actif: true, created_at: '2024-01-01', updated_at: '2024-01-01' }
      ];

      // Filtrer selon l'abonnement en production
      const filteredContes = subscribed ? mockContes : mockContes.filter(conte => !conte.is_premium);

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
    canAccessConte,
    getAccessMessage,
    refetch: fetchContes
  };
};