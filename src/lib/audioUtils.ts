// Utilitaires pour la gestion audio dans Zirin

export const PLACEHOLDER_AUDIO_URLs = {
  // URLs de test audio publiques pour les démonstrations
  français: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  bambara: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav'
};

// Génère une URL audio placeholder basée sur le conte et la langue
export const getPlaceholderAudioUrl = (conteId: string, language: 'français' | 'bambara'): string => {
  // Pour la démo, nous retournons des URLs de test
  // En production, ces URLs pointent vers de vrais fichiers audio
  const baseUrl = '/audio';
  return `${baseUrl}/placeholder-${language === 'français' ? 'fr' : 'bambara'}.mp3`;
};

// Génère des données audio dynamiques pour les contes
export const generateConteAudioData = (conte: any) => {
  return {
    français: {
      url: getPlaceholderAudioUrl(conte.id, 'français'),
      duration: conte.duree_minutes * 60, // Convertir en secondes
      narrator: 'Narrateur français'
    },
    bambara: {
      url: getPlaceholderAudioUrl(conte.id, 'bambara'),
      duration: (conte.duree_minutes * 60) + 30, // Légèrement plus long en bambara
      narrator: 'Narrateur bambara'
    }
  };
};

// Utilitaires pour le lecteur audio
export class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private onTimeUpdate?: (currentTime: number) => void;
  private onDurationChange?: (duration: number) => void;
  private onEnded?: () => void;

  constructor() {
    this.audio = new Audio();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('timeupdate', () => {
      this.onTimeUpdate?.(this.audio!.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.onDurationChange?.(this.audio!.duration);
    });

    this.audio.addEventListener('ended', () => {
      this.onEnded?.();
    });
  }

  setCallbacks(callbacks: {
    onTimeUpdate?: (currentTime: number) => void;
    onDurationChange?: (duration: number) => void;
    onEnded?: () => void;
  }) {
    this.onTimeUpdate = callbacks.onTimeUpdate;
    this.onDurationChange = callbacks.onDurationChange;
    this.onEnded = callbacks.onEnded;
  }

  async loadAudio(url: string) {
    if (!this.audio) return;
    
    try {
      this.audio.src = url;
      await this.audio.load();
    } catch (error) {
      console.warn('Erreur de chargement audio, utilisation du placeholder:', error);
      // Utiliser un silence de 3 secondes comme fallback
      this.audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAIAC...';
    }
  }

  play() {
    if (!this.audio) return;
    this.audio.play().catch(e => console.warn('Erreur lecture audio:', e));
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
  }

  setCurrentTime(time: number) {
    if (!this.audio) return;
    this.audio.currentTime = time;
  }

  setVolume(volume: number) {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  setPlaybackRate(rate: number) {
    if (!this.audio) return;
    this.audio.playbackRate = rate;
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  isPaused(): boolean {
    return this.audio?.paused ?? true;
  }

  destroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
  }
}

// Hook pour la synchronisation texte-audio (karaoké)
export const useAudioTextSync = (text: string, audioDuration: number) => {
  const words = text.split(' ');
  const wordDuration = audioDuration / words.length;

  const getCurrentWord = (currentTime: number): number => {
    return Math.floor(currentTime / wordDuration);
  };

  const getHighlightedText = (currentTime: number): string => {
    const currentWordIndex = getCurrentWord(currentTime);
    return words.map((word, index) => {
      if (index === currentWordIndex) {
        return `<mark class="bg-amber-200 text-amber-900 px-1 rounded">${word}</mark>`;
      }
      return word;
    }).join(' ');
  };

  return { getCurrentWord, getHighlightedText };
};