import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Timeline from './components/roadmap/Timeline';
import ChatWidget from './components/onboarding/ChatWidget';

// Tracks which "page" is currently showing. Starts at landing, moves to
// chat once the user clicks "Chart my path", then to the roadmap once
// the AI responds. This is a simple stand-in for real routing.
function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'chat' | 'roadmap'
  const [roadmap, setRoadmap] = useState(null);

  function handleStart() {
    setScreen('chat');
  }

  function handleChatComplete(roadmapData) {
    setRoadmap(roadmapData); // save the AI's response so Timeline can use it
    setScreen('roadmap');
  }

  if (screen === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }

  if (screen === 'chat') {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center px-6">
        <ChatWidget onComplete={handleChatComplete} />
      </div>
    );
  }

  if (screen === 'roadmap') {
    return (
      <div className="min-h-screen bg-[#0A0B0D] pt-10">
        <Timeline roadmap={roadmap} />
      </div>
    );
  }
}

export default App;