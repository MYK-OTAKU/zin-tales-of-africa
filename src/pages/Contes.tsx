import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, Search, Clock, Crown, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data pour les contes
const contes = [
  {
    id: 1,
    titre: "L'Araignée et l'Éléphant",
    description: "Une histoire sur la ruse et l'intelligence face à la force brute.",
    categorie: "Sagesse",
    duree: "8 min",
    isPremium: false,
    imageUrl: "/api/placeholder/400/250",
    langues: ["français", "bambara"]
  },
  {
    id: 2,
    titre: "Le Lion et la Petite Souris",
    description: "Conte sur l'amitié improbable et l'entraide entre les animaux.",
    categorie: "Amitié",
    duree: "6 min",
    isPremium: false,
    imageUrl: "/api/placeholder/400/250",
    langues: ["français", "bambara"]
  },
  {
    id: 3,
    titre: "La Princesse des Eaux",
    description: "L'histoire mystique d'une princesse qui règne sur les rivières.",
    categorie: "Mystique",
    duree: "12 min",
    isPremium: true,
    imageUrl: "/api/placeholder/400/250",
    langues: ["français", "bambara"]
  },
  {
    id: 4,
    titre: "Le Griot et ses Trois Fils",
    description: "Une leçon sur l'héritage culturel et la transmission du savoir.",
    categorie: "Famille",
    duree: "10 min",
    isPremium: true,
    imageUrl: "/api/placeholder/400/250",
    langues: ["français", "bambara"]
  },
  {
    id: 5,
    titre: "Le Baobab Magique",
    description: "L'arbre sacré qui exauce les vœux des cœurs purs.",
    categorie: "Magie",
    duree: "9 min",
    isPremium: false,
    imageUrl: "/api/placeholder/400/250",
    langues: ["français", "bambara"]
  },
  {
    id: 6,
    titre: "Le Chasseur et l'Esprit de la Forêt",
    description: "Une aventure sur le respect de la nature et ses mystères.",
    categorie: "Aventure",
    duree: "14 min",
    isPremium: true,
    imageUrl: "/api/placeholder/400/250",
    langues: ["français", "bambara"]
  }
];

const categories = ["Toutes", "Sagesse", "Amitié", "Mystique", "Famille", "Magie", "Aventure"];

const Contes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

  const filteredContes = contes.filter(conte => {
    const matchesSearch = conte.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conte.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || conte.categorie === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContes.map((conte) => (
            <Card key={conte.id} className="group hover:shadow-warm transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img 
                  src={conte.imageUrl} 
                  alt={conte.titre}
                  className="w-full h-48 object-cover"
                />
                {conte.isPremium && (
                  <Crown className="absolute top-3 right-3 h-6 w-6 text-secondary fill-current" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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
                  {conte.isPremium && (
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
                    {conte.duree}
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
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-secondary fill-current" />
                    <span className="text-sm text-muted-foreground ml-1">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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