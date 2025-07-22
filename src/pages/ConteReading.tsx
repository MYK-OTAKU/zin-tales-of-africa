import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  BookOpen, 
  Scroll,
  Crown,
  Download,
  Languages,
  Heart,
  Sparkles,
  Lock,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Settings,
  Headphones,
  Moon,
  Sun,
  Bookmark,
  Share2,
  VolumeX
} from "lucide-react";
import { useContes, type Conte, type ContePage } from "@/hooks/useContes";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
import { AudioManager, generateConteAudioData, useAudioTextSync } from "@/lib/audioUtils";
import { toast } from "sonner";

// Import des images par défaut
import araigneeElephantImg from "@/assets/conte-araignee-elephant.jpg";
import lionSourisImg from "@/assets/conte-lion-souris.jpg";
import princesseEauxImg from "@/assets/conte-princesse-eaux.jpg";
import griotFilsImg from "@/assets/conte-griot-fils.jpg";
import baobabMagiqueImg from "@/assets/conte-baobab-magique.jpg";
import chasseurEspritImg from "@/assets/conte-chasseur-esprit.jpg";

const defaultImages: { [key: string]: string } = {
  "Sagesse": araigneeElephantImg,
  "Amitié": lionSourisImg,
  "Mystique": princesseEauxImg,
  "Famille": griotFilsImg,
  "Magie": baobabMagiqueImg,
  "Aventure": chasseurEspritImg
};

// Contenu exemple des contes (simule les pages du conte)
const sampleConteContent = {
  pages: [
    {
      numero: 1,
      contenu: "Il était une fois, dans un petit village du Mali, une araignée très rusée nommée Anansi. Elle était connue dans tout le village pour son intelligence et sa capacité à résoudre les problèmes les plus difficiles.",
      image: araigneeElephantImg
    },
    {
      numero: 2,
      contenu: "Un jour, un énorme éléphant arriva dans le village. Il était si grand et si fort qu'il écrasait tout sur son passage. Les villageois avaient peur et ne savaient plus quoi faire.",
      image: araigneeElephantImg
    },
    {
      numero: 3,
      contenu: "Anansi observa l'éléphant pendant quelques jours. Elle remarqua qu'il avait soif et cherchait constamment de l'eau. Elle eut alors une idée géniale pour aider le village.",
      image: araigneeElephantImg
    },
    {
      numero: 4,
      contenu: "Anansi tissa une toile géante près du puits du village. Quand l'éléphant vint boire, il se prit les pattes dans la toile. Mais au lieu de se débattre, il se calma.",
      image: araigneeElephantImg
    },
    {
      numero: 5,
      contenu: "L'araignée lui expliqua qu'elle pouvait l'aider à trouver un endroit parfait avec beaucoup d'eau, à condition qu'il promette de ne plus détruire le village.",
      image: araigneeElephantImg
    }
  ],
  morale: "L'intelligence et la ruse peuvent triompher de la force brute. Il ne faut jamais sous-estimer quelqu'un à cause de sa taille ou de son apparence."
};

