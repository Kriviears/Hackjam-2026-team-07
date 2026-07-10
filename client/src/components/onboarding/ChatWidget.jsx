// Onboarding step: asks the user one question about their background,
// sends it to the AI (or mock data), and hands the resulting roadmap
// back up to App.jsx via onComplete.
import { useState } from "react";
import { generateRoadmap } from "../../services/api";
import LoadingSpinner from "../shared/LoadingSpinner";

function ChatWidget({ onComplete }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser from doing a full page reload on submit
    if (!input.trim()) return; // ignore empty/whitespace-only submissions

    setIsLoading(true);
    const roadmap = await generateRoadmap(input);
    setIsLoading(false);
    onComplete(roadmap); // tell App.jsx we're done so it can switch to the roadmap screen
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
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="I watched some HTML videos and I like helping people fix things..."
        rows={3}
        className="bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500"
      />
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
