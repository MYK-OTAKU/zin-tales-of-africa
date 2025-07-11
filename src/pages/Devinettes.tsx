import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Trophy, Star, Eye, EyeOff, CheckCircle, XCircle, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data pour les devinettes
const devinettes = [
  {
    id: 1,
    question: "Je suis grand et fort, mais j'ai peur des souris. Qui suis-je ?",
    reponse: "Un éléphant",
    difficulte: "Facile",
    points: 10,
    indice: "Je vis en Afrique et j'ai une trompe.",
    categorie: "Animaux"
  },
  {
    id: 2,
    question: "Je n'ai pas de jambes mais je cours toujours. Que suis-je ?",
    reponse: "Une rivière",
    difficulte: "Moyen",
    points: 15,
    indice: "Je coule vers la mer.",
    categorie: "Nature"
  },
  {
    id: 3,
    question: "Plus tu me donnes, plus je grandis. Mais plus tu me retires, plus je rapetisse. Que suis-je ?",
    reponse: "Un trou",
    difficulte: "Difficile",
    points: 25,
    indice: "On peut y tomber dedans.",
    categorie: "Logique"
  },
  {
    id: 4,
    question: "Je chante sans voix, je vole sans ailes. Que suis-je ?",
    reponse: "L'écho",
    difficulte: "Moyen",
    points: 15,
    indice: "Tu m'entends dans les montagnes.",
    categorie: "Phénomènes"
  },
  {
    id: 5,
    question: "Je suis invisible mais tout le monde me cherche. Que suis-je ?",
    reponse: "Le bonheur",
    difficulte: "Difficile",
    points: 25,
    indice: "Tout le monde en veut.",
    categorie: "Philosophie"
  }
];

const Devinettes = () => {
  const [currentDevinette, setCurrentDevinette] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { toast } = useToast();

  const currentQ = devinettes[currentDevinette];

  const getDifficultyColor = (difficulte: string) => {
    const colors: { [key: string]: string } = {
      "Facile": "bg-accent text-accent-foreground",
      "Moyen": "bg-secondary text-secondary-foreground",
      "Difficile": "bg-primary text-primary-foreground"
    };
    return colors[difficulte] || "bg-muted text-muted-foreground";
  };

  const checkAnswer = () => {
    const correct = userAnswer.toLowerCase().trim() === currentQ.reponse.toLowerCase().trim();
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct && !answeredQuestions.includes(currentQ.id)) {
      const newScore = score + currentQ.points;
      setScore(newScore);
      setAnsweredQuestions([...answeredQuestions, currentQ.id]);
      toast({
        title: "Bravo ! 🎉",
        description: `Bonne réponse ! Vous gagnez ${currentQ.points} points.`,
      });
    } else if (!correct) {
      toast({
        title: "Dommage !",
        description: "Ce n'est pas la bonne réponse. Essayez encore !",
        variant: "destructive"
      });
    }
  };

  const nextDevinette = () => {
    if (currentDevinette < devinettes.length - 1) {
      setCurrentDevinette(currentDevinette + 1);
      setUserAnswer("");
      setShowAnswer(false);
      setShowHint(false);
      setIsCorrect(null);
    }
  };

  const previousDevinette = () => {
    if (currentDevinette > 0) {
      setCurrentDevinette(currentDevinette - 1);
      setUserAnswer("");
      setShowAnswer(false);
      setShowHint(false);
      setIsCorrect(null);
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      toast({
        title: "Indice révélé",
        description: "Voici un petit indice pour vous aider !",
      });
    }
  };

  const progress = ((currentDevinette + 1) / devinettes.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Devinettes Traditionnelles</h1>
          <p className="text-xl opacity-90">
            Testez votre sagesse avec nos devinettes ancestrales du Mali
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Score and Progress */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-secondary" />
                <span className="font-semibold text-foreground">Score: {score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-accent" />
                <span className="text-muted-foreground">{answeredQuestions.length}/{devinettes.length} résolues</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Question {currentDevinette + 1} sur {devinettes.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Devinette Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-warm">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Devinette #{currentQ.id}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(currentQ.difficulte)}>
                    {currentQ.difficulte}
                  </Badge>
                  <Badge variant="outline">
                    <Star className="w-3 h-3 mr-1" />
                    {currentQ.points} pts
                  </Badge>
                </div>
              </div>
              
              <CardDescription className="text-lg leading-relaxed">
                {currentQ.question}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Answer Input */}
              <div className="space-y-4">
                <Input
                  placeholder="Tapez votre réponse ici..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !showAnswer && checkAnswer()}
                  disabled={showAnswer}
                  className="text-lg"
                />

                <div className="flex flex-wrap gap-3">
                  {!showAnswer && (
                    <>
                      <Button 
                        onClick={checkAnswer} 
                        disabled={!userAnswer.trim()}
                        className="bg-gradient-primary hover:shadow-warm"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Vérifier ma réponse
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={toggleHint}
                        className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      >
                        {showHint ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {showHint ? "Cacher l'indice" : "Voir un indice"}
                      </Button>
                    </>
                  )}

                  {showAnswer && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAnswer(false)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Essayer à nouveau
                    </Button>
                  )}
                </div>
              </div>

              {/* Hint */}
              {showHint && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    <span className="font-medium text-accent">Indice</span>
                  </div>
                  <p className="text-muted-foreground">{currentQ.indice}</p>
                </div>
              )}

              {/* Answer Reveal */}
              {showAnswer && (
                <div className={`p-4 border rounded-lg ${isCorrect 
                  ? 'bg-accent/10 border-accent/20' 
                  : 'bg-destructive/10 border-destructive/20'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-accent" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="font-medium">
                      {isCorrect ? "Excellente réponse !" : "La bonne réponse était :"}
                    </span>
                  </div>
                  <p className="text-lg font-semibold">{currentQ.reponse}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={previousDevinette}
                  disabled={currentDevinette === 0}
                >
                  Précédente
                </Button>
                
                <Button 
                  onClick={nextDevinette}
                  disabled={currentDevinette === devinettes.length - 1}
                  className="bg-gradient-primary hover:shadow-warm"
                >
                  Suivante
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          {currentDevinette === devinettes.length - 1 && answeredQuestions.length === devinettes.length && (
            <Card className="mt-8 shadow-warm">
              <CardHeader>
                <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
                  <Trophy className="h-8 w-8 text-secondary" />
                  Félicitations !
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg mb-4">
                  Vous avez terminé toutes les devinettes avec un score de <strong>{score} points</strong> !
                </p>
                <Button className="bg-gradient-primary hover:shadow-warm">
                  Recommencer le défi
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devinettes;