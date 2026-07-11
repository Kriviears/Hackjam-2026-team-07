import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Timeline from './components/roadmap/Timeline';
import ChatWidget from './components/onboarding/ChatWidget';
import RegisterModal from './components/auth/RegisterModal';
import LoginModal from './components/auth/LoginModal';
import { toggleSkill } from './services/api';

// Immutably flips isMastered for a skill matching by name, searching every
// tier and course. Returns a brand-new roadmap object (never mutates the
// original) so React actually detects the change and re-renders.
function toggleSkillInRoadmap(roadmap, skillName) {
  const updated = structuredClone(roadmap);
  ["junior", "middle", "senior"].forEach((level) => {
    updated.timeline[level].courses.forEach((course) => {
      course.skills.forEach((skill) => {
        if (skill.name === skillName) {
          skill.isMastered = !skill.isMastered;
        }
      });
    });
  });
  return updated;
}

// Tracks which "page" is currently showing. Starts at landing, moves to
// chat once the user clicks "Chart my path", then to the roadmap once
// the AI responds. This is a simple stand-in for real routing.
function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'chat' | 'roadmap'
  const [roadmap, setRoadmap] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // controls RegisterModal visibility
  const [isLoginOpen, setIsLoginOpen] = useState(false); // controls LoginModal visibility (returning learners)
  const [isSaved, setIsSaved] = useState(false); // swaps the "Save my plan" button for a confirmation message

  function handleStart() {
    setScreen('chat');
  }

  // Called by LoginModal once loginUser + getRoadmap succeed. A returning
  // learner already has a saved roadmap, so we drop them straight onto the
  // roadmap screen in the "saved" state — skipping the guest chat and the
  // "Save my plan" prompt they don't need.
  function handleLoginSuccess(fetchedRoadmap) {
    setRoadmap(fetchedRoadmap);
    setIsSaved(true);
    setIsLoginOpen(false);
    setScreen('roadmap');
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

  // Updates the UI instantly (so the checkmark flips right away), then
  // also persists the change to the real backend if this is a saved user.
  // This used to live in Timeline.jsx and only called the API — since
  // Timeline doesn't own the roadmap state, that never triggered a
  // re-render. Moving it here (where roadmap state actually lives) fixes it.
  async function handleToggleSkill(skillName) {
    setRoadmap((prev) => toggleSkillInRoadmap(prev, skillName));
    if (roadmap?.userId) {
      await toggleSkill(roadmap.userId, skillName);
    }
  }

  if (screen === 'landing') {
    return (
      <>
        {/* onLogin opens the LoginModal for returning learners/alumni */}
        <LandingPage onStart={handleStart} onLogin={() => setIsLoginOpen(true)} />
        {/* LoginModal only mounts while isLoginOpen is true */}
        {isLoginOpen && (
          <LoginModal
            onClose={() => setIsLoginOpen(false)}
            onSuccess={handleLoginSuccess}
          />
        )}
      </>
    );
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
        <Timeline roadmap={roadmap} onToggleSkill={handleToggleSkill} />

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

        {/* RegisterModal only mounts while isRegisterOpen is true.
            roadmapData is roadmap.track (not the whole roadmap) because the
            real /api/auth/register endpoint expects a flat object with
            track_id/title/match_reason directly on it, not nested. */}
        {isRegisterOpen && (
          <RegisterModal
            roadmapData={roadmap.track}
            onClose={() => setIsRegisterOpen(false)}
            onSuccess={handleRegisterSuccess}
          />
        )}
      </div>
    );
  }
}

export default App;
