import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  X, 
  Download, 
  Volume2, 
  Image, 
  Zap,
  Star,
  Infinity
} from "lucide-react";

const Premium = () => {
  const features = [
    {
      name: "Accès aux contes",
      free: "5 contes",
      premium: "Bibliothèque complète (30+ contes)",
      icon: <Check className="h-4 w-4 text-accent" />
    },
    {
      name: "Audio haute qualité",
      free: "Audio standard",
      premium: "Audio HD + voix narrateurs professionnels",
      icon: <Volume2 className="h-4 w-4 text-accent" />
    },
    {
      name: "Images IA",
      free: "3 images par conte",
      premium: "Toutes les illustrations IA",
      icon: <Image className="h-4 w-4 text-accent" />
    },
    {
      name: "Téléchargements",
      free: <X className="h-4 w-4 text-destructive" />,
      premium: "Téléchargement hors ligne illimité",
      icon: <Download className="h-4 w-4 text-accent" />
    },
    {
      name: "Devinettes",
      free: "10 devinettes",
      premium: "Collection complète (50+ devinettes)",
      icon: <Check className="h-4 w-4 text-accent" />
    },
    {
      name: "Publicités",
      free: "Avec publicités",
      premium: "Expérience sans publicité",
      icon: <X className="h-4 w-4 text-accent" />
    },
    {
      name: "Support prioritaire",
      free: <X className="h-4 w-4 text-destructive" />,
      premium: "Support client prioritaire",
      icon: <Zap className="h-4 w-4 text-accent" />
    }
  ];

  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "Toujours",
      description: "Découvrez Zirin avec notre sélection gratuite",
      features: [
        "5 contes traditionnels",
        "10 devinettes interactives",
        "Audio en français et bambara",
        "Images IA limitées",
        "Avec publicités"
      ],
      button: "Commencer gratuitement",
      variant: "outline" as const,
      popular: false
    },
    {
      name: "Premium",
      price: "4,99€",
      period: "par mois",
      description: "Accès complet à tout le patrimoine culturel",
      features: [
        "Bibliothèque complète (30+ contes)",
        "Collection complète de devinettes (50+)",
        "Audio HD avec narrateurs professionnels",
        "Toutes les illustrations IA",
        "Téléchargements hors ligne",
        "Expérience sans publicité",
        "Support prioritaire",
        "Nouvelles histoires en avant-première"
      ],
      button: "Devenir Premium",
      variant: "default" as const,
      popular: true
    },
    {
      name: "Premium Annuel",
      price: "39,99€",
      period: "par an",
      originalPrice: "59,88€",
      description: "Économisez 33% avec l'abonnement annuel",
      features: [
        "Tous les avantages Premium",
        "Économies de 33%",
        "Accès prioritaire aux nouveautés",
        "Badge de membre fondateur",
        "Contenus exclusifs collector"
      ],
      button: "Choisir annuel",
      variant: "secondary" as const,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <div className="bg-gradient-sunset text-primary-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="h-12 w-12 text-secondary" />
            <h1 className="text-5xl font-bold">Zirin Premium</h1>
          </div>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Plongez dans l'univers complet du patrimoine oral malien. 
            Débloquez tous les contes, devinettes et fonctionnalités exclusives.
          </p>
          <Badge className="bg-secondary text-secondary-foreground text-lg px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Plus de 1000 utilisateurs nous font confiance
          </Badge>
        </div>
      </div>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Comparez nos offres
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="text-center">Fonctionnalités détaillées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-2">Fonctionnalité</th>
                        <th className="text-center py-4 px-2">Gratuit</th>
                        <th className="text-center py-4 px-2 bg-primary/5 rounded-t-lg">
                          <div className="flex items-center justify-center gap-2">
                            <Crown className="h-4 w-4 text-primary" />
                            Premium
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((feature, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="py-4 px-2 font-medium">{feature.name}</td>
                          <td className="py-4 px-2 text-center text-muted-foreground">
                            {typeof feature.free === 'string' ? feature.free : feature.free}
                          </td>
                          <td className="py-4 px-2 text-center bg-primary/5">
                            <div className="flex items-center justify-center gap-2">
                              {feature.icon}
                              <span className="text-sm">{feature.premium}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Choisissez votre plan
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative shadow-warm hover:shadow-glow transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-primary scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                    {plan.originalPrice && (
                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="line-through">{plan.originalPrice}</span>
                        <Badge variant="secondary" className="ml-2">
                          -33%
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.variant} 
                    size="lg" 
                    className={`w-full ${
                      plan.variant === 'default' 
                        ? 'bg-gradient-primary hover:shadow-warm' 
                        : plan.variant === 'secondary'
                        ? 'bg-secondary hover:bg-secondary/90'
                        : ''
                    }`}
                  >
                    {plan.button}
                    {plan.name === "Premium Annuel" && (
                      <Infinity className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Questions fréquentes
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Puis-je annuler mon abonnement à tout moment ?",
                a: "Oui, vous pouvez annuler votre abonnement Premium à tout moment depuis votre profil. Vous garderez l'accès aux fonctionnalités Premium jusqu'à la fin de votre période de facturation."
              },
              {
                q: "Les contenus téléchargés restent-ils disponibles après annulation ?",
                a: "Les contenus téléchargés pendant votre période Premium resteront disponibles sur votre appareil, mais vous ne pourrez plus en télécharger de nouveaux."
              },
              {
                q: "Y a-t-il une période d'essai gratuite ?",
                a: "Oui ! Nous offrons 7 jours d'essai gratuit pour découvrir toutes les fonctionnalités Premium sans engagement."
              },
              {
                q: "Les nouveaux contes sont-ils inclus dans l'abonnement ?",
                a: "Absolument ! Tous les nouveaux contes et devinettes ajoutés à la bibliothèque sont automatiquement inclus dans votre abonnement Premium."
              }
            ].map((faq, index) => (
              <Card key={index} className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Premium;