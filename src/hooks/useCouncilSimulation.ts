import { useState, useCallback } from 'react';
import { DemoScenario, AnimationState } from '../utils/types';

export function useCouncilSimulation(scenario: DemoScenario | null) {
  const [animationState, setAnimationState] = useState<AnimationState>({
    stage: 'idle',
    progress: 0,
    consensusLevel: 0,
  });

  const [isComplete, setIsComplete] = useState(false);

  const startDeliberation = useCallback(async () => {
    if (!scenario) return;

    setIsComplete(false);
    setAnimationState({ stage: 'encrypting', progress: 0, consensusLevel: 0 });

    await new Promise(resolve => setTimeout(resolve, 500));
    setAnimationState({ stage: 'routing', progress: 100, consensusLevel: 0 });

    await new Promise(resolve => setTimeout(resolve, 500));
    setAnimationState({ stage: 'responding', progress: 0, consensusLevel: 0, currentModel: scenario.council_responses[0].model });

    for (let i = 0; i < scenario.council_responses.length; i++) {
      const response = scenario.council_responses[i];
      setAnimationState({
        stage: 'responding',
        progress: ((i + 1) / scenario.council_responses.length) * 100,
        consensusLevel: Math.min(scenario.consensus_level, ((i + 1) / scenario.council_responses.length) * scenario.consensus_level),
        currentModel: response.model,
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    if (scenario.consensus_level < 90) {
      setAnimationState({ stage: 'peer-review', progress: 0, consensusLevel: scenario.consensus_level });
      for (let i = 0; i < scenario.peer_reviews.length; i++) {
        setAnimationState({
          stage: 'peer-review',
          progress: ((i + 1) / scenario.peer_reviews.length) * 100,
          consensusLevel: scenario.consensus_level + (i * 5),
        });
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    setAnimationState({ stage: 'synthesis', progress: 0, consensusLevel: scenario.consensus_level });
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnimationState({ stage: 'synthesis', progress: 100, consensusLevel: scenario.consensus_level });

    await new Promise(resolve => setTimeout(resolve, 500));
    setAnimationState({ stage: 'complete', progress: 100, consensusLevel: scenario.consensus_level });
    setIsComplete(true);
  }, [scenario]);

  return {
    animationState,
    isComplete,
    startDeliberation,
  };
}
