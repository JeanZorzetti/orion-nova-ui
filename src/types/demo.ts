// Types for Interactive Demo components

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  highlight: string;
  screenshot: string;
  hotspots: Hotspot[];
  duration: number; // milliseconds
}

export interface Hotspot {
  id: string;
  x: number; // % position (0-100)
  y: number; // % position (0-100)
  label: string;
  icon?: string;
  pulseColor: string;
}

export interface DemoConfig {
  steps: DemoStep[];
  autoPlay: boolean;
  loop: boolean;
  accentColor: string;
  onComplete?: () => void;
  onSkip?: () => void;
  onStepChange?: (stepIndex: number) => void;
}

export type DemoState = 'idle' | 'playing' | 'paused' | 'completed';

export interface DemoControls {
  state: DemoState;
  currentStep: number;
  play: () => void;
  pause: () => void;
  restart: () => void;
  skip: () => void;
  goToStep: (index: number) => void;
}
