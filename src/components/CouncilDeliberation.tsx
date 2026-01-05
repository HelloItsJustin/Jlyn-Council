import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, Eye, Loader, Shield } from 'lucide-react';
import { DemoScenario } from '../utils/types';
import { useCouncilSimulation } from '../hooks/useCouncilSimulation';
import EncryptionVisualizer from './EncryptionVisualizer';

interface CouncilDeliberationProps {
  scenario: DemoScenario;
  onComplete: () => void;
}

export default function CouncilDeliberation({ scenario, onComplete }: CouncilDeliberationProps) {
  const { animationState, isComplete, startDeliberation } = useCouncilSimulation(scenario);

  useEffect(() => {
    startDeliberation();
  }, [startDeliberation]);

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(), 1000);
    }
  }, [isComplete, onComplete]);

  const getStageLabel = () => {
    switch (animationState.stage) {
      case 'encrypting':
        return 'Encrypting Query';
      case 'routing':
        return 'Smart Routing';
      case 'responding':
        return 'Council Responding';
      case 'peer-review':
        return 'Peer Review';
      case 'synthesis':
        return 'Synthesizing Answer';
      case 'complete':
        return 'Complete';
      default:
        return 'Initializing';
    }
  };

  const councilMembers = [
    { name: 'Analyst', role: 'Technical Expert', icon: Brain, color: 'cyan' },
    { name: 'Critic', role: 'Quality Reviewer', icon: Eye, color: 'purple' },
    { name: 'Synthesizer', role: 'Integration Specialist', icon: Shield, color: 'pink' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">{getStageLabel()}</h2>
          <p className="text-slate-300">Processing: {scenario.plaintext_query}</p>
        </motion.div>

        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-8 min-h-[200px]">
          <EncryptionVisualizer
            text={scenario.plaintext_query}
            isEncrypting={animationState.stage === 'encrypting'}
          />

          {animationState.stage === 'encrypting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="font-mono text-lg mb-4 break-all text-cyan-400">
                {scenario.encrypted_query}
              </div>
              <p className="text-sm text-slate-400">Applying Jlyn* star-pattern cipher...</p>
            </motion.div>
          )}

          {animationState.stage === 'routing' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <Loader className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-spin" />
              <p className="text-lg">Analyzing query and assigning specialized models...</p>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {(animationState.stage === 'responding' || animationState.stage === 'peer-review' || animationState.stage === 'synthesis' || animationState.stage === 'complete') && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {councilMembers.map((member, index) => {
                const response = scenario.council_responses[index];
                const isActive = animationState.currentModel === member.name;
                const isResponded = scenario.council_responses.findIndex(r => r.model === member.name) <= scenario.council_responses.findIndex(r => r.model === animationState.currentModel || '');
                const Icon = member.icon;

                const getBorderClass = () => {
                  if (!isActive) return 'border-white/10';
                  switch (member.color) {
                    case 'cyan': return 'border-cyan-500 shadow-lg shadow-cyan-500/50';
                    case 'purple': return 'border-purple-500 shadow-lg shadow-purple-500/50';
                    case 'pink': return 'border-pink-500 shadow-lg shadow-pink-500/50';
                    default: return 'border-white/10';
                  }
                };

                const getBgClass = () => {
                  switch (member.color) {
                    case 'cyan': return 'bg-cyan-500/20';
                    case 'purple': return 'bg-purple-500/20';
                    case 'pink': return 'bg-pink-500/20';
                    default: return 'bg-white/20';
                  }
                };

                const getIconClass = () => {
                  switch (member.color) {
                    case 'cyan': return 'text-cyan-400';
                    case 'purple': return 'text-purple-400';
                    case 'pink': return 'text-pink-400';
                    default: return 'text-white';
                  }
                };

                const getGradientClass = () => {
                  switch (member.color) {
                    case 'cyan': return 'bg-gradient-to-r from-cyan-500 to-cyan-400';
                    case 'purple': return 'bg-gradient-to-r from-purple-500 to-purple-400';
                    case 'pink': return 'bg-gradient-to-r from-pink-500 to-pink-400';
                    default: return 'bg-gradient-to-r from-white to-white';
                  }
                };

                return (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all ${getBorderClass()}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl ${getBgClass()}`}>
                        <Icon className={`w-6 h-6 ${getIconClass()}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-sm text-slate-400">{member.role}</p>
                      </div>
                    </div>

                    {isResponded && (
                      <>
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-400">Response</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-green-400">
                                {response.confidence}%
                              </span>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-cyan-400 overflow-hidden">
                            {response.encrypted_response.substring(0, 60)}...
                          </div>
                        </div>

                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${response.confidence}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`h-full ${getGradientClass()} rounded-full`}
                          />
                        </div>
                      </>
                    )}

                    {!isResponded && (
                      <div className="text-center py-8">
                        <Loader className="w-8 h-8 mx-auto text-slate-400 animate-spin" />
                        <p className="text-sm text-slate-400 mt-2">Waiting...</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-semibold mb-4">Consensus Meter</h3>
          <div className="relative">
            <div className="w-full bg-white/10 rounded-full h-8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${animationState.consensusLevel}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 flex items-center justify-end pr-3"
              >
                <span className="text-sm font-bold text-white drop-shadow-lg">
                  {Math.round(animationState.consensusLevel)}%
                </span>
              </motion.div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-slate-400">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </motion.div>

        {animationState.stage === 'peer-review' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
          >
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Anonymous Peer Review</h3>
            <div className="space-y-3">
              {scenario.peer_reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.3 }}
                  className="bg-black/30 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <span className="text-sm text-slate-400">{review.reviewer} → {review.reviewed}</span>
                    <div className="font-mono text-xs text-purple-400 mt-1">
                      {review.encrypted_vote.substring(0, 40)}...
                    </div>
                  </div>
                  <div className="text-lg font-bold text-purple-400">{review.score}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {animationState.stage === 'synthesis' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-semibold mb-4">Chairman Synthesis</h3>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-cyan-400">
              {scenario.encrypted_synthesis}
            </div>
            <div className="flex justify-center mt-4">
              <Loader className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
