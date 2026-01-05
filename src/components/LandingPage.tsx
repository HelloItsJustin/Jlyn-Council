import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Users } from 'lucide-react';
import { demoScenarios } from '../utils/demoScenarios';
import { DemoScenario } from '../utils/types';

interface LandingPageProps {
  onStartCouncil: (scenario: DemoScenario) => void;
}

export default function LandingPage({ onStartCouncil }: LandingPageProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(demoScenarios[0].query_id);
  const [customQuery, setCustomQuery] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handleStart = () => {
    if (useCustom && customQuery.trim()) {
      const customScenario = demoScenarios[0];
      onStartCouncil({
        ...customScenario,
        plaintext_query: customQuery,
        query_id: 'custom',
      });
    } else {
      const scenario = demoScenarios.find(s => s.query_id === selectedScenarioId);
      if (scenario) {
        onStartCouncil(scenario);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-cyan-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Jlyn* Council
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl text-purple-200 mb-4"
          >
            The First Encrypted Adaptive LLM Council
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-slate-300 max-w-3xl mx-auto"
          >
            Experience multi-agent AI deliberation with end-to-end encryption. Watch as specialized models collaborate through the Jlyn* cipher to provide transparent, consensus-driven answers.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20">
              <Shield className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-cyan-300">Encrypted Privacy</h3>
              <p className="text-slate-300 text-sm">All deliberations protected by Jlyn* cipher with visual star-pattern encryption</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
              <Users className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-purple-300">Multi-Agent Council</h3>
              <p className="text-slate-300 text-sm">Three specialized AI models collaborate with peer review and consensus voting</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20">
              <Sparkles className="w-10 h-10 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-pink-300">Full Transparency</h3>
              <p className="text-slate-300 text-sm">Replay mode reveals entire deliberation process with decrypt-on-demand</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setUseCustom(false)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    !useCustom
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Demo Scenarios
                </button>
                <button
                  onClick={() => setUseCustom(true)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    useCustom
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Custom Query
                </button>
              </div>

              {!useCustom ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select a demo query
                  </label>
                  <select
                    value={selectedScenarioId}
                    onChange={(e) => setSelectedScenarioId(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    {demoScenarios.map((scenario) => (
                      <option key={scenario.query_id} value={scenario.query_id} className="bg-slate-800">
                        {scenario.plaintext_query}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Enter your question
                  </label>
                  <textarea
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="Ask anything..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Custom queries will use demo data from the first scenario
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleStart}
              disabled={useCustom && !customQuery.trim()}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Council Deliberation
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 text-sm">
            Demo mode with pre-recorded responses • No live API calls • Pure client-side encryption
          </p>
        </motion.div>
      </div>
    </div>
  );
}
