// A reusable spinning circle + message, shown any time we're waiting on
// something async (like the AI generating a roadmap).
function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      {/* The ring itself: a circle with one colored edge, spun by Tailwind's animate-spin */}
      <div className="w-8 h-8 border-2 border-white/20 border-t-[#C9915A] rounded-full animate-spin" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
