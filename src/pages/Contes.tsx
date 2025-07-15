import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, Search, Clock, Crown, Star, Heart, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useContes } from "@/hooks/useContes";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

// Import des images par défaut
import araigneeElephantImg from "@/assets/conte-araignee-elephant.jpg";
import lionSourisImg from "@/assets/conte-lion-souris.jpg";
import princesseEauxImg from "@/assets/conte-princesse-eaux.jpg";
import griotFilsImg from "@/assets/conte-griot-fils.jpg";
import baobabMagiqueImg from "@/assets/conte-baobab-magique.jpg";
import chasseurEspritImg from "@/assets/conte-chasseur-esprit.jpg";

// Images par défaut par catégorie
const defaultImages: { [key: string]: string } = {
  "Sagesse": araigneeElephantImg,
  "Amitié": lionSourisImg,
  "Mystique": princesseEauxImg,
  "Famille": griotFilsImg,
  "Magie": baobabMagiqueImg,
  "Aventure": chasseurEspritImg
};

const categories = ["Toutes", "Sagesse", "Amitié", "Mystique", "Famille", "Magie", "Aventure"];

const Contes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const { contes, loading, canAccessConte, getAccessMessage } = useContes();

  const filteredContes = contes.filter(conte => {
    const matchesSearch = conte.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conte.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || conte.categorie === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConteClick = (conte: any) => {
    const accessMessage = getAccessMessage(conte);
    if (accessMessage) {
      toast.error(accessMessage);
      return;
    }
  };

  const getCategoryColor = (categorie: string) => {
    const colors: { [key: string]: string } = {
      "Sagesse": "bg-accent text-accent-foreground",
      "Amitié": "bg-primary text-primary-foreground",
      "Mystique": "bg-secondary text-secondary-foreground",
      "Famille": "bg-muted text-muted-foreground",
      "Magie": "bg-primary-glow text-primary-foreground",
      "Aventure": "bg-accent text-accent-foreground"
    };
    return colors[categorie] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Contes Traditionnels</h1>
          <p className="text-xl opacity-90">
            Découvrez la richesse du patrimoine oral malien à travers nos contes authentiques
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un conte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-muted rounded w-16"></div>
                    <div className="h-3 bg-muted rounded w-12"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContes.map((conte) => {
              const isAccessible = canAccessConte(conte);
              const imageUrl = conte.image_url || defaultImages[conte.categorie] || araigneeElephantImg;
              
              return (
                <Card key={conte.id} className={`group hover:shadow-warm transition-all duration-300 overflow-hidden ${!isAccessible ? 'opacity-75' : ''}`}>
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt={conte.titre}
                      className="w-full h-48 object-cover"
                    />
                    {conte.is_premium && (
                      <Crown className="absolute top-3 right-3 h-6 w-6 text-secondary fill-current" />
                    )}
                    {!isAccessible && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm font-medium">Premium</p>
                        </div>
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${!isAccessible ? 'hidden' : ''}`}>
                      <Button asChild variant="secondary" size="sm">
                        <Link to={`/conte/${conte.id}`}>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Écouter
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg leading-tight">{conte.titre}</CardTitle>
                      {conte.is_premium && (
                        <Badge variant="secondary" className="ml-2">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{conte.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getCategoryColor(conte.categorie)}>
                        {conte.categorie}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {conte.duree_minutes} min
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {conte.langues.map((langue) => (
                          <Badge key={langue} variant="outline" className="text-xs">
                            {langue}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-secondary fill-current" />
                          <span className="text-sm text-muted-foreground ml-1">4.8</span>
                        </div>
                        {user && isAccessible && (
                          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                            <Heart className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {!isAccessible && (
                      <div className="mt-3 pt-3 border-t">
                        <Button 
                          onClick={handleConteClick}
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                        >
                          <Lock className="w-3 h-3 mr-2" />
                          Débloquer avec Premium
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredContes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun conte trouvé pour votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contes;