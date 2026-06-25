export type InterviewTrack = 'frontend' | 'backend' | 'fullstack';
export type InterviewLevel = 'junior' | 'pleno' | 'senior';

export interface TheoryQuestion {
  id: string;
  track: InterviewTrack[];
  level: InterviewLevel[];
  prompt: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticalChallenge {
  id: string;
  track: InterviewTrack[];
  level: InterviewLevel[];
  title: string;
  prompt: string;
  starterCode: string;
  solutionContains: string[];
  hint: string;
  idealApproach: string;
}

export interface BehavioralQuestion {
  id: string;
  level: InterviewLevel[];
  question: string;
  whatTheyWantToHear: string;
  structureTip: string;
}

export interface InterviewResult {
  trackLabel: string;
  levelLabel: string;
  theoryScore: number;
  theoryTotal: number;
  theoryCorrect: number;
  practicalScore: number;
  practicalAttempted: number;
  practicalPassed: number;
  behavioralAnswered: number;
  behavioralTotal: number;
  overallScore: number;
  completedAt: string;
}