const ConteReading = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { 
    fetchContePages, 
    fetchUserProgress, 
    updateUserProgress, 
    canAccessConte, 
    getAccessMessage 
  } = useContes();

  // États du conte
  const [conte, setConte] = useState<Conte | null>(null);
  const [pages, setPages] = useState<any[]>(sampleConteContent.pages);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<"page" | "continu">("page");
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  // États audio
  const [selectedLanguage, setSelectedLanguage] = useState("français");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.8]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioManager] = useState(new AudioManager());

  // États UI
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const [textHighlight, setTextHighlight] = useState("");

  // Générer les données audio
  const audioData = conte ? generateConteAudioData(conte) : null;
  const currentAudioData = audioData ? audioData[selectedLanguage as keyof typeof audioData] : null;

  // Hook pour synchronisation texte-audio
  const currentPageContent = pages[currentPage]?.contenu || "";
  const { getHighlightedText } = useAudioTextSync(currentPageContent, duration);

  // Charger le conte
  useEffect(() => {
    const loadConte = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Récupérer le conte depuis Supabase
        const { data: conteData, error: conteError } = await supabase
          .from('contes')
          .select('*')
          .eq('id', id)
          .single();

        if (conteError) throw conteError;
        
        setConte(conteData);

        // Vérifier l'accès
        if (!canAccessConte(conteData)) {
          const message = getAccessMessage(conteData);
          if (message) {
            toast.error(message);
            navigate('/contes');
            return;
          }
        }

        // Charger le progrès utilisateur
        if (user) {
          const progress = await fetchUserProgress(id);
          if (progress) {
            setCurrentPage(progress.derniere_page - 1);
          }
        }

      } catch (error) {
        console.error('Erreur chargement conte:', error);
        toast.error('Erreur lors du chargement du conte');
        navigate('/contes');
      } finally {
        setLoading(false);
      }
    };

    loadConte();
  }, [id]);

  // Configuration audio
  useEffect(() => {
    if (currentAudioData) {
      audioManager.setCallbacks({
        onTimeUpdate: (time) => {
          setCurrentTime(time);
          setTextHighlight(getHighlightedText(time));
        },
        onDurationChange: (dur) => setDuration(dur),
        onEnded: () => {
          setIsPlaying(false);
          handleNextPage();
        }
      });

      audioManager.loadAudio(currentAudioData.url);
    }
  }, [currentAudioData]);

  // Gestion de la lecture audio
  const togglePlayPause = () => {
    if (isPlaying) {
      audioManager.pause();
    } else {
      audioManager.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    audioManager.setCurrentTime(newTime);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    audioManager.setVolume(newVolume[0]);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    audioManager.setPlaybackRate(speed);
  };

  // Navigation entre pages
  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      updateProgress(newPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      updateProgress(newPage);
    }
  };

  const updateProgress = async (pageIndex: number) => {
    if (!conte || !user) return;
    
    const progress = ((pageIndex + 1) / pages.length) * 100;
    setReadingProgress(progress);
    
    try {
      await updateUserProgress(
        conte.id, 
        pageIndex + 1, 
        pageIndex === pages.length - 1
      );
    } catch (error) {
      console.error('Erreur mise à jour progrès:', error);
    }
  };

  // Gestion des favoris
  const handleToggleFavorite = async () => {
    if (!conte || !user) {
      toast.error("Connectez-vous pour ajouter aux favoris");
      return;
    }
    
    await toggleFavorite(conte.id);
  };

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!conte) return null;

  const currentPageData = pages[currentPage];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-b from-orange-50 via-amber-50 to-orange-50 text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-6 border ${isDarkMode ? 'border-gray-700' : 'border-orange-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/contes')}
              className={`${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-orange-100 text-gray-700'}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux contes
            </Button>

            <div className="flex items-center gap-2">
              {conte.is_premium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-red-100'}`}
              >
                <Heart className={`h-4 w-4 ${conte && isFavorite(conte.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {conte.titre}
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary" className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-orange-100 text-orange-700'}`}>
                {conte.categorie}
              </Badge>
              <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Clock className="h-4 w-4" />
                {conte.duree_minutes} minutes
              </span>
              <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <BookOpen className="h-4 w-4" />
                Page {currentPage + 1} sur {pages.length}
              </span>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Progression de lecture
              </span>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {Math.round(readingProgress)}%
              </span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
        </div>

        {/* Paramètres rapides */}
        {showSettings && (
          <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'}`}>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Mode d'affichage
                  </label>
                  <Select value={viewMode} onValueChange={(value: "page" | "continu") => setViewMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="page">Page par page</SelectItem>
                      <SelectItem value="continu">Lecture continue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Taille du texte
                  </label>
                  <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">Petit</SelectItem>
                      <SelectItem value="16">Normal</SelectItem>
                      <SelectItem value="18">Grand</SelectItem>
                      <SelectItem value="20">Très grand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Langue audio
                  </label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="français">🇫🇷 Français</SelectItem>
                      <SelectItem value="bambara">🇲🇱 Bambara</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} shadow-lg`}>
              <CardContent className="p-6">
                {viewMode === "page" ? (
                  // Mode page par page
                  <div className="space-y-6">
                    {/* Image de la page */}
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={currentPageData?.image || defaultImages[conte.categorie] || araigneeElephantImg}
                        alt={`Page ${currentPage + 1} - ${conte.titre}`}
                        className="w-full h-64 object-cover"
                      />
                    </div>

                    {/* Texte de la page */}
                    <div 
                      className={`leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: textHighlight || currentPageData?.contenu 
                        }} 
                      />
                    </div>

                    {/* Navigation pages */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        className={`${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-orange-200 hover:bg-orange-50'}`}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Précédent
                      </Button>

                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {currentPage + 1} / {pages.length}
                      </span>

                      <Button
                        variant="outline"
                        onClick={handleNextPage}
                        disabled={currentPage === pages.length - 1}
                        className={`${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-orange-200 hover:bg-orange-50'}`}
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Mode lecture continue
                  <div className="space-y-8">
                    {pages.map((page, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-amber-600' : 'bg-orange-500'} text-white flex items-center justify-center text-sm font-bold`}>
                            {index + 1}
                          </div>
                          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            Page {index + 1}
                          </h3>
                        </div>
                        
                        <img
                          src={page.image || defaultImages[conte.categorie] || araigneeElephantImg}
                          alt={`Page ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        
                        <p 
                          className={`leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          {page.contenu}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Lecteur audio */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} shadow-lg`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Headphones className={`h-5 w-5 ${isDarkMode ? 'text-amber-400' : 'text-orange-500'}`} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Lecteur Audio
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Sélecteur de langue */}
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="français">🇫🇷 Français</SelectItem>
                      <SelectItem value="bambara">🇲🇱 Bambara</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Contrôles de lecture */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={togglePlayPause}
                      className={`${isDarkMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-full w-12 h-12`}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Barre de progression audio */}
                  <div className="space-y-2">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      onValueChange={(value) => handleSeek(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Contrôles volume et vitesse */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Volume
                      </label>
                      <div className="flex items-center gap-2">
                        {volume[0] === 0 ? (
                          <VolumeX className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Volume2 className="h-4 w-4 text-gray-400" />
                        )}
                        <Slider
                          value={volume}
                          max={1}
                          step={0.1}
                          onValueChange={handleVolumeChange}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Vitesse
                      </label>
                      <Select value={playbackSpeed.toString()} onValueChange={(value) => handleSpeedChange(parseFloat(value))}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5x</SelectItem>
                          <SelectItem value="0.75">0.75x</SelectItem>
                          <SelectItem value="1">1x</SelectItem>
                          <SelectItem value="1.25">1.25x</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Morale du conte */}
            {currentPage === pages.length - 1 && (
              <Card className={`${isDarkMode ? 'bg-gradient-to-br from-amber-900 to-orange-900 border-amber-700' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'} shadow-lg`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className={`h-5 w-5 ${isDarkMode ? 'text-amber-400' : 'text-orange-500'}`} />
                    <h3 className={`font-semibold ${isDarkMode ? 'text-amber-200' : 'text-orange-800'}`}>
                      Morale du conte
                    </h3>
                  </div>
                  <p className={`${isDarkMode ? 'text-amber-100' : 'text-orange-700'} leading-relaxed`}>
                    {sampleConteContent.morale}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Actions rapides */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-orange-100'} shadow-lg`}>
              <CardContent className="p-6">
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setCurrentPage(0)}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Recommencer
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => toast.success('Lien copié dans le presse-papier')}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>

                  {subscribed && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => toast.success('Téléchargement démarré')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConteReading;