import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import CouncilDeliberation from './components/CouncilDeliberation';
import CouncilReport from './components/CouncilReport';
import { DemoScenario } from './utils/types';

type AppState = 'landing' | 'deliberating' | 'report';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentScenario, setCurrentScenario] = useState<DemoScenario | null>(null);

  const handleStartCouncil = (scenario: DemoScenario) => {
    setCurrentScenario(scenario);
    setAppState('deliberating');
  };

  const handleDeliberationComplete = () => {
    setAppState('report');
  };

  const handleReset = () => {
    setCurrentScenario(null);
    setAppState('landing');
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <LandingPage onStartCouncil={handleStartCouncil} />
        )}

        {appState === 'deliberating' && currentScenario && (
          <CouncilDeliberation
            scenario={currentScenario}
            onComplete={handleDeliberationComplete}
          />
        )}

        {appState === 'report' && currentScenario && (
          <CouncilReport scenario={currentScenario} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App; // Exports the App component as the default export
