export interface ScriptRequest {
  topic: string;
  tone: string;
  targetAudience: string;
}

export interface ScriptItem extends ScriptRequest {
  id: string;
  content: string;
  status: GenerationStatus;
  error?: string;
  wordCount?: number;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  QUEUED = 'QUEUED',
  LOADING = 'LOADING',
  STREAMING = 'STREAMING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface ScriptState {
  items: ScriptItem[];
  selectedId: string | null;
}

export const TONE_OPTIONS = [
  "Inspirador e Motivacional",
  "Técnico e Educativo",
  "Descontraído e Humorístico",
  "Sério e Jornalístico",
  "Narrativo e Storytelling",
  "Polêmico e Opiniativo"
];