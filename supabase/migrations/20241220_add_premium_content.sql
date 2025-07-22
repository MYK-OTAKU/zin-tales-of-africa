-- Ajouter plus de contes premium avec du contenu riche
INSERT INTO public.contes (titre, description, categorie, duree_minutes, is_premium, langues, morale, ordre_affichage) VALUES
('Le Masque Sacré de Kanaga', 'L''histoire mystérieuse d''un masque qui révèle les secrets des ancêtres et protège le village des mauvais esprits.', 'Spiritualité', 15, true, ARRAY['français', 'bambara'], 'Le respect des traditions ancestrales protège la communauté et guide vers la sagesse.', 7),
('La Femme-Caméléon', 'Une femme dotée du pouvoir de se transformer qui aide les villageois tout en cachant sa véritable nature.', 'Magie', 13, true, ARRAY['français', 'bambara'], 'L''acceptation de la différence enrichit la communauté et révèle des forces insoupçonnées.', 8),
('Le Trésor du Roi Soundiata', 'L''épopée du grand roi du Mali et la quête de son trésor caché, symbole de la grandeur de l''empire.', 'Histoire', 18, true, ARRAY['français', 'bambara'], 'La vraie richesse d''un peuple réside dans son unité et sa culture, pas dans l''or.', 9),
('L''Enfant des Deux Mondes', 'Un enfant né entre le monde des vivants et celui des esprits doit choisir son destin.', 'Mystique', 16, true, ARRAY['français', 'bambara'], 'Chacun doit trouver sa place et assumer ses responsabilités envers sa communauté.', 10),
('La Danse de la Pluie', 'Comment une jeune danseuse sauve son village de la sécheresse grâce à sa connexion avec les esprits de l''eau.', 'Nature', 11, true, ARRAY['français', 'bambara'], 'L''harmonie avec la nature et la persévérance peuvent surmonter les plus grandes épreuves.', 11),
('Le Forgeron et le Djinn', 'Un maître forgeron conclut un pacte avec un djinn pour créer des objets magiques, mais à quel prix ?', 'Magie', 14, true, ARRAY['français', 'bambara'], 'Tout pouvoir a un prix et la sagesse consiste à savoir quand s''arrêter.', 12);

-- Ajouter des pages pour les nouveaux contes
INSERT INTO public.conte_pages (conte_id, numero_page, contenu) 
SELECT c.id, 1, 'Il était une fois, dans le village de Bandiagara...' 
FROM public.contes c WHERE c.titre = 'Le Masque Sacré de Kanaga';

INSERT INTO public.conte_pages (conte_id, numero_page, contenu) 
SELECT c.id, 2, 'Le masque Kanaga était gardé dans la case sacrée...' 
FROM public.contes c WHERE c.titre = 'Le Masque Sacré de Kanaga';

-- Ajouter plus de devinettes premium
INSERT INTO public.devinettes (question, reponse, indice, categorie, difficulte, is_premium, points) VALUES
('Je suis la mémoire qui ne s''efface jamais, qui suis-je ?', 'tradition', 'Transmise par les griots', 'Culture', 'expert', true, 30),
('Je lie le ciel et la terre sans être vu, qui suis-je ?', 'prière', 'Pont vers les ancêtres', 'Spiritualité', 'difficile', true, 20),
('Je suis né de la terre mais je nourris l''esprit, qui suis-je ?', 'conte', 'Sagesse ancestrale', 'Culture', 'difficile', true, 18),
('Je cours sans jambes, je parle sans bouche, qui suis-je ?', 'vent', 'Messager des esprits', 'Nature', 'moyen', false, 12),
('Je suis la richesse qu''on partage sans la perdre, qui suis-je ?', 'savoir', 'Plus on donne, plus on a', 'Sagesse', 'difficile', true, 22),
('Je suis invisible mais plus fort que le lion, qui suis-je ?', 'courage', 'Force de l''âme', 'Valeurs', 'difficile', true, 20),
('Je grandis quand on me brise, qui suis-je ?', 'calebasse', 'Récipient traditionnel', 'Artisanat', 'moyen', false, 10),
('Je danse sans bouger, qui suis-je ?', 'flamme', 'Lumière sacrée', 'Spiritualité', 'moyen', true, 15),
('Je suis l''âge qui ne compte pas les années, qui suis-je ?', 'sagesse', 'Vient avec l''expérience', 'Philosophie', 'expert', true, 35),
('Je porte les secrets mais ne parle jamais, qui suis-je ?', 'masque', 'Visage des ancêtres', 'Art', 'difficile', true, 25);

-- Mettre à jour les statistiques
UPDATE public.profiles SET updated_at = now();
