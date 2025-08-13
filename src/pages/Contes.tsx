import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  PlayCircle, 
  Search, 
  Clock, 
  Crown, 
  Star, 
  Heart, 
  Lock, 
  BookOpen,
  HeadphonesIcon,
  Languages,
  Sparkles,
  TrendingUp,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { useContes } from "@/hooks/useContes";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { generateConteAudioData } from "@/lib/audioUtils";
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

import { Loader2, Image as ImageIcon } from "lucide-react";

const ConteCard = ({ conte, onPlay, onFavorite, isFavorite, canAccess, accessMessage, onGenerateCover, isGenerating }: any) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAudioPreview, setShowAudioPreview] = useState(false);
  const audioData = generateConteAudioData(conte);

  const handleCardClick = () => {
    if (!canAccess) {
      toast.error(accessMessage);
      return;
    }
    // Navigation vers la page de lecture
    window.location.href = `/conte-reading/${conte.id}`;
  };

  const handleAudioPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAudioPreview(!showAudioPreview);
    onPlay(conte);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite(conte.id);
  };

  return (
    <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 ${
      !canAccess ? 'border-amber-200 bg-gradient-to-b from-amber-50 to-amber-100' : 
      'border-orange-200 bg-gradient-to-b from-white to-orange-50 hover:border-orange-300'
    }`}
    onClick={handleCardClick}>
      <div className="relative overflow-hidden">
        {!canAccess && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 z-10 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <Crown className="h-8 w-8 text-amber-600" />
            </div>
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-orange-700 transition-colors line-clamp-2">
                {conte.titre}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1 line-clamp-2">
                {conte.description}
              </CardDescription>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteClick}
              className="ml-2 hover:bg-red-100"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Image du conte */}
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            {!imageLoaded && (
              <Skeleton className="w-full h-48" />
            )}
            <img
              src={conte.image_url || defaultImages[conte.categorie] || araigneeElephantImg}
              alt={conte.titre}
              className={`w-full h-48 object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
            
            {/* Overlay avec bouton de lecture */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                size="lg"
                onClick={handleAudioPreview}
                className="bg-white/90 hover:bg-white text-orange-600 hover:text-orange-700 rounded-full shadow-lg"
              >
                <PlayCircle className="h-8 w-8" />
              </Button>
            </div>
          </div>

          {/* Métadonnées du conte */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                <BookOpen className="h-3 w-3 mr-1" />
                {conte.categorie}
              </Badge>
              
              <Badge variant="outline" className="text-gray-600">
                <Clock className="h-3 w-3 mr-1" />
                {conte.duree_minutes} min
              </Badge>
              
              {conte.is_premium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>

            {/* Langues disponibles */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Languages className="h-4 w-4" />
              <span>{conte.langues?.join(', ') || 'Français, Bambara'}</span>
            </div>

            {/* Aperçu audio */}
            {showAudioPreview && (
              <div className="bg-orange-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-700">Aperçu audio</span>
                  <HeadphonesIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    🇫🇷 Français ({Math.floor(audioData.français.duration / 60)}min)
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    🇲🇱 Bambara ({Math.floor(audioData.bambara.duration / 60)}min)
                  </Button>
                </div>
              </div>
            )}

            {/* Bouton d'action principal */}
            <Button 
              className={`w-full ${
                canAccess 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600' 
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500'
              } text-white font-medium`}
              onClick={handleCardClick}
            >
              {canAccess ? (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Lire le conte
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Débloquer avec Premium
                </>
              )}
            </Button>

            {/* Bouton de génération d'image */}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={(e) => {
                e.stopPropagation();
                onGenerateCover(conte);
              }}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4 mr-2" />
              )}
              Générer la couverture
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const Contes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [sortBy, setSortBy] = useState("ordre");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);

  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const { contes, loading, canAccessConte, getAccessMessage, toggleFavorite, generateImage, updateConte } = useContes();

  const handleGenerateCover = async (conte: any) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour générer une image.");
      return;
    }
    setGeneratingImageId(conte.id);
    try {
      const prompt = `Couverture de conte africain pour "${conte.titre}". ${conte.description}`;
      const imageUrl = await generateImage(prompt, conte.categorie);
      if (imageUrl) {
        await updateConte(conte.id, { image_url: imageUrl });
        toast.success("Nouvelle image de couverture générée et sauvegardée !");
      }
    } catch (error) {
      toast.error("Erreur lors de la génération de l'image.");
      console.error(error);
    } finally {
      setGeneratingImageId(null);
    }
  };

  // Filtrer et trier les contes
  const filteredContes = contes
    .filter(conte => {
      const matchesSearch = conte.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conte.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Toutes" || conte.categorie === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "titre":
          return a.titre.localeCompare(b.titre);
        case "duree":
          return a.duree_minutes - b.duree_minutes;
        case "premium":
          return Number(b.is_premium) - Number(a.is_premium);
        default:
          return (a.ordre_affichage || 0) - (b.ordre_affichage || 0);
      }
    });

  // Séparer les contes gratuits et premium
  const contesGratuits = filteredContes.filter(conte => !conte.is_premium);
  const contesPremium = filteredContes.filter(conte => conte.is_premium);

  const handlePlay = (conte: any) => {
    toast.success(`Lecture de "${conte.titre}" démarrée`);
  };

  const handleFavorite = async (conteId: string) => {
    if (!user) {
      toast.error("Connectez-vous pour ajouter aux favoris");
      return;
    }
    
    try {
      const newFavoriteStatus = await toggleFavorite(conteId);
      if (newFavoriteStatus) {
        setFavorites(prev => [...prev, conteId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== conteId));
      }
    } catch (error) {
      console.error('Erreur toggle favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-orange-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-4">
            Bibliothèque de Contes Zirin
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez la richesse du patrimoine oral malien à travers nos contes traditionnels, 
            disponibles en français et en bambara.
          </p>
        </div>

        {/* Contrôles de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-orange-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un conte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-orange-200 focus:border-orange-400"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-orange-200 focus:border-orange-400">
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ordre">Ordre par défaut</SelectItem>
                <SelectItem value="titre">Titre A-Z</SelectItem>
                <SelectItem value="duree">Durée</SelectItem>
                <SelectItem value="premium">Premium en premier</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>{filteredContes.length} conte{filteredContes.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Section Contes Gratuits */}
        {contesGratuits.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Contes Gratuits</h2>
                <p className="text-gray-600">Accessibles à tous les utilisateurs</p>
              </div>
              <Badge className="bg-green-100 text-green-700">
                {contesGratuits.length} conte{contesGratuits.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contesGratuits.map(conte => (
                <ConteCard
                  key={conte.id}
                  conte={conte}
                  onPlay={handlePlay}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.includes(conte.id)}
                  canAccess={canAccessConte(conte)}
                  accessMessage={getAccessMessage(conte)}
                  onGenerateCover={handleGenerateCover}
                  isGenerating={generatingImageId === conte.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section Contes Premium */}
        {contesPremium.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Contes Premium</h2>
                <p className="text-gray-600">
                  {subscribed 
                    ? "Profitez de votre abonnement premium !" 
                    : "Abonnez-vous pour débloquer ces contes exclusifs"}
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                {contesPremium.length} conte{contesPremium.length > 1 ? 's' : ''}
              </Badge>
            </div>

            {!subscribed && (
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-amber-600" />
                    <div>
                      <h3 className="font-semibold text-amber-800">Débloquez tout le contenu premium</h3>
                      <p className="text-amber-700 text-sm">Accédez à tous les contes, audio bilingue et fonctionnalités exclusives</p>
                    </div>
                  </div>
                  <Link to="/premium">
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Devenir Premium
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contesPremium.map(conte => (
                <ConteCard
                  key={conte.id}
                  conte={conte}
                  onPlay={handlePlay}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.includes(conte.id)}
                  canAccess={canAccessConte(conte)}
                  accessMessage={getAccessMessage(conte)}
                  onGenerateCover={handleGenerateCover}
                  isGenerating={generatingImageId === conte.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Message si aucun conte trouvé */}
        {filteredContes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun conte trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contes;