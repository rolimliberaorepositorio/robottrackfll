export type TabType = 'treinos' | 'ao-vivo' | 'diagnostico' | 'estrategia';

export type FailureType = 'lego_technic' | 'human_operator';

export interface Mission {
  id: string;
  number: string;
  name: string;
  description: string;
  points: number;
  completed: boolean;
  runIndex: number; // 1 to 4
  attachmentName: string;
}

export interface FailureIncident {
  id: string;
  type: FailureType;
  categoryName: string;
  confidence: string;
  mission: string;
  pointsLost: number;
  timestamp: string;
  diagnosis: string;
  recommendation: string;
}

export interface Keyframe {
  timestamp: string;
  title: string;
  status: string;
  isAlert?: boolean;
  statusColor?: string;
  imageUrl: string;
  detail?: string;
}

export interface RoundTelemetry {
  id: number;
  score: number;
  maxScore: number;
  durationSeconds: number; // e.g. 144s for 02:24
  consistencyScore: number; // 88%
  proximityScore: number; // 93%
  timeScore: number; // 96%
  runs: {
    runNumber: number;
    name: string;
    score: number;
    completionPercent: number;
    attachment: string;
    status: 'completed' | 'in_progress' | 'pending';
  }[];
  date: string;
  statusText: string;
  statusBadge?: string;
  notes: string;
  failures: FailureIncident[];
  keyframes: Keyframe[];
}

export interface StrategyItem {
  id: string;
  title: string;
  currentRun: string;
  suggestedRun: string;
  attachmentName: string;
  estimatedTimeGain: string;
  estimatedPointGain: string;
  category: 'attachment_switch' | 'mechanical_reinforcement' | 'human_procedure';
  description: string;
  applied: boolean;
}
