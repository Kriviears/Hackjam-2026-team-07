// Onboarding step: asks the user one question about their background,
// sends it to the AI (or mock data), and hands the resulting roadmap
// back up to App.jsx via onComplete.
import { useState } from "react";
import { generateRoadmap } from "../../services/api";
import LoadingSpinner from "../shared/LoadingSpinner";

// The Web Speech API is exposed under different names across browsers:
// standard `SpeechRecognition` in some, `webkitSpeechRecognition` in
// Chromium. Resolve it once here; it's `undefined` in browsers without support.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function ChatWidget({ onComplete }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); // true while the mic is actively capturing speech

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser from doing a full page reload on submit
    if (!input.trim()) return; // ignore empty/whitespace-only submissions

    setIsLoading(true);
    const roadmap = await generateRoadmap(input);
    setIsLoading(false);
    onComplete(roadmap); // tell App.jsx we're done so it can switch to the roadmap screen
  }

  // Starts a one-shot speech-to-text capture and drops the transcript into
  // the input box. Uses the browser's built-in Web Speech API (no network
  // call of our own). onstart/onend toggle the "Listening..." UI; onresult
  // fires once with the recognized text when the user stops speaking.
  function startVoiceInput() {
    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser. Try Chrome!");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false; // only deliver the final result, not partial guesses
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
    };
    recognition.start();
  }

  // While waiting on the AI, show a spinner instead of the form
  if (isLoading) {
    return (
      <LoadingSpinner message="Analyzing your background and building your roadmap..." />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <label className="text-sm text-gray-300">
        Tell me about your background and goals in one or two sentences.
      </label>
      {/* Textarea and mic sit side by side; the mic fills the input by voice */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I watched some HTML videos and I like helping people fix things..."
          rows={3}
          className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500"
        />
        {/* Toggles color/label based on isListening so the user gets live feedback */}
        <button
          type="button"
          onClick={startVoiceInput}
          className={`px-3 py-2 rounded-lg text-sm border self-start ${
            isListening ? "bg-red-500/20 border-red-400 text-red-300" : "border-white/15 text-gray-400"
          }`}
        >
          {isListening ? "🎤 Listening..." : "🎤 Speak"}
        </button>
      </div>
      <button
        type="submit"
        className="bg-[#C9915A] text-[#2A1B0E] font-medium px-5 py-3 rounded-lg text-sm self-start"
      >
        Build my path
      </button>
    </form>
  );
}

export default ChatWidget;
