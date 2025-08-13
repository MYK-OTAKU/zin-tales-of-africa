import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
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
  ArrowRight,
  Flame,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import { useDevinettes, Devinette } from "@/hooks/useDevinettes";

const normalizeAnswer = (answer: string) => {
  return answer
    .toLowerCase()
    .normalize("NFD") // Decompose accents
    .replace(/[\u0300-\u036f]/g, "") // Remove accent characters
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"") // Remove punctuation
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/^(un|une|le|la|les|l')\s/g, '') // Remove articles at the beginning
    .trim();
};

const Devinettes = () => {
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const { devinettes, accessibleDevinettes, progress, loading, updateProgress } = useDevinettes();

  const [currentDevIndex, setCurrentDevIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  
  const currentDevinette = accessibleDevinettes[currentDevIndex];
  
  const experienceToNextLevel = (progress?.level || 1) * 100;
  const levelProgress = ((progress?.experience || 0) % 100);

  const checkBadges = (newScore: number, newStreak: number) => {
    const currentBadges = progress?.badges || [];
    const newBadges = [...currentBadges];
    
    if (newScore >= 50 && !currentBadges.includes('débutant')) newBadges.push('débutant');
    if (newScore >= 150 && !currentBadges.includes('apprenti')) newBadges.push('apprenti');
    if (newScore >= 300 && !currentBadges.includes('sage')) newBadges.push('sage');
    if (newScore >= 500 && !currentBadges.includes('maître')) newBadges.push('maître');
    if (newStreak >= 5 && !currentBadges.includes('série')) newBadges.push('série');
    if (newStreak >= 10 && !currentBadges.includes('champion')) newBadges.push('champion');
    if ((progress?.completed_devinettes.length || 0) >= 10 && !currentBadges.includes('explorateur')) newBadges.push('explorateur');
    if ((progress?.completed_devinettes.length || 0) >= 20 && !currentBadges.includes('expert')) newBadges.push('expert');
    
    if (newBadges.length > currentBadges.length) {
      updateProgress({ badges: newBadges });
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
  
  const handleSubmitAnswer = () => {
    if (!userAnswer.trim() || !progress) {
      toast.error("Veuillez entrer une réponse");
      return;
    }
    
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(currentDevinette.reponse);
    setAnsweredCorrectly(isCorrect);
    setShowAnswer(true);
    
    if (isCorrect) {
      const points = currentDevinette.points * multiplier;
      const newScore = progress.score + points;
      const newStreak = progress.streak + 1;
      const newExperience = progress.experience + points;
      const newCompleted = [...progress.completed_devinettes, currentDevinette.id];
      
      let newLevel = progress.level;
      if (newExperience >= experienceToNextLevel) {
        newLevel += 1;
        toast.success(`🎉 Niveau ${newLevel} atteint !`);
      }
      
      if (newStreak > 0 && newStreak % 3 === 0) {
        setMultiplier(Math.min(multiplier + 0.5, 3));
        toast.success(`🔥 Multiplicateur x${Math.min(multiplier + 0.5, 3)} !`);
      }
      
      const newProgress = {
        score: newScore,
        streak: newStreak,
        experience: newExperience,
        level: newLevel,
        completed_devinettes: newCompleted,
      };

      updateProgress(newProgress);
      checkBadges(newScore, newStreak);
      toast.success(`Excellente réponse ! +${points} points`);
    } else {
      setMultiplier(1);
      updateProgress({ streak: 0 });
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

  if (loading || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-amber-50 to-orange-50">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

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
                <div className="text-2xl font-bold">{progress.score}</div>
                <div className="text-sm opacity-90">Points</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{progress.level}</div>
                <div className="text-sm opacity-90">Niveau</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <Flame className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{progress.streak}</div>
                <div className="text-sm opacity-90">Série</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{progress.badges.length}</div>
                <div className="text-sm opacity-90">Badges</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Barre d'expérience */}
          <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Niveau {progress.level}</span>
                <span className="text-sm text-gray-500">{progress.experience}/{experienceToNextLevel} XP</span>
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
                {progress.badges.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {progress.badges.map((badge, index) => (
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
                    const completed = categoryQuestions.filter(d => progress.completed_devinettes.includes(d.id)).length;
                    const progressValue = categoryQuestions.length > 0 ? (completed / categoryQuestions.length) * 100 : 0;
                    
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{cat}</span>
                          <span className="text-gray-600">{completed}/{categoryQuestions.length}</span>
                        </div>
                        <Progress value={progressValue} className="h-2" />
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