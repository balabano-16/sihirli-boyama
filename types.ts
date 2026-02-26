
export interface GeneratedImage {
  id: string;
  base64: string;
  prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING', // Generating prompts
  GENERATING = 'GENERATING', // Generating images
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export type Language = 'en' | 'es' | 'tr';

export type ArtStyle = 'cartoon' | 'realistic' | 'mandala' | 'pixel' | 'chibi' | 'anime';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
