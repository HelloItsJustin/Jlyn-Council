import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, Lock, Unlock } from 'lucide-react';
import { DemoScenario } from '../utils/types';
import { useReplayControls } from '../hooks/useReplayControls';

interface ReplayModeProps {
  scenario: DemoScenario;
  onClose: () => void;
}

export default function ReplayMode({ scenario, onClose }: ReplayModeProps) {
  const {
    replayState,
    play,
    pause,
    seekTo,
    goToStage,
    decryptResponse,
    isResponseDecrypted,
  } = useReplayControls(scenario);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        replayState.isPlaying ? pause() : play();
      } else if (e.key === 'r' || e.key === 'R') {
        seekTo(0);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [replayState.isPlaying, pause, play, seekTo, onClose]);

  const stages = [
    { label: 'Encryption', time: 0 },
    { label: 'Routing', time: 0.5 },
    { label: 'Responses', time: 2 },
    { label: 'Synthesis', time: 8 },
  ];

  const handleDecrypt = (index: number) => {
    decryptResponse(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="min-h-screen py-8 px-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl shadow-2xl max-w-6xl w-full border border-white/20"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Deliberation Replay</h2>
              <p className="text-slate-300 text-sm">{scenario.plaintext_query}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-white/5 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => (replayState.isPlaying ? pause() : play())}
                  className="p-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
                >
                  {replayState.isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>

                <div className="flex-1 mx-6">
                  <input
                    type="range"
                    min={0}
                    max={replayState.duration}
                    step={0.1}
                    value={replayState.currentTime}
                    onChange={(e) => seekTo(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    {stages.map((stage, index) => (
                      <button
                        key={index}
                        onClick={() => goToStage(index)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                          replayState.currentStage === index
                            ? 'bg-cyan-500 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {stage.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-slate-300">
                  {replayState.currentTime.toFixed(1)}s / {replayState.duration}s
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Original Query</h3>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-slate-300 mb-3">{scenario.plaintext_query}</div>
                  <div className="font-mono text-xs text-cyan-400 break-all">
                    Encrypted: {scenario.encrypted_query}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Key: {scenario.jlyn_key}</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Council Responses</h3>
                <div className="space-y-4">
                  {scenario.council_responses.map((response, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-white">{response.model}</h4>
                          <p className="text-sm text-slate-400">{response.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-400">
                            {response.confidence}%
                          </span>
                          <button
                            onClick={() => handleDecrypt(index)}
                            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
                          >
                            {isResponseDecrypted(index) ? (
                              <Unlock className="w-4 h-4 text-purple-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-purple-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {isResponseDecrypted(index) ? (
                        <div className="text-slate-300 text-sm leading-relaxed">
                          {response.plaintext_response}
                        </div>
                      ) : (
                        <div className="font-mono text-xs text-cyan-400 break-all opacity-50">
                          {response.encrypted_response}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {scenario.peer_reviews.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Peer Reviews</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {scenario.peer_reviews.map((review, index) => (
                      <div key={index} className="bg-black/30 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">
                            {review.reviewer} → {review.reviewed}
                          </span>
                          <span className="text-lg font-bold text-purple-400">{review.score}</span>
                        </div>
                        <div className="font-mono text-xs text-purple-400/50 break-all">
                          {review.encrypted_vote}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Final Synthesis</h3>
                <div className="bg-black/30 rounded-lg p-4 mb-4">
                  <div className="text-slate-300 leading-relaxed">
                    {scenario.plaintext_synthesis}
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex-1 bg-white/5 rounded-lg p-3">
                    <span className="text-slate-400">Consensus</span>
                    <div className="text-xl font-bold text-green-400">{scenario.consensus_level}%</div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg p-3">
                    <span className="text-slate-400">Total Time</span>
                    <div className="text-xl font-bold text-cyan-400">{scenario.total_time_seconds}s</div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg p-3">
                    <span className="text-slate-400">Models</span>
                    <div className="text-xl font-bold text-purple-400">{scenario.council_responses.length}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-400">
              <p>Keyboard shortcuts: Space (play/pause) • R (restart) • Esc (close)</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
