-- Ajout de 40 nouvelles devinettes

INSERT INTO public.devinettes (question, reponse, indice, categorie, difficulte, points, is_premium, explication) VALUES
-- Catégorie: Animaux (8)
('Je porte ma maison sur mon dos et je ne suis pas un escargot. Qui suis-je ?', 'La tortue', 'Mon dos est une carapace dure.', 'Animaux', 'facile', 10, false, 'La tortue est célèbre pour sa carapace qu''elle transporte partout avec elle.'),
('Je suis le roi de la savane mais je n''ai pas de couronne. Qui suis-je ?', 'Le lion', 'Mon cri peut être entendu à des kilomètres.', 'Animaux', 'facile', 10, false, 'Le lion est surnommé le "roi des animaux" pour sa force et sa crinière majestueuse.'),
('Je change de couleur pour me cacher. Qui suis-je ?', 'Le caméléon', 'Je suis un reptile.', 'Animaux', 'moyen', 15, false, 'Le caméléon est connu pour sa capacité à changer la couleur de sa peau pour se fondre dans son environnement.'),
('J''ai une mémoire incroyable et une trompe. Qui suis-je ?', 'L''éléphant', 'Je suis le plus grand animal terrestre.', 'Animaux', 'moyen', 15, true, 'L''expression "une mémoire d''éléphant" vient de la réputation de cet animal à se souvenir de beaucoup de choses.'),
('Je tisse ma toile pour attraper mon dîner. Qui suis-je ?', 'L''araignée', 'J''ai huit pattes.', 'Animaux', 'facile', 10, false, 'Les araignées tissent des toiles de soie pour piéger les insectes dont elles se nourrissent.'),
('Je suis le meilleur ami de l''homme. Qui suis-je ?', 'Le chien', 'J''aboie.', 'Animaux', 'facile', 10, false, 'Le chien est domestiqué depuis des milliers d''années et est connu pour sa loyauté envers les humains.'),
('Je cours très vite et j''ai des taches noires. Qui suis-je ?', 'Le guépard', 'Je suis le mammifère terrestre le plus rapide.', 'Animaux', 'moyen', 15, true, 'Le guépard peut atteindre des vitesses de plus de 100 km/h sur de courtes distances.'),
('Je vis dans l''eau et je construis des barrages. Qui suis-je ?', 'Le castor', 'J''ai de grandes dents pour ronger le bois.', 'Animaux', 'moyen', 15, false, 'Les castors sont des ingénieurs de la nature, connus pour construire des barrages et des huttes avec des branches d''arbres.'),

-- Catégorie: Nature (8)
('Je tombe sans jamais me faire mal. Qui suis-je ?', 'La pluie', 'J''arrose les plantes.', 'Nature', 'facile', 10, false, 'La pluie est composée de gouttes d''eau qui tombent des nuages.'),
('Plus je suis chaud, plus je suis frais. Qui suis-je ?', 'Le pain', 'Je sors du four.', 'Nature', 'difficile', 20, false, 'Une astuce. Le pain est "frais" quand il vient d''être fait, donc encore chaud.'),
('Je n''ai pas de poumons, mais j''ai besoin d''air. Qui suis-je ?', 'Le feu', 'Je danse quand le vent souffle.', 'Nature', 'moyen', 15, false, 'Le feu a besoin d''oxygène (présent dans l''air) pour brûler, c''est ce qu''on appelle la combustion.'),
('Je te suis toute la journée mais je disparais quand le soleil se couche. Qui suis-je ?', 'Ton ombre', 'Je suis toujours plus grand le matin et le soir.', 'Nature', 'facile', 10, false, 'L''ombre est créée lorsque votre corps bloque la lumière du soleil.'),
('J''ai un cou mais pas de tête, et un corps mais pas de jambes. Qui suis-je ?', 'La bouteille', 'On me remplit et on me vide.', 'Nature', 'moyen', 15, false, 'La bouteille a un "cou" (le goulot) mais pas de tête.'),
('Je suis une montagne qui crache du feu. Qui suis-je ?', 'Le volcan', 'Ma colère peut détruire des villes.', 'Nature', 'facile', 10, false, 'Un volcan est une structure géologique qui résulte de la montée du magma à la surface de la Terre.'),
('Je suis toujours devant toi, mais tu ne peux jamais me voir. Qui suis-je ?', 'Le futur', 'On me nomme aussi "demain".', 'Nature', 'moyen', 15, true, 'Le futur est un concept de temps qui n''est pas encore arrivé, donc invisible.'),
('Je nais dans l''eau, je grandis dans l''eau, mais si on me met dans l''eau, je meurs. Qui suis-je ?', 'Le sel', 'On me trouve dans la mer.', 'Nature', 'difficile', 20, true, 'Le sel (cristal de sel) se forme par évaporation de l''eau, mais se dissout si on le remet dans l''eau.'),

-- Catégorie: Culture (7)
('Je suis un livre de mots. Qui suis-je ?', 'Le dictionnaire', 'Je contiens des définitions.', 'Culture', 'facile', 10, false, 'Un dictionnaire est un recueil de mots d''une langue, rangés par ordre alphabétique avec leur signification.'),
('Je raconte une histoire sans parler. Qui suis-je ?', 'Un livre', 'Mes pages sont remplies de phrases.', 'Culture', 'facile', 10, false, 'Un livre transmet des histoires et des connaissances par l''écrit.'),
('Je suis un vêtement traditionnel africain très coloré. Qui suis-je ?', 'Le boubou', 'Je suis souvent ample et confortable.', 'Culture', 'moyen', 15, false, 'Le boubou est une grande tunique fluide portée dans de nombreuses régions d''Afrique de l''Ouest.'),
('Quel instrument de musique est aussi un outil de communication à distance en Afrique ?', 'Le tam-tam (ou djembé)', 'Son rythme porte des messages.', 'Culture', 'moyen', 15, true, 'Le son des tambours était utilisé pour communiquer entre les villages sur de longues distances.'),
('Je suis une maison ronde au toit de paille. Qui suis-je ?', 'La case', 'On me trouve dans les villages traditionnels.', 'Culture', 'facile', 10, false, 'La case est une habitation traditionnelle dans de nombreuses cultures africaines.'),
('Je suis un jeu de stratégie africain joué avec des graines. Qui suis-je ?', 'L''awalé', 'Il se joue sur un plateau en bois avec des trous.', 'Culture', 'difficile', 20, true, 'L''awalé est un jeu de société de la famille des jeux de semailles, très populaire en Afrique.'),
('Je suis le conteur qui transmet l''histoire de génération en génération. Qui suis-je ?', 'Le griot', 'Je chante et je joue de la kora.', 'Culture', 'moyen', 15, false, 'Le griot est un poète, musicien et historien, dépositaire de la tradition orale en Afrique de l''Ouest.'),

-- Catégorie: Spiritualité (5)
('Je suis un objet qui porte bonheur. Qui suis-je ?', 'Un gri-gri (ou amulette)', 'On me porte sur soi.', 'Spiritualité', 'facile', 10, false, 'Un gri-gri est un objet (souvent un petit sachet en cuir) porté pour se protéger du mal ou attirer la chance.'),
('Je suis une cérémonie pour honorer les ancêtres. Qui suis-je ?', 'Un rituel', 'Il y a souvent des offrandes.', 'Spiritualité', 'moyen', 15, false, 'Les rituels sont des séries d''actes codifiés pour entrer en contact avec le monde des esprits ou des ancêtres.'),
('Je suis la croyance en un seul Dieu. Qui suis-je ?', 'Le monothéisme', 'Le Christianisme et l''Islam en sont des exemples.', 'Spiritualité', 'moyen', 15, false, 'Le monothéisme est la croyance en l''existence d''un seul dieu.'),
('Je suis un esprit de la nature dans les croyances africaines. Qui suis-je ?', 'Un djinn (ou génie)', 'Je peux être bienveillant ou malveillant.', 'Spiritualité', 'moyen', 15, true, 'Les djinns sont des créatures surnaturelles issues des croyances populaires.'),
('Je suis le cycle de la vie, de la mort et de la renaissance. Qui suis-je ?', 'La réincarnation', 'Certains croient qu''on revient sous une autre forme.', 'Spiritualité', 'difficile', 20, true, 'La réincarnation est une croyance selon laquelle l''âme d''une personne peut renaître dans un autre corps après la mort.'),

-- Catégorie: Valeurs (6)
('Je suis le respect dû aux personnes plus âgées. Qui suis-je ?', 'La sagesse des anciens', 'C''est une valeur fondamentale.', 'Valeurs', 'facile', 10, false, 'Dans de nombreuses cultures africaines, les aînés sont considérés comme des bibliothèques vivantes et sont traités avec le plus grand respect.'),
('Je suis l''aide qu''on s''apporte les uns les autres dans la communauté. Qui suis-je ?', 'La solidarité', 'L''union fait la force.', 'Valeurs', 'facile', 10, false, 'La solidarité est un sentiment de responsabilité et de soutien mutuel au sein d''un groupe.'),
('Quand on me donne, je grandis. Qui suis-je ?', 'Le respect', 'Il est la base de toute relation.', 'Valeurs', 'moyen', 15, false, 'Le respect est une valeur qui se renforce lorsqu''elle est partagée.'),
('Je suis le bienvenu que l''on offre à un étranger. Qui suis-je ?', 'L''hospitalité (la Téranga)', 'C''est plus qu''un simple mot, c''est un mode de vie.', 'Valeurs', 'moyen', 15, true, 'La Téranga est un concept sénégalais qui englobe l''hospitalité, la chaleur humaine et le partage.'),
('Je suis la qualité de celui qui dit toujours la vérité. Qui suis-je ?', 'L''honnêteté', 'C''est une droiture de l''esprit.', 'Valeurs', 'facile', 10, false, 'L''honnêteté est le respect de la vérité et de la morale.'),
('Je suis ce qui lie les membres d''une même famille. Qui suis-je ?', 'Les liens du sang', 'Ils sont considérés comme sacrés.', 'Valeurs', 'moyen', 15, false, 'Les liens familiaux sont au cœur de la structure sociale dans de nombreuses cultures.'),

-- Catégorie: Particulier (6)
('Qu''est-ce qui a un œil mais ne peut pas voir ?', 'Une aiguille', 'On y passe un fil.', 'Particulier', 'facile', 10, false, 'Le trou d''une aiguille est appelé le "chas", mais ressemble à un œil.'),
('Qu''est-ce qui est plein de trous mais peut quand même retenir l''eau ?', 'Une éponge', 'Je suis légère et absorbante.', 'Particulier', 'facile', 10, false, 'La structure poreuse de l''éponge lui permet d''absorber et de retenir l''eau.'),
('Qu''est-ce qui monte mais ne descend jamais ?', 'Ton âge', 'Chaque année, j''augmente.', 'Particulier', 'moyen', 15, false, 'L''âge d''une personne ne fait qu''augmenter avec le temps.'),
('Je parle toutes les langues mais je n''ai jamais appris. Qui suis-je ?', 'L''écho', 'Je répète ce que j''entends.', 'Particulier', 'moyen', 15, true, 'L''écho est un phénomène de réverbération du son, il ne fait que répéter.'),
('Qu''est-ce qui appartient à toi mais que les autres utilisent plus que toi ?', 'Ton nom', 'On t''appelle avec.', 'Particulier', 'difficile', 20, false, 'Les autres utilisent votre nom pour s''adresser à vous, souvent plus que vous ne l''utilisez vous-même.'),
('Je suis léger comme une plume, mais même l''homme le plus fort ne peut pas me retenir longtemps. Qui suis-je ?', 'La respiration', 'Tu en as besoin pour vivre.', 'Particulier', 'difficile', 20, true, 'On ne peut retenir sa respiration que pendant un temps limité, quelle que soit sa force.');
