import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb, Star, Crown, Users, Headphones } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Zirin
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Contes et Devinettes du Mali
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Préservons ensemble le patrimoine oral africain. Découvrez des histoires ancestrales 
            et testez votre sagesse avec nos devinettes traditionnelles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground hover:shadow-warm">
              <Link to="/contes">
                <BookOpen className="mr-2 h-5 w-5" />
                Explorer les Contes
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/devinettes">
                <Lightbulb className="mr-2 h-5 w-5" />
                Jouer aux Devinettes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Une expérience culturelle unique
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border bg-card hover:shadow-warm transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-foreground">Contes Authentiques</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Découvrez plus de 30 contes traditionnels maliens, chacun avec sa morale 
                  et ses enseignements ancestraux.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-warm transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-foreground">Audio Bilingue</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Écoutez les contes en français et en bambara avec des narrateurs 
                  authentiques pour une immersion totale.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-warm transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-foreground">Devinettes Interactives</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Testez votre sagesse avec plus de 20 devinettes traditionnelles 
                  et gagnez des points pour débloquer de nouveaux contenus.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border bg-card hover:shadow-warm transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-foreground">Images IA</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Chaque conte est illustré avec des images générées par IA 
                  qui capturent l'essence et l'ambiance de l'histoire.
                </CardDescription>
              </CardContent>
            </Card>

            <Link to="/premium" className="cursor-pointer">
              <Card className="border-border bg-card hover:shadow-warm transition-all duration-300 h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <Crown className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-foreground">Mode Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Accès illimité à toute la bibliothèque, téléchargements hors ligne
                    et expérience sans publicité.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-border bg-card hover:shadow-warm transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-foreground">Communauté</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Rejoignez une communauté passionnée par la préservation 
                  du patrimoine oral africain.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-16 bg-gradient-sunset">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Commencez votre voyage culturel
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Rejoignez des milliers d'utilisateurs qui redécouvrent leurs racines 
            et préservent leur patrimoine culturel.
          </p>
          <Button asChild size="lg" variant="secondary" className="shadow-glow">
            <Link to="/auth">
              Créer mon compte gratuitement
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;