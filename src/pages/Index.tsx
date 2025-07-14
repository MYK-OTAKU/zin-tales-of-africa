import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { 
  BookOpen, 
  HelpCircle, 
  Headphones, 
  Image, 
  Crown, 
  Users, 
  ArrowRight,
  Sparkles,
  Heart,
  Globe
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { subscribed, subscription_tier } = useSubscription();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Contes Authentiques",
      description: "Découvrez les histoires traditionnelles du Mali transmises de génération en génération.",
      premium: false
    },
    {
      icon: <Headphones className="h-8 w-8 text-primary" />,
      title: "Audio Bilingue",
      description: "Écoutez en français et en bambara avec des narrateurs natifs.",
      premium: false
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-primary" />,
      title: "Devinettes Interactives",
      description: "Testez votre sagesse avec des énigmes traditionnelles malienness.",
      premium: false
    },
    {
      icon: <Image className="h-8 w-8 text-primary" />,
      title: "Images IA",
      description: "Illustrations générées par IA pour accompagner chaque histoire.",
      premium: true
    },
    {
      icon: <Crown className="h-8 w-8 text-primary" />,
      title: "Mode Premium",
      description: "Accès complet à la bibliothèque et fonctionnalités exclusives.",
      premium: true
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Communauté",
      description: "Partagez et découvrez de nouvelles histoires avec d'autres passionnés.",
      premium: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-12 w-12 text-secondary animate-pulse" />
            <h1 className="text-6xl font-bold bg-gradient-text bg-clip-text text-transparent">
              Zirin
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Plongez dans l'univers magique du patrimoine oral malien. 
            Découvrez des contes authentiques, des devinettes ancestrales et la richesse culturelle de l'Afrique de l'Ouest.
          </p>
          
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge className={`text-lg px-4 py-2 ${
                  subscribed 
                    ? 'bg-gradient-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  <Crown className="w-4 h-4 mr-2" />
                  {subscribed ? `${subscription_tier}` : 'Compte Gratuit'}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-primary hover:shadow-warm">
                  <Link to="/contes">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Découvrir les Contes
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/devinettes">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Énigmes Traditionnelles
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-sunset text-primary-foreground p-8 rounded-2xl max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                  <Heart className="h-6 w-6" />
                  Commencez votre voyage culturel
                </h2>
                <p className="mb-6 opacity-90">
                  Rejoignez des milliers d'amoureux de la culture africaine. 
                  Créez votre compte pour accéder aux histoires et découvrir la sagesse ancestrale.
                </p>
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/auth">
                    <Globe className="w-5 h-5 mr-2" />
                    Rejoindre la Communauté
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Déjà membre ? <Link to="/auth" className="text-primary hover:underline">Se connecter</Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Découvrez nos fonctionnalités
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-warm hover:shadow-glow transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {feature.title}
                    {feature.premium && (
                      <Badge variant="secondary" className="text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      {!user && (
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <Card className="max-w-2xl mx-auto shadow-elegant bg-gradient-primary text-primary-foreground">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Prêt à explorer la richesse culturelle africaine ?
                </h3>
                <p className="mb-6 opacity-90">
                  Commencez votre voyage dès maintenant et découvrez des histoires qui ont façonné des générations.
                </p>
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/auth">
                    Commencer l'aventure
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
