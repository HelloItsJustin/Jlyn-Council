import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Home, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { DemoScenario } from '../utils/types';
import ReplayMode from './ReplayMode';

interface CouncilReportProps {
  scenario: DemoScenario;
  onReset: () => void;
}

export default function CouncilReport({ scenario, onReset }: CouncilReportProps) {
  const [showReplay, setShowReplay] = useState(false);

  const handleDownloadReport = () => {
    const report = {
      query: scenario.plaintext_query,
      encrypted_query: scenario.encrypted_query,
      jlyn_key: scenario.jlyn_key,
      council_responses: scenario.council_responses,
      peer_reviews: scenario.peer_reviews,
      synthesis: scenario.plaintext_synthesis,
      encrypted_synthesis: scenario.encrypted_synthesis,
      consensus_level: scenario.consensus_level,
      total_time: scenario.total_time_seconds,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jlyn-council-report-${scenario.query_id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const avgConfidence = Math.round(
    scenario.council_responses.reduce((sum, r) => sum + r.confidence, 0) / scenario.council_responses.length
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Deliberation Complete</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Council Decision</h2>
            <p className="text-slate-300">{scenario.plaintext_query}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-8"
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">Final Answer</h3>
            <div className="bg-black/30 rounded-2xl p-6 text-slate-100 leading-relaxed text-lg">
              {scenario.plaintext_synthesis}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mb-8"
          >
            <h3 className="text-2xl font-semibold mb-6">Report Card</h3>

            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-2xl p-6 border border-cyan-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <span className="text-sm text-slate-300">Response Time</span>
                </div>
                <div className="text-3xl font-bold text-cyan-400">{scenario.total_time_seconds}s</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-6 border border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-slate-300">Consensus</span>
                </div>
                <div className="text-3xl font-bold text-green-400">{scenario.consensus_level}%</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  <span className="text-sm text-slate-300">Models Used</span>
                </div>
                <div className="text-3xl font-bold text-purple-400">{scenario.council_responses.length}</div>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-pink-500/5 rounded-2xl p-6 border border-pink-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-pink-400" />
                  <span className="text-sm text-slate-300">Avg Confidence</span>
                </div>
                <div className="text-3xl font-bold text-pink-400">{avgConfidence}%</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Council Members</h4>
              {scenario.council_responses.map((response, index) => (
                <div
                  key={index}
                  className="bg-black/30 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h5 className="font-semibold text-white">{response.model}</h5>
                    <p className="text-sm text-slate-400">{response.role}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Confidence</div>
                      <div className="text-xl font-bold text-green-400">{response.confidence}%</div>
                    </div>
                    <div className="w-24 bg-white/10 rounded-full h-3">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                        style={{ width: `${response.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-4"
          >
            <button
              onClick={() => setShowReplay(true)}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 py-4 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
            >
              <Eye className="w-5 h-5" />
              Decrypt Full Deliberation
            </button>

            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 py-4 px-6 rounded-xl font-semibold text-lg transition-all"
            >
              <Download className="w-5 h-5" />
              Download Report
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Start New Deliberation</span>
            </button>
          </motion.div>
        </div>
      </div>

      {showReplay && (
        <ReplayMode scenario={scenario} onClose={() => setShowReplay(false)} />
      )}
    </>
  );
}
