import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  Languages
} from "lucide-react";

// Import des images des contes
import araigneeElephantImg from "@/assets/conte-araignee-elephant.jpg";

// Données complètes du conte avec pages
const conteComplet = {
  id: 1,
  titre: "L'Araignée et l'Éléphant",
  description: "Une histoire sur la ruse et l'intelligence face à la force brute.",
  categorie: "Sagesse",
  duree: "8 min",
  isPremium: false,
  langues: ["français", "bambara"],
  pages: [
    {
      id: 1,
      contenu: "Il était une fois, dans un village du Mali, une petite araignée très rusée nommée Kwaku. Malgré sa petite taille, elle était connue pour sa grande intelligence et sa capacité à résoudre les problèmes les plus difficiles.",
      imageUrl: araigneeElephantImg,
      audioFr: "/audio/page1-fr.mp3",
      audioBambara: "/audio/page1-bambara.mp3"
    },
    {
      id: 2,
      contenu: "Un jour, un énorme éléphant arriva dans le village. Il était si grand et si fort qu'il pensait pouvoir tout écraser sur son passage. 'Je suis le plus puissant!' rugissait-il, faisant trembler les cases du village.",
      imageUrl: araigneeElephantImg,
      audioFr: "/audio/page2-fr.mp3",
      audioBambara: "/audio/page2-bambara.mp3"
    },
    {
      id: 3,
      contenu: "L'éléphant décida de défier tous les animaux du village. 'Qui ose se mesurer à moi?' demanda-t-il d'une voix tonnante. Tous les animaux tremblaient de peur, sauf la petite araignée Kwaku.",
      imageUrl: araigneeElephantImg,
      audioFr: "/audio/page3-fr.mp3",
      audioBambara: "/audio/page3-bambara.mp3"
    },
    {
      id: 4,
      contenu: "'Moi, je relève ton défi,' dit courageusement Kwaku. L'éléphant éclata de rire. 'Toi? Une si petite créature? Tu ne fais même pas la taille de mon orteil!' Mais Kwaku sourit mystérieusement.",
      imageUrl: araigneeElephantImg,
      audioFr: "/audio/page4-fr.mp3",
      audioBambara: "/audio/page4-bambara.mp3"
    },
    {
      id: 5,
      contenu: "Kwaku proposa un défi intelligent : 'Celui qui réussira à faire tomber le plus gros baobab de la forêt sera déclaré vainqueur.' L'éléphant accepta, confiant en sa force brute.",
      imageUrl: araigneeElephantImg,
      audioFr: "/audio/page5-fr.mp3",
      audioBambara: "/audio/page5-bambara.mp3"
    },
    {
      id: 6,
      contenu: "Pendant que l'éléphant chargeait le baobab de toutes ses forces, Kwaku tissa silencieusement sa toile autour des racines de l'arbre, créant un réseau complexe et fragile.",
      imageUrl: araigneeElephantImg,
      audioFr: "/audio/page6-fr.mp3",
      audioBambara: "/audio/page6-bambara.mp3"
    },
    {
      id: 7,
      contenu: "Au moment crucial, quand l'éléphant donna son coup le plus puissant, Kwaku tira sur un fil stratégique de sa toile. Le baobab, déstabilisé par la toile, s'effondra dans un grand fracas!",
      imageUrl: araigneeElephantImg,
      audioFr: "/audio/page7-fr.mp3",
      audioBambara: "/audio/page7-bambara.mp3"
    },
    {
      id: 8,
      contenu: "L'éléphant était stupéfait. Kwaku expliqua : 'La vraie force ne vient pas des muscles, mais de l'intelligence et de la stratégie. La ruse peut vaincre la force brute.' Depuis ce jour, l'éléphant respecta la petite araignée.",
      imageUrl: araigneeElephantImg,
      audioFr: "/audio/page8-fr.mp3",
      audioBambara: "/audio/page8-bambara.mp3"
    }
  ],
  morale: "L'intelligence et la ruse peuvent triompher de la force brute. Il ne faut jamais sous-estimer quelqu'un à cause de sa taille ou de son apparence."
};

const ConteReading = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<"page" | "continu">("page");
  const [selectedLanguage, setSelectedLanguage] = useState("français");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.8]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulation du chargement audio
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

  const nextPage = () => {
    if (currentPage < conteComplet.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentPageData = conteComplet.pages[currentPage];
  const currentAudioUrl = selectedLanguage === "français" 
    ? currentPageData?.audioFr 
    : currentPageData?.audioBambara;

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
                {conteComplet.categorie}
              </Badge>
              {conteComplet.isPremium && (
                <Badge variant="secondary">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sélecteur de langue */}
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="français">Français</SelectItem>
                    <SelectItem value="bambara">Bambara</SelectItem>
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
            {conteComplet.titre}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {conteComplet.description}
          </p>
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
              src={currentAudioUrl}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
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
                  src={currentPageData.imageUrl} 
                  alt={`Page ${currentPage + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentPage + 1} / {conteComplet.pages.length}
                </div>
              </div>
              
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-foreground">
                  {currentPageData.contenu}
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
                {conteComplet.pages.map((_, index) => (
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
                disabled={currentPage === conteComplet.pages.length - 1}
              >
                Page suivante
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Affichage continu */}
            {conteComplet.pages.map((page, index) => (
              <Card key={page.id} className="overflow-hidden">
                <div className="aspect-[3/2] relative">
                  <img 
                    src={page.imageUrl} 
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
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
        <Card className="mt-12 bg-accent text-accent-foreground">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Morale de l'histoire</h3>
            <p className="text-lg italic">
              {conteComplet.morale}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConteReading;