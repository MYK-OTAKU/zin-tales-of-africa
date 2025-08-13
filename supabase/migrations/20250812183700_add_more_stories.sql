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

-- Le Secret de l''Arbre à Palabres
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 1, 'Au cœur du village de Kénédougou se dressait un baobab millénaire. On l''appelait l''Arbre à Palabres, car ses feuilles murmuraient les secrets que le vent lui apportait.'
FROM public.contes c WHERE c.titre = 'Le Secret de l''Arbre à Palabres';
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 2, 'Un jour, une grande dispute éclata entre deux familles. Le chef du village, désespéré, les conduisit sous l''Arbre à Palabres pour trouver une solution.'
FROM public.contes c WHERE c.titre = 'Le Secret de l''Arbre à Palabres';

-- La Fille du Pêcheur et le Génie de l''Eau
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 1, 'Awa était la fille d''un pêcheur du fleuve Niger. Une année, la sécheresse frappa, et les poissons disparurent. On disait que le Djinn, le génie de l''eau, était en colère.'
FROM public.contes c WHERE c.titre = 'La Fille du Pêcheur et le Génie de l''Eau';
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 2, 'Alors que son village mourait de faim, Awa prit sa plus belle calebasse et alla au milieu du fleuve. Elle chanta une berceuse pour apaiser les esprits.'
FROM public.contes c WHERE c.titre = 'La Fille du Pêcheur et le Génie de l''Eau';

-- Les Trois Frères et la Montagne d''Or
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 1, 'Il y avait trois frères : l''un était fort comme un buffle, le second rapide comme une gazelle, et le troisième, le plus jeune, était incroyablement intelligent.'
FROM public.contes c WHERE c.titre = 'Les Trois Frères et la Montagne d''Or';
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 2, 'Ils entendirent parler de la Montagne d''Or. Le premier frère déplaça les rochers, le second distança l''aigle gardien.'
FROM public.contes c WHERE c.titre = 'Les Trois Frères et la Montagne d''Or';

-- Le Griot qui pouvait parler aux animaux
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 1, 'Bala le griot comprenait le langage des animaux. Il passait ses journées à écouter les conversations de la hyène, du singe et du crocodile.'
FROM public.contes c WHERE c.titre = 'Le Griot qui pouvait parler aux animaux';
INSERT INTO public.conte_pages (conte_id, numero_page, contenu)
SELECT c.id, 2, 'Un jour, un conflit éclata entre les hommes et les singes au sujet des récoltes. La famine menaçait.'
FROM public.contes c WHERE c.titre = 'Le Griot qui pouvait parler aux animaux';
