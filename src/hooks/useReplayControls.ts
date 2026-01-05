import { useState, useEffect } from 'react';
import { ReplayState, DemoScenario } from '../utils/types';

export function useReplayControls(scenario: DemoScenario | null) {
  const [replayState, setReplayState] = useState<ReplayState>({
    isPlaying: false,
    currentTime: 0,
    duration: scenario?.total_time_seconds || 15,
    currentStage: 0,
  });

  const [decryptedResponses, setDecryptedResponses] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (scenario) {
      setReplayState(prev => ({
        ...prev,
        duration: scenario.total_time_seconds,
        currentTime: 0,
        currentStage: 0,
      }));
      setDecryptedResponses(new Set());
    }
  }, [scenario]);

  const play = () => {
    setReplayState(prev => ({ ...prev, isPlaying: true }));
  };

  const pause = () => {
    setReplayState(prev => ({ ...prev, isPlaying: false }));
  };

  const seekTo = (time: number) => {
    const stage = Math.floor((time / replayState.duration) * 4);
    setReplayState(prev => ({ ...prev, currentTime: time, currentStage: stage }));
  };

  const goToStage = (stage: number) => {
    const time = (stage / 4) * replayState.duration;
    setReplayState(prev => ({ ...prev, currentStage: stage, currentTime: time, isPlaying: false }));
  };

  const decryptResponse = (index: number) => {
    setDecryptedResponses(prev => new Set([...prev, index]));
  };

  const isResponseDecrypted = (index: number) => {
    return decryptedResponses.has(index);
  };

  useEffect(() => {
    if (!replayState.isPlaying) return;

    const interval = setInterval(() => {
      setReplayState(prev => {
        if (prev.currentTime >= prev.duration) {
          return { ...prev, isPlaying: false };
        }
        const newTime = prev.currentTime + 0.1;
        const newStage = Math.floor((newTime / prev.duration) * 4);
        return { ...prev, currentTime: newTime, currentStage: newStage };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [replayState.isPlaying]);

  return {
    replayState,
    play,
    pause,
    seekTo,
    goToStage,
    decryptResponse,
    isResponseDecrypted,
  };
}
