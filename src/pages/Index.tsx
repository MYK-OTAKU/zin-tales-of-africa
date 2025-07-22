import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useContes } from "@/hooks/useContes";
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
  Globe,
  Play,
  Star,
  TrendingUp,
  Clock,
  Award,
  Zap,
  User
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { subscribed, subscription_tier } = useSubscription();
  const { contes, loading } = useContes();

  // Statistiques pour utilisateurs connectés
  const contesGratuits = contes.filter(conte => !conte.is_premium).length;
  const contesPremium = contes.filter(conte => conte.is_premium).length;

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-orange-600" />,
      title: "Contes Authentiques",
      description: "Découvrez les histoires traditionnelles du Mali transmises de génération en génération.",
      premium: false
    },
    {
      icon: <Headphones className="h-8 w-8 text-orange-600" />,
      title: "Audio Bilingue",
      description: "Écoutez en français et en bambara avec des narrateurs natifs.",
      premium: false
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-orange-600" />,
      title: "Devinettes Interactives",
      description: "Testez votre sagesse avec des énigmes traditionnelles maliennes.",
      premium: false
    },
    {
      icon: <Image className="h-8 w-8 text-amber-600" />,
      title: "Images IA",
      description: "Illustrations générées par IA pour accompagner chaque histoire.",
      premium: true
    },
    {
      icon: <Crown className="h-8 w-8 text-amber-600" />,
      title: "Contenu Premium",
      description: "Accès illimité à tous les contes et fonctionnalités exclusives.",
      premium: true
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      title: "Patrimoine Préservé",
      description: "Contribuez à la sauvegarde du patrimoine oral africain.",
      premium: false
    }
  ];

  const stats = [
    { number: contesGratuits + contesPremium, label: "Contes disponibles", icon: <BookOpen className="h-5 w-5" /> },
    { number: "2", label: "Langues", icon: <Globe className="h-5 w-5" /> },
    { number: "15+", label: "Devinettes", icon: <HelpCircle className="h-5 w-5" /> },
    { number: "100%", label: "Authenticité", icon: <Heart className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-amber-100/50"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Patrimoine Oral Malien
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-6">
              Bienvenue sur Zirin
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed">
              Découvrez et préservez la richesse des contes traditionnels du Mali. 
              Une expérience immersive entre tradition et modernité.
            </p>

            {/* Actions pour utilisateurs déconnectés */}
            {!user && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-8 mb-8">
                  <h3 className="text-2xl font-bold mb-4">Commencez votre voyage culturel</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Rejoignez notre communauté et explorez l'héritage oral du Mali
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                      <Link to="/auth">
                        <Users className="h-5 w-5 mr-2" />
                        Créer un compte gratuit
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      <Link to="/contes">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Explorer les contes
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions pour utilisateurs connectés */}
            {user && (
              <div className="space-y-6">
                <div className={`${subscribed ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white rounded-2xl p-8`}>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {subscribed ? (
                      <>
                        <Crown className="h-8 w-8 text-yellow-300" />
                        <h3 className="text-2xl font-bold">Bienvenue, membre Premium !</h3>
                      </>
                    ) : (
                      <>
                        <Heart className="h-8 w-8" />
                        <h3 className="text-2xl font-bold">Bon retour, {user.email?.split('@')[0]} !</h3>
                      </>
                    )}
                  </div>
                  
                  {subscribed ? (
                    <div>
                      <p className="text-lg mb-6 opacity-90">
                        Profitez de votre accès illimité à tous nos contes premium et fonctionnalités exclusives
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold">
                          <Link to="/contes">
                            <BookOpen className="h-5 w-5 mr-2" />
                            Continuer la lecture
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                          <Link to="/profile">
                            <User className="h-5 w-5 mr-2" />
                            Mon profil
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg mb-6 opacity-90">
                        Vous avez accès à {contesGratuits} contes gratuits. Découvrez {contesPremium} contes premium supplémentaires !
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                          <Link to="/contes">
                            <BookOpen className="h-5 w-5 mr-2" />
                            Explorer les contes
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                          <Link to="/premium">
                            <TrendingUp className="h-5 w-5 mr-2" />
                            Devenir Premium
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-orange-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-3 text-orange-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Une expérience culturelle complète
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Zirin combine tradition et innovation pour offrir une expérience immersive 
              de découverte du patrimoine oral malien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 ${
                feature.premium 
                  ? 'border-amber-200 bg-gradient-to-b from-amber-50 to-orange-50' 
                  : 'border-orange-200 bg-gradient-to-b from-white to-orange-50'
              }`}>
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      feature.premium ? 'bg-gradient-to-r from-amber-100 to-orange-100' : 'bg-gradient-to-r from-orange-100 to-amber-100'
                    }`}>
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-gray-800 flex items-center justify-center gap-2">
                    {feature.title}
                    {feature.premium && <Crown className="h-4 w-4 text-amber-600" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  {feature.premium && (
                    <div className="mt-4 text-center">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        Premium
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Aperçu Contes (pour tous) */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Découvrez nos contes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une sélection de contes traditionnels pour tous les âges, 
              porteurs de sagesse et de valeurs ancestrales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Exemple de cartes de contes */}
            {[
              { title: "L'Araignée et l'Éléphant", category: "Sagesse", duration: 8, premium: false },
              { title: "La Princesse des Eaux", category: "Mystique", duration: 12, premium: true },
              { title: "Le Baobab Magique", category: "Magie", duration: 9, premium: false }
            ].map((conte, index) => (
              <Card key={index} className={`overflow-hidden hover:shadow-lg transition-shadow ${
                conte.premium ? 'border-amber-200' : 'border-orange-200'
              }`}>
                <div className="h-32 bg-gradient-to-br from-orange-200 to-amber-200 relative">
                  {conte.premium && (
                    <div className="absolute top-2 right-2">
                      <Crown className="h-5 w-5 text-amber-600" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{conte.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <Badge variant="outline">{conte.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {conte.duration} min
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
              <Link to="/contes">
                <BookOpen className="h-5 w-5 mr-2" />
                Voir tous les contes
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      {!subscribed && (
        <section className="py-16 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Crown className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Débloquez tout le potentiel de Zirin
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Accédez à tous nos contes premium, fonctionnalités IA et contenus exclusifs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                <Link to="/premium">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Découvrir Premium
                </Link>
              </Button>
              {!user && (
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/auth">
                    <Users className="h-5 w-5 mr-2" />
                    Créer un compte
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
