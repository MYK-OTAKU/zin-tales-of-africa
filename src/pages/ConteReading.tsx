import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
  Clock
} from "lucide-react";
import { useContes, type Conte, type ContePage } from "@/hooks/useContes";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import des images par défaut
import araigneeElephantImg from "@/assets/conte-araignee-elephant.jpg";

const ConteReading = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribed } = useSubscription();
  const { 
    fetchContePages, 
    fetchUserProgress, 
    updateUserProgress, 
    toggleFavorite, 
    canAccessConte, 
    getAccessMessage,
    generateImage 
  } = useContes();

  const [conte, setConte] = useState<Conte | null>(null);
  const [pages, setPages] = useState<ContePage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<"page" | "continu">("page");
  const [selectedLanguage, setSelectedLanguage] = useState("français");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.8]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatingImage, setGeneratingImage] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Charger le conte et ses pages
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

        // Charger les pages
        const pagesData = await fetchContePages(id);
        setPages(pagesData);

        // Charger le progrès utilisateur
        if (user) {
          const progress = await fetchUserProgress(id);
          if (progress) {
            setCurrentPage(Math.max(0, progress.derniere_page - 1));
            setIsFavorite(progress.favori);
          }
        }

      } catch (error) {
        console.error('Erreur lors du chargement du conte:', error);
        toast.error('Erreur lors du chargement du conte');
        navigate('/contes');
      } finally {
        setLoading(false);
      }
    };

    loadConte();
  }, [id, user, navigate]);

  // Configuration audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, playbackSpeed]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const nextPage = async () => {
    if (!pages.length) return;
    
    const newPageIndex = Math.min(currentPage + 1, pages.length - 1);
    setCurrentPage(newPageIndex);
    
    if (user && conte) {
      const isLastPage = newPageIndex === pages.length - 1;
      await updateUserProgress(conte.id, newPageIndex + 1, isLastPage);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!conte || !user) return;
    
    const newStatus = await toggleFavorite(conte.id);
    setIsFavorite(newStatus);
  };

  const handleGenerateImage = async () => {
    if (!pages[currentPage] || !user) return;
    
    setGeneratingImage(true);
    try {
      const prompt = `Illustration for this story: ${pages[currentPage].contenu}`;
      const imageUrl = await generateImage(prompt, `Malian traditional tale: ${conte?.titre}`);
      
      if (imageUrl) {
        toast.success('Image générée avec succès !');
        // Ici on pourrait sauvegarder l'URL de l'image dans la base de données
      }
    } finally {
      setGeneratingImage(false);
    }
  };

  const currentPageData = pages[currentPage];
  const currentAudioUrl = selectedLanguage === "français" 
    ? currentPageData?.audio_fr_url 
    : currentPageData?.audio_bambara_url;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-earth flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Chargement du conte...</p>
        </div>
      </div>
    );
  }

  if (!conte || !pages.length) {
    return (
      <div className="min-h-screen bg-gradient-earth flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Conte non trouvé</p>
          <Button asChild>
            <Link to="/contes">Retour aux contes</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header avec navigation */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/contes">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <Badge className="bg-accent text-accent-foreground">
                {conte.categorie}
              </Badge>
              {conte.is_premium && (
                <Badge variant="secondary">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Favoris */}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavoriteToggle}
                  className={isFavorite ? "text-red-500" : ""}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              )}

              {/* Sélecteur de langue */}
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conte.langues.map((langue) => (
                      <SelectItem key={langue} value={langue}>
                        {langue.charAt(0).toUpperCase() + langue.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mode d'affichage */}
              <div className="flex rounded-lg bg-muted p-1">
                <Button
                  variant={viewMode === "page" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("page")}
                  className="h-8"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Pages
                </Button>
                <Button
                  variant={viewMode === "continu" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("continu")}
                  className="h-8"
                >
                  <Scroll className="w-4 h-4 mr-1" />
                  Continu
                </Button>
              </div>

              {/* Génération d'image IA */}
              {user && subscribed && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateImage}
                  disabled={generatingImage}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generatingImage ? 'Génération...' : 'Générer Image IA'}
                </Button>
              )}

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-8">
        {/* Titre du conte */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {conte.titre}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {conte.description}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {conte.duree_minutes} min
            </Badge>
            <Badge variant="outline">
              Page {currentPage + 1} / {pages.length}
            </Badge>
          </div>
        </div>

        {/* Lecteur audio intégré */}
        <Card className="mb-8 bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => skipTime(-10)}
                >
                  <SkipBack className="w-4 h-4" />
                  10s
                </Button>
                
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={togglePlayPause}
                  className="w-12 h-12"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => skipTime(10)}
                >
                  10s
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Contrôle du volume */}
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={1}
                    step={0.1}
                    className="w-20"
                  />
                </div>

                {/* Vitesse de lecture */}
                <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="1.25">1.25x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Barre de progression audio */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-sm opacity-80">
                <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}</span>
                <span>{Math.floor((duration || 0) / 60)}:{((duration || 0) % 60).toFixed(0).padStart(2, '0')}</span>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={currentAudioUrl || `https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav`}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onError={() => {
                console.log('Audio en cours de chargement...');
                setDuration(60); // Durée par défaut pour la simulation
              }}
            />
          </CardContent>
        </Card>

        {/* Contenu du conte */}
        {viewMode === "page" ? (
          <div className="space-y-8">
            {/* Affichage page par page */}
            <Card className="overflow-hidden">
              <div className="aspect-[3/2] relative">
                <img 
                  src={currentPageData?.image_url || araigneeElephantImg} 
                  alt={`Page ${currentPage + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentPage + 1} / {pages.length}
                </div>
                {!subscribed && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      Aperçu gratuit
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-foreground">
                  {currentPageData?.contenu}
                </p>
              </CardContent>
            </Card>

            {/* Navigation entre pages */}
            <div className="flex justify-between items-center">
              <Button 
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Page précédente
              </Button>

              <div className="flex gap-2">
                {pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentPage 
                        ? 'bg-primary' 
                        : 'bg-muted hover:bg-muted-foreground/20'
                    }`}
                  />
                ))}
              </div>

              <Button 
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === pages.length - 1}
              >
                Page suivante
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Affichage continu */}
            {pages.map((page, index) => (
              <Card key={page.id} className="overflow-hidden">
                <div className="aspect-[3/2] relative">
                  <img 
                    src={page.image_url || araigneeElephantImg} 
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <p className="text-lg leading-relaxed text-foreground">
                    {page.contenu}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Morale du conte */}
        {conte.morale && (
          <Card className="mt-12 bg-accent text-accent-foreground">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Morale de l'histoire</h3>
              <p className="text-lg italic">
                {conte.morale}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Suggestion d'upgrade pour les utilisateurs non premium */}
        {!subscribed && (
          <Card className="mt-8 bg-gradient-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <Crown className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Débloquez plus de contes !</h3>
              <p className="text-lg mb-6">
                Accédez à tous nos contes premium, fonctionnalités IA et contenu exclusif.
              </p>
              <Button asChild variant="secondary">
                <Link to="/premium">
                  Découvrir Premium
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConteReading;