import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Star, 
  Trophy, 
  Target,
  Crown,
  Zap,
  Sparkles,
  Gift,
  Award,
  TrendingUp,
  Brain,
  Lock,
  Unlock,
  Timer,
  Heart,
  Flame,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

interface Devinette {
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

const Devinettes = () => {
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  
  const [devinettes] = useState<Devinette[]>([
    // Devinettes Faciles (Gratuit)
    { id: '1', question: 'Je suis grand et gris, j\'ai une trompe, qui suis-je ?', reponse: 'éléphant', indice: 'Je vis en Afrique et j\'aime l\'eau', categorie: 'Animaux', difficulte: 'facile', points: 5, is_premium: false, explication: 'L\'éléphant est le plus grand mammifère terrestre d\'Afrique.' },
    { id: '2', question: 'Je tisse ma maison avec du fil, qui suis-je ?', reponse: 'araignée', indice: 'Je mange les mouches', categorie: 'Animaux', difficulte: 'facile', points: 5, is_premium: false, explication: 'L\'araignée tisse sa toile pour capturer ses proies.' },
    { id: '3', question: 'Je coule sans jamais m\'arrêter, qui suis-je ?', reponse: 'rivière', indice: 'Les poissons nagent en moi', categorie: 'Nature', difficulte: 'facile', points: 5, is_premium: false, explication: 'La rivière est un cours d\'eau naturel.' },
    { id: '4', question: 'Je brille la nuit et éclaire le chemin, qui suis-je ?', reponse: 'lune', indice: 'Je change de forme chaque nuit', categorie: 'Nature', difficulte: 'facile', points: 5, is_premium: false },
    { id: '5', question: 'Je suis roi de la savane, qui suis-je ?', reponse: 'lion', indice: 'J\'ai une crinière majestueuse', categorie: 'Animaux', difficulte: 'facile', points: 5, is_premium: false },
    { id: '6', question: 'Je donne de l\'ombre au village, qui suis-je ?', reponse: 'baobab', indice: 'Je suis un arbre sacré', categorie: 'Nature', difficulte: 'facile', points: 8, is_premium: false },
    
    // Devinettes Moyennes (Gratuit)
    { id: '7', question: 'Je raconte les histoires du village, qui suis-je ?', reponse: 'griot', indice: 'Je joue de la musique', categorie: 'Culture', difficulte: 'moyen', points: 10, is_premium: false, explication: 'Le griot est le gardien de la tradition orale en Afrique de l\'Ouest.' },
    { id: '8', question: 'Plus je suis vieux, plus je suis respecté au village, qui suis-je ?', reponse: 'sage', indice: 'J\'ai beaucoup d\'expérience', categorie: 'Culture', difficulte: 'moyen', points: 10, is_premium: false },
    { id: '9', question: 'Je nourris tout le village mais ne mange jamais, qui suis-je ?', reponse: 'mil', indice: 'Je pousse dans les champs', categorie: 'Agriculture', difficulte: 'moyen', points: 10, is_premium: false },
    { id: '10', question: 'Je protège la maison mais n\'ai pas de murs, qui suis-je ?', reponse: 'esprit', indice: 'Les ancêtres veillent', categorie: 'Spiritualité', difficulte: 'moyen', points: 12, is_premium: false },
    
    // Devinettes Difficiles (Premium)
    { id: '11', question: 'Je lie les familles sans être vu, qui suis-je ?', reponse: 'totém', indice: 'Chaque clan a le sien', categorie: 'Culture', difficulte: 'difficile', points: 15, is_premium: true, explication: 'Le totém est l\'animal protecteur d\'un clan.' },
    { id: '12', question: 'Je parle sans voix, je enseigne sans école, qui suis-je ?', reponse: 'proverbe', indice: 'La sagesse des anciens', categorie: 'Culture', difficulte: 'difficile', points: 15, is_premium: true },
    { id: '13', question: 'Je suis la richesse qui ne se compte pas, qui suis-je ?', reponse: 'honneur', indice: 'Plus précieux que l\'or', categorie: 'Valeurs', difficulte: 'difficile', points: 18, is_premium: true },
    { id: '14', question: 'Je unifie les villages sans être chef, qui suis-je ?', reponse: 'marché', indice: 'Le lieu des échanges', categorie: 'Société', difficulte: 'difficile', points: 15, is_premium: true },
    { id: '15', question: 'Je guéris sans médicament, qui suis-je ?', reponse: 'parole', indice: 'La force des mots justes', categorie: 'Spiritualité', difficulte: 'difficile', points: 20, is_premium: true },
    
    // Devinettes Expert (Premium)
    { id: '16', question: 'Je suis le premier et le dernier de chaque génération, qui suis-je ?', reponse: 'nom', indice: 'Héritage ancestral', categorie: 'Généalogie', difficulte: 'expert', points: 25, is_premium: true },
    { id: '17', question: 'Je traverse les siècles sans vieillir, qui suis-je ?', reponse: 'tradition', indice: 'Transmise de père en fils', categorie: 'Culture', difficulte: 'expert', points: 25, is_premium: true },
    { id: '18', question: 'Je suis invisible mais plus fort que le fer, qui suis-je ?', reponse: 'serment', indice: 'Lien sacré entre hommes', categorie: 'Valeurs', difficulte: 'expert', points: 30, is_premium: true },
    { id: '19', question: 'Je nais de la terre mais appartiens au ciel, qui suis-je ?', reponse: 'ancêtre', indice: 'Entre deux mondes', categorie: 'Spiritualité', difficulte: 'expert', points: 30, is_premium: true },
    { id: '20', question: 'Je suis le silence qui parle le plus fort, qui suis-je ?', reponse: 'respect', indice: 'Vertu suprême', categorie: 'Valeurs', difficulte: 'expert', points: 35, is_premium: true },
    
    // Devinettes bonus (11 supplémentaires pour atteindre 36 au total)
    { id: '21', question: 'Je grandis en me cassant, qui suis-je ?', reponse: 'noix de karité', indice: 'Trésor des femmes', categorie: 'Nature', difficulte: 'moyen', points: 12, is_premium: false },
    { id: '22', question: 'Je porte le village sur mon dos, qui suis-je ?', reponse: 'femme', indice: 'Pilier de la famille', categorie: 'Société', difficulte: 'difficile', points: 20, is_premium: true },
    { id: '23', question: 'Je suis né d\'argile mais je vis éternellement, qui suis-je ?', reponse: 'masque', indice: 'Visage des esprits', categorie: 'Art', difficulte: 'difficile', points: 18, is_premium: true },
    { id: '24', question: 'Je rythme la vie sans jamais me tromper, qui suis-je ?', reponse: 'saison', indice: 'Calendrier naturel', categorie: 'Nature', difficulte: 'moyen', points: 10, is_premium: false },
    { id: '25', question: 'Je suis la richesse du pauvre et la pauvreté du riche, qui suis-je ?', reponse: 'travail', indice: 'Valeur universelle', categorie: 'Valeurs', difficulte: 'difficile', points: 22, is_premium: true },
    { id: '26', question: 'Je danse sans pieds, qui suis-je ?', reponse: 'ombre', indice: 'Compagne fidèle', categorie: 'Nature', difficulte: 'facile', points: 6, is_premium: false },
    { id: '27', question: 'Je mange le fer mais ne grossis jamais, qui suis-je ?', reponse: 'rouille', indice: 'Ennemi du forgeron', categorie: 'Nature', difficulte: 'moyen', points: 12, is_premium: false },
    { id: '28', question: 'Je suis la voix des morts, qui suis-je ?', reponse: 'tambour', indice: 'Instrument sacré', categorie: 'Musique', difficulte: 'difficile', points: 18, is_premium: true },
    { id: '29', question: 'Je lie les générations sans chaîne, qui suis-je ?', reponse: 'nom', indice: 'Héritage familial', categorie: 'Généalogie', difficulte: 'expert', points: 28, is_premium: true },
    { id: '30', question: 'Je suis l\'eau qui ne mouille pas, qui suis-je ?', reponse: 'larme', indice: 'Expression de l\'émotion', categorie: 'Émotion', difficulte: 'moyen', points: 14, is_premium: false },
    { id: '31', question: 'Je porte la force de mille hommes dans mes bras, qui suis-je ?', reponse: 'fleuve', indice: 'Artère de la terre', categorie: 'Nature', difficulte: 'difficile', points: 20, is_premium: true },
    { id: '32', question: 'Je suis né du feu mais je vis dans l\'eau, qui suis-je ?', reponse: 'sel', indice: 'Blanc trésor', categorie: 'Minéral', difficulte: 'expert', points: 30, is_premium: true },
    { id: '33', question: 'Je vole sans ailes, je cours sans jambes, qui suis-je ?', reponse: 'nuage', indice: 'Berger du ciel', categorie: 'Nature', difficulte: 'facile', points: 7, is_premium: false },
    { id: '34', question: 'Je suis la force qui unit les pierres, qui suis-je ?', reponse: 'mortier', indice: 'Lien du maçon', categorie: 'Construction', difficulte: 'moyen', points: 13, is_premium: false },
    { id: '35', question: 'Je garde les secrets du village sans parler, qui suis-je ?', reponse: 'puits', indice: 'Mémoire de l\'eau', categorie: 'Infrastructure', difficulte: 'difficile', points: 19, is_premium: true },
    { id: '36', question: 'Je suis l\'éternité dans l\'instant, qui suis-je ?', reponse: 'amour', indice: 'Sentiment universel', categorie: 'Émotion', difficulte: 'expert', points: 35, is_premium: true }
  ]);
  
  const [currentDevIndex, setCurrentDevIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [completedDevinettes, setCompletedDevinettes] = useState<Set<string>>(new Set());
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [multiplier, setMultiplier] = useState(1);
  
  // Filtrer les devinettes selon l'abonnement
  const accessibleDevinettes = devinettes.filter(dev => !dev.is_premium || subscribed);
  const currentDevinette = accessibleDevinettes[currentDevIndex];
  
  // Calculer le niveau et l'expérience
  const experienceToNextLevel = level * 100;
  const levelProgress = (experience % 100);
  
  // Badges et achievements
  const checkBadges = (newScore: number, newStreak: number) => {
    const newBadges = [...badges];
    
    if (newScore >= 50 && !badges.includes('débutant')) newBadges.push('débutant');
    if (newScore >= 150 && !badges.includes('apprenti')) newBadges.push('apprenti');
    if (newScore >= 300 && !badges.includes('sage')) newBadges.push('sage');
    if (newScore >= 500 && !badges.includes('maître')) newBadges.push('maître');
    if (newStreak >= 5 && !badges.includes('série')) newBadges.push('série');
    if (newStreak >= 10 && !badges.includes('champion')) newBadges.push('champion');
    if (completedDevinettes.size >= 10 && !badges.includes('explorateur')) newBadges.push('explorateur');
    if (completedDevinettes.size >= 20 && !badges.includes('expert')) newBadges.push('expert');
    
    if (newBadges.length > badges.length) {
      setBadges(newBadges);
      const newBadge = newBadges[newBadges.length - 1];
      toast.success(`🏆 Nouveau badge débloqué : ${newBadge}!`);
    }
  };
  
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'débutant': return <Star className="h-4 w-4" />;
      case 'apprenti': return <Brain className="h-4 w-4" />;
      case 'sage': return <Award className="h-4 w-4" />;
      case 'maître': return <Crown className="h-4 w-4" />;
      case 'série': return <Flame className="h-4 w-4" />;
      case 'champion': return <Trophy className="h-4 w-4" />;
      case 'explorateur': return <Target className="h-4 w-4" />;
      case 'expert': return <Sparkles className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };
  
  const getDifficultyColor = (difficulte: string) => {
    switch (difficulte) {
      case 'facile': return 'bg-green-100 text-green-800 border-green-300';
      case 'moyen': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'difficile': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'expert': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Fonction pour normaliser les réponses
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^a-z0-9\s]/g, '') // Enlever la ponctuation
      .replace(/\s+/g, ' ') // Normaliser les espaces
      .replace(/\b(le|la|les|un|une|des|du|de|d)\b/g, '') // Enlever les articles
      .trim();
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      toast.error("Veuillez entrer une réponse");
      return;
    }
    
    const normalizedAnswer = normalizeText(userAnswer);
    const normalizedCorrectAnswer = normalizeText(currentDevinette.reponse);
    
    // Vérifier correspondance exacte ou similitude élevée
    const isCorrect = normalizedAnswer === normalizedCorrectAnswer || 
                     normalizedAnswer.includes(normalizedCorrectAnswer) ||
                     normalizedCorrectAnswer.includes(normalizedAnswer);
    
    setAnsweredCorrectly(isCorrect);
    setShowAnswer(true);
    
    if (isCorrect) {
      const points = currentDevinette.points * multiplier;
      const newScore = score + points;
      const newStreak = streak + 1;
      const newExperience = experience + points;
      
      setScore(newScore);
      setStreak(newStreak);
      setExperience(newExperience);
      setCompletedDevinettes(prev => new Set([...prev, currentDevinette.id]));
      
      // Level up
      if (newExperience >= experienceToNextLevel) {
        setLevel(level + 1);
        toast.success(`🎉 Niveau ${level + 1} atteint !`);
      }
      
      // Multiplier de streak
      if (newStreak % 3 === 0) {
        setMultiplier(Math.min(multiplier + 0.5, 3));
        toast.success(`🔥 Multiplicateur x${Math.min(multiplier + 0.5, 3)} !`);
      }
      
      checkBadges(newScore, newStreak);
      toast.success(`Excellente réponse ! +${points} points`);
    } else {
      setStreak(0);
      setMultiplier(1);
      toast.error("Ce n'est pas la bonne réponse. Essayez encore !");
    }
  };
  
  const handleNextDevinette = () => {
    if (currentDevIndex < accessibleDevinettes.length - 1) {
      setCurrentDevIndex(currentDevIndex + 1);
      setUserAnswer("");
      setShowAnswer(false);
      setShowHint(false);
      setAnsweredCorrectly(null);
    } else {
      toast.success("Félicitations ! Vous avez terminé toutes les devinettes disponibles !");
    }
  };
  
  const handlePrevDevinette = () => {
    if (currentDevIndex > 0) {
      setCurrentDevIndex(currentDevIndex - 1);
      setUserAnswer("");
      setShowAnswer(false);
      setShowHint(false);
      setAnsweredCorrectly(null);
    }
  };
  
  const canAccessDevinette = (devinette: Devinette) => {
    return !devinette.is_premium || subscribed;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header avec statistiques */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-4">
            Devinettes Traditionnelles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Testez votre sagesse avec nos énigmes ancestrales et gagnez des points en découvrant les secrets de la culture malienne.
          </p>
          
          {/* Statistiques de jeu */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <Trophy className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm opacity-90">Points</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{level}</div>
                <div className="text-sm opacity-90">Niveau</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <Flame className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-sm opacity-90">Série</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{badges.length}</div>
                <div className="text-sm opacity-90">Badges</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Barre d'expérience */}
          <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Niveau {level}</span>
                <span className="text-sm text-gray-500">{experience}/{experienceToNextLevel} XP</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Devinette principale */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-2 border-orange-200 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${getDifficultyColor(currentDevinette.difficulte)} font-semibold`}>
                    {currentDevinette.difficulte.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    {currentDevinette.categorie}
                  </Badge>
                  {currentDevinette.is_premium && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-2xl text-gray-800 leading-relaxed">
                  {currentDevinette.question}
                </CardTitle>
                
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">{currentDevinette.points} pts</span>
                  </div>
                  {multiplier > 1 && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full">
                      <Flame className="h-3 w-3" />
                      <span className="text-xs font-bold">x{multiplier}</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {!canAccessDevinette(currentDevinette) ? (
                  <div className="text-center py-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-amber-600" />
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Devinette Premium</h3>
                    <p className="text-amber-700 mb-4">Abonnez-vous pour débloquer cette devinette exclusive</p>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                      Devenir Premium
                    </Button>
                  </div>
                ) : (
                  <>
                    {!showAnswer && (
                      <div className="space-y-4">
                        <Input
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Entrez votre réponse..."
                          className="text-center text-lg py-3 border-orange-200 focus:border-orange-400"
                          onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                        />
                        
                        <div className="flex gap-3 justify-center">
                          <Button
                            onClick={handleSubmitAnswer}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Valider
                          </Button>
                          
                          <Button
                            onClick={() => setShowHint(!showHint)}
                            variant="outline"
                            className="border-orange-300 text-orange-700 hover:bg-orange-50"
                          >
                            <Lightbulb className="h-4 w-4 mr-2" />
                            Indice
                          </Button>
                        </div>
                        
                        {showHint && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-800">Indice :</span>
                            </div>
                            <p className="text-blue-700">{currentDevinette.indice}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {showAnswer && (
                      <div className="space-y-4">
                        <div className={`rounded-lg p-6 text-center ${
                          answeredCorrectly
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                            : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
                        }`}>
                          {answeredCorrectly ? (
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                          ) : (
                            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
                          )}
                          
                          <h3 className={`text-xl font-bold mb-2 ${
                            answeredCorrectly ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {answeredCorrectly ? 'Excellente réponse !' : 'Pas tout à fait...'}
                          </h3>
                          
                          <p className={`text-lg mb-4 ${
                            answeredCorrectly ? 'text-green-700' : 'text-red-700'
                          }`}>
                            La réponse était : <strong>{currentDevinette.reponse}</strong>
                          </p>
                          
                          {currentDevinette.explication && (
                            <div className="bg-white/50 rounded-lg p-4 text-left">
                              <h4 className="font-semibold text-gray-800 mb-2">Explication :</h4>
                              <p className="text-gray-700">{currentDevinette.explication}</p>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={handleNextDevinette}
                          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3"
                          disabled={currentDevIndex >= accessibleDevinettes.length - 1}
                        >
                          {currentDevIndex >= accessibleDevinettes.length - 1 ? (
                            <>
                              <Trophy className="h-4 w-4 mr-2" />
                              Toutes les devinettes terminées !
                            </>
                          ) : (
                            <>
                              Devinette suivante
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {/* Navigation */}
                <Separator />
                <div className="flex justify-between items-center">
                  <Button
                    onClick={handlePrevDevinette}
                    disabled={currentDevIndex === 0}
                    variant="outline"
                    className="border-orange-300 text-orange-700"
                  >
                    Précédente
                  </Button>
                  
                  <span className="text-sm text-gray-600 font-medium">
                    {currentDevIndex + 1} / {accessibleDevinettes.length}
                  </span>
                  
                  <Button
                    onClick={handleNextDevinette}
                    disabled={currentDevIndex >= accessibleDevinettes.length - 1}
                    variant="outline"
                    className="border-orange-300 text-orange-700"
                  >
                    Suivante
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Badges */}
            <Card className="border-orange-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Award className="h-5 w-5 text-orange-600" />
                  Badges débloqués
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {badges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                        <div className="text-yellow-600">
                          {getBadgeIcon(badge)}
                        </div>
                        <span className="text-sm font-medium text-yellow-800 capitalize">{badge}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Répondez correctement pour débloquer des badges !
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Progression par catégorie */}
            <Card className="border-orange-200 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Target className="h-5 w-5 text-orange-600" />
                  Progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Animaux', 'Nature', 'Culture', 'Spiritualité', 'Valeurs'].map(cat => {
                    const categoryQuestions = accessibleDevinettes.filter(d => d.categorie === cat);
                    const completed = categoryQuestions.filter(d => completedDevinettes.has(d.id)).length;
                    const progress = categoryQuestions.length > 0 ? (completed / categoryQuestions.length) * 100 : 0;
                    
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{cat}</span>
                          <span className="text-gray-600">{completed}/{categoryQuestions.length}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Call to action Premium */}
            {!subscribed && (
              <Card className="border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardContent className="p-6 text-center">
                  <Crown className="h-8 w-8 mx-auto mb-3 text-amber-600" />
                  <h3 className="font-bold text-amber-800 mb-2">Débloquez plus de devinettes !</h3>
                  <p className="text-sm text-amber-700 mb-4">
                    Accédez à {devinettes.filter(d => d.is_premium).length} devinettes premium supplémentaires
                  </p>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Devenir Premium
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devinettes;