-- Table pour stocker les contes
CREATE TABLE public.contes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  categorie TEXT NOT NULL,
  duree_minutes INTEGER NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  langues TEXT[] NOT NULL DEFAULT ARRAY['français'],
  image_url TEXT,
  audio_fr_url TEXT,
  audio_bambara_url TEXT,
  morale TEXT,
  ordre_affichage INTEGER,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table pour les pages/sections des contes
CREATE TABLE public.conte_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conte_id UUID NOT NULL REFERENCES public.contes(id) ON DELETE CASCADE,
  numero_page INTEGER NOT NULL,
  contenu TEXT NOT NULL,
  image_url TEXT,
  audio_fr_url TEXT,
  audio_bambara_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(conte_id, numero_page)
);

-- Table pour les devinettes
CREATE TABLE public.devinettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  reponse TEXT NOT NULL,
  indice TEXT,
  categorie TEXT NOT NULL,
  difficulte TEXT NOT NULL CHECK (difficulte IN ('facile', 'moyen', 'difficile')),
  is_premium BOOLEAN NOT NULL DEFAULT false,
  points INTEGER NOT NULL DEFAULT 10,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table pour l'historique des points et interactions utilisateur
CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type_activite TEXT NOT NULL CHECK (type_activite IN ('conte_ecoute', 'devinette_resolue', 'devinette_tentee')),
  conte_id UUID REFERENCES public.contes(id),
  devinette_id UUID REFERENCES public.devinettes(id),
  points_gagnes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table pour stocker les préférences utilisateur sur les contes
CREATE TABLE public.user_conte_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conte_id UUID NOT NULL REFERENCES public.contes(id) ON DELETE CASCADE,
  derniere_page INTEGER NOT NULL DEFAULT 1,
  termine BOOLEAN NOT NULL DEFAULT false,
  favori BOOLEAN NOT NULL DEFAULT false,
  derniere_ecoute TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, conte_id)
);

-- Enable RLS pour toutes les nouvelles tables
ALTER TABLE public.contes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conte_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devinettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_conte_progress ENABLE ROW LEVEL SECURITY;

-- Policies pour contes (lisibles par tous, modifiables par les admins)
CREATE POLICY "contes_select_all" ON public.contes
FOR SELECT USING (true);

CREATE POLICY "contes_insert_admin" ON public.contes
FOR INSERT WITH CHECK (false); -- Sera géré par des fonctions edge

CREATE POLICY "contes_update_admin" ON public.contes
FOR UPDATE USING (false); -- Sera géré par des fonctions edge

-- Policies pour conte_pages
CREATE POLICY "conte_pages_select_all" ON public.conte_pages
FOR SELECT USING (true);

CREATE POLICY "conte_pages_insert_admin" ON public.conte_pages
FOR INSERT WITH CHECK (false);

CREATE POLICY "conte_pages_update_admin" ON public.conte_pages
FOR UPDATE USING (false);

-- Policies pour devinettes
CREATE POLICY "devinettes_select_all" ON public.devinettes
FOR SELECT USING (true);

CREATE POLICY "devinettes_insert_admin" ON public.devinettes
FOR INSERT WITH CHECK (false);

CREATE POLICY "devinettes_update_admin" ON public.devinettes
FOR UPDATE USING (false);

-- Policies pour user_activities
CREATE POLICY "user_activities_own" ON public.user_activities
FOR ALL USING (auth.uid() = user_id);

-- Policies pour user_conte_progress
CREATE POLICY "user_conte_progress_own" ON public.user_conte_progress
FOR ALL USING (auth.uid() = user_id);

-- Triggers pour updated_at
CREATE TRIGGER update_contes_updated_at
BEFORE UPDATE ON public.contes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conte_pages_updated_at
BEFORE UPDATE ON public.conte_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_devinettes_updated_at
BEFORE UPDATE ON public.devinettes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_conte_progress_updated_at
BEFORE UPDATE ON public.user_conte_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer quelques données de départ
INSERT INTO public.contes (titre, description, categorie, duree_minutes, is_premium, langues, morale, ordre_affichage) VALUES
('L''Araignée et l''Éléphant', 'Une histoire sur la ruse et l''intelligence face à la force brute.', 'Sagesse', 8, false, ARRAY['français', 'bambara'], 'L''intelligence et la ruse peuvent triompher de la force brute. Il ne faut jamais sous-estimer quelqu''un à cause de sa taille ou de son apparence.', 1),
('Le Lion et la Petite Souris', 'Conte sur l''amitié improbable et l''entraide entre les animaux.', 'Amitié', 6, false, ARRAY['français', 'bambara'], 'La gentillesse et l''entraide sont toujours récompensées, peu importe la taille de celui qui aide.', 2),
('La Princesse des Eaux', 'L''histoire mystique d''une princesse qui règne sur les rivières.', 'Mystique', 12, true, ARRAY['français', 'bambara'], 'Le respect de la nature et de ses esprits apporte la prospérité.', 3),
('Le Griot et ses Trois Fils', 'Une leçon sur l''héritage culturel et la transmission du savoir.', 'Famille', 10, true, ARRAY['français', 'bambara'], 'La sagesse se transmet de génération en génération et chaque enfant a ses propres talents.', 4),
('Le Baobab Magique', 'L''arbre sacré qui exauce les vœux des cœurs purs.', 'Magie', 9, false, ARRAY['français', 'bambara'], 'La pureté du cœur et la sincérité sont plus précieuses que toutes les richesses.', 5),
('Le Chasseur et l''Esprit de la Forêt', 'Une aventure sur le respect de la nature et ses mystères.', 'Aventure', 14, true, ARRAY['français', 'bambara'], 'Il faut respecter la nature et ses créatures pour vivre en harmonie.', 6);

INSERT INTO public.devinettes (question, reponse, indice, categorie, difficulte, is_premium, points) VALUES
('Je suis grand et gris, j''ai une trompe, qui suis-je ?', 'éléphant', 'Je vis en Afrique et j''aime l''eau', 'Animaux', 'facile', false, 5),
('Je tisse ma maison avec du fil, qui suis-je ?', 'araignée', 'Je mange les mouches', 'Animaux', 'facile', false, 5),
('On me plante au centre du village, je donne de l''ombre, qui suis-je ?', 'baobab', 'Je suis un arbre sacré', 'Nature', 'moyen', false, 10),
('Je raconte les histoires du village, qui suis-je ?', 'griot', 'Je joue de la musique', 'Culture', 'moyen', true, 15),
('Je coule sans jamais m''arrêter, qui suis-je ?', 'rivière', 'Les poissons nagent en moi', 'Nature', 'facile', false, 5),
('Plus je suis vieux, plus je suis respecté au village, qui suis-je ?', 'sage', 'J''ai beaucoup d''expérience', 'Culture', 'difficile', true, 20);