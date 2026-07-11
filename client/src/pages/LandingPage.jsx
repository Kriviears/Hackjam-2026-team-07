// The first screen users see. Sets a dark, premium tone using pure CSS
// (no photo needed) — a warm copper glow stands in for a background image.
function LandingPage({ onStart, onLogin }) {
  return (
    <div className="relative min-h-screen bg-[#0A0B0D] overflow-hidden">
      {/* Two soft blurred circles create the warm "light source" feeling,
          instead of a real photo. Positioned off-screen edges so they glow
          in from the corners rather than sitting as visible shapes.
          Opacity kept low (8%/6%) so the glow reads as ambient light,
          not a heavy color wash. */}
      <div className="absolute -top-20 -right-16 w-80 h-80 rounded-full bg-[#C9915A]/8 blur-3xl" />
      <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-[#C9915A]/6 blur-3xl" />

      {/* Floating glass nav bar. Sized to its content (w-fit) and centered
          with "flex" + "mx-auto" — mx-auto only centers block-level boxes,
          so this has to be "flex" here, not "inline-flex", or the auto
          margins do nothing and the pill sticks to the left. A shadow
          gives it depth instead of a glowing border. */}
      <nav
        className="relative flex justify-center items-center gap-10 mx-auto mt-12 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-md w-fit"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
      >
        <span className="text-[#F0EAE2] font-medium text-base">illuminate</span>
        <div className="flex gap-6 text-sm text-[#ADA79E]">
          <span>How it works</span>
          <span>Tracks</span>
          <span>Mentors</span>
        </div>
      </nav>

      {/* Headline + input, anchored toward the middle-bottom of the hero
          and centered (text-center + items-center) rather than left-aligned. */}
      <div className="relative flex flex-col items-center justify-end min-h-[70vh] px-10 pb-16 text-center">
        <h1 className="font-serif font-bold text-5xl text-[#F0EAE2] leading-tight mb-3">
          Chart Your
          <br />
          Tech Career
        </h1>
        <p className="text-[#ADA79E] text-sm mb-6 max-w-xs">
          A few words about where you're starting. We'll help chart the rest.
        </p>

        <div className="flex gap-3 items-center max-w-md">
          <input
            type="text"
            placeholder="I want to work in cybersecurity, but I'm not sure where to start..."
            className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder-[#8A8378]"
          />
          <button
            onClick={onStart}
            className="bg-[#C9915A] text-[#2A1B0E] font-medium px-5 py-3 rounded-lg text-sm shadow-[0_0_16px_2px_rgba(201,145,90,0.35)]"
          >
            Chart my path
          </button>
        </div>

        {/* Secondary path for returning learners/alumni. Kept small and muted
            (text-xs + #8A8378) so it stays visually below the primary
            "Chart my path" CTA. Opens the LoginModal via the onLogin prop. */}
        <button onClick={onLogin} className="text-xs text-[#8A8378] mt-3 underline">
          Already have an account? Log in
        </button>
      </div>

      {/* Scroll indicator, bottom right */}
      <div className="absolute bottom-6 right-6 w-11 h-11 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
        <span className="text-[#F0EAE2] text-base">↓</span>
      </div>
    </div>
  );
}

export default LandingPage;
