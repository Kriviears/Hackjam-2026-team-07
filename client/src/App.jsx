import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Timeline from './components/roadmap/Timeline';
import ChatWidget from './components/onboarding/ChatWidget';
import RegisterModal from './components/auth/RegisterModal';

// Tracks which "page" is currently showing. Starts at landing, moves to
// chat once the user clicks "Chart my path", then to the roadmap once
// the AI responds. This is a simple stand-in for real routing.
function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'chat' | 'roadmap'
  const [roadmap, setRoadmap] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // controls RegisterModal visibility
  const [isSaved, setIsSaved] = useState(false); // swaps the "Save my plan" button for a confirmation message

  function handleStart() {
    setScreen('chat');
  }

  function handleChatComplete(roadmapData) {
    setRoadmap(roadmapData); // save the AI's response so Timeline can use it
    setScreen('roadmap');
  }

  // Called by RegisterModal once registerUser succeeds — closes the modal
  // and flips the UI into the "saved" state.
  function handleRegisterSuccess() {
    setIsRegisterOpen(false);
    setIsSaved(true);
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
      <div className="min-h-screen bg-[#0A0B0D] pt-10 px-4">
        {/* userId lets Timeline persist skill-toggle clicks via the API;
            it's undefined for guests, in which case Timeline just no-ops. */}
        <Timeline roadmap={roadmap} persona="aspiring_candidate" userId={roadmap?.userId} />

        {!isSaved ? (
          <div className="max-w-xl mx-auto mt-4">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="w-full bg-[#C9915A] text-[#2A1B0E] font-medium py-3 rounded-lg text-sm"
            >
              Save my plan
            </button>
          </div>
        ) : (
          <p className="max-w-xl mx-auto mt-4 text-center text-green-500 text-sm">
            Your plan is saved!
          </p>
        )}

        {/* RegisterModal only mounts while isRegisterOpen is true */}
        {isRegisterOpen && (
          <RegisterModal
            roadmapData={roadmap}
            onClose={() => setIsRegisterOpen(false)}
            onSuccess={handleRegisterSuccess}
          />
        )}
      </div>
    );
  }
}

export default App;
