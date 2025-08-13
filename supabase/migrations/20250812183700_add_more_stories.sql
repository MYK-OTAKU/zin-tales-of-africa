-- Ajouter plus de contes gratuits
INSERT INTO public.contes (titre, description, categorie, duree_minutes, is_premium, langues, morale, ordre_affichage) VALUES
('Le Lièvre et la Tortue du désert', 'Une version malienne de la célèbre fable, où la ruse du lièvre est mise à l''épreuve par la sagesse de la tortue.', 'Sagesse', 8, false, ARRAY['français', 'bambara'], 'La persévérance et l''intelligence valent mieux que la vitesse et l''arrogance.', 13),
('Le Secret de l''Arbre à Palabres', 'Un vieil arbre qui écoute et partage les secrets du village, enseignant l''importance de la communication.', 'Communauté', 10, false, ARRAY['français', 'bambara'], 'L''écoute et le dialogue sont les piliers d''une communauté unie.', 14),
('La Fille du Pêcheur et le Génie de l''Eau', 'Une jeune fille courageuse qui négocie avec un génie pour sauver son village de la famine.', 'Courage', 12, false, ARRAY['français', 'bambara'], 'Le courage et l''intelligence peuvent apaiser les forces les plus puissantes.', 15);

-- Ajouter plus de contes premium
INSERT INTO public.contes (titre, description, categorie, duree_minutes, is_premium, langues, morale, ordre_affichage) VALUES
('Les Trois Frères et la Montagne d''Or', 'L''aventure de trois frères aux talents uniques qui doivent collaborer pour atteindre un trésor gardé par des esprits.', 'Famille', 20, true, ARRAY['français', 'bambara'], 'L''union fait la force et les talents de chacun sont précieux pour la réussite collective.', 16),
('La Reine de Saba et le Roi Salomon au Mali', 'Une légende racontant la visite de la Reine de Saba au Roi Salomon, qui se serait déroulée sur les terres de l''actuel Mali.', 'Histoire', 25, true, ARRAY['français', 'bambara'], 'La sagesse et la diplomatie sont les plus grands trésors des rois et des reines.', 17),
('Le Griot qui pouvait parler aux animaux', 'L''histoire d''un griot qui apprend le langage des animaux et utilise ce don pour résoudre les conflits entre les hommes et la nature.', 'Nature', 18, true, ARRAY['français', 'bambara'], 'Comprendre et respecter la nature est essentiel pour l''équilibre du monde.', 18);

-- Ajouter des pages pour les nouveaux contes (exemples)
-- Le Lièvre et la Tortue du désert
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 1, 'Dans la savane aride, un lièvre se vantait de sa vitesse...'
FROM public.contes c WHERE c.titre = 'Le Lièvre et la Tortue du désert';
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 2, 'La tortue, sage et patiente, lui proposa une course...'
FROM public.contes c WHERE c.titre = 'Le Lièvre et la Tortue du désert';

-- La Reine de Saba et le Roi Salomon au Mali
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 1, 'La renommée du roi Salomon était parvenue jusqu''aux confins du royaume de Saba...'
FROM public.contes c WHERE c.titre = 'La Reine de Saba et le Roi Salomon au Mali';
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 2, 'La reine, curieuse, entreprit un long voyage vers le nord...'
FROM public.contes c WHERE c.titre = 'La Reine de Saba et le Roi Salomon au Mali';
