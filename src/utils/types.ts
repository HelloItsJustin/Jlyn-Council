export interface CouncilResponse {
  model: string;
  role: string;
  encrypted_response: string;
  plaintext_response: string;
  confidence: number;
  timestamp: number;
}

export interface PeerReview {
  reviewer: string;
  reviewed: string;
  encrypted_vote: string;
  score: number;
  timestamp: number;
}

export interface DemoScenario {
  query_id: string;
  plaintext_query: string;
  encrypted_query: string;
  jlyn_key: string;
  council_responses: CouncilResponse[];
  peer_reviews: PeerReview[];
  encrypted_synthesis: string;
  plaintext_synthesis: string;
  consensus_level: number;
  total_time_seconds: number;
}

export type DeliberationStage =
  | 'idle'
  | 'encrypting'
  | 'routing'
  | 'responding'
  | 'peer-review'
  | 'synthesis'
  | 'complete';

export interface AnimationState {
  stage: DeliberationStage;
  progress: number;
  currentModel?: string;
  consensusLevel: number;
}

export interface ReplayState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentStage: number;
}
