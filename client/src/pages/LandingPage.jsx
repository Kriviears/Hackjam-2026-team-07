import { useState, useEffect } from 'react';

// Landing page: dark, futuristic, no stock imagery or generic AI-glow
// corners. A perspective grid receding toward a glowing horizon reinforces
// the "charting a path forward" theme. Nav scrolls to sections on this
// same page instead of routing, since the app doesn't use React Router.
function LandingPage({ onStart, onLogin }) {
  // Tracks how far the page is scrolled so the hero layers can move at
  // different rates (parallax). Updated on every scroll event.
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener('scroll', handleScroll);
    // Cleanup: drop the listener when the component unmounts so we don't
    // leak handlers or call setState on an unmounted component.
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smoothly scrolls to an element by id. The ?. guards against a missing
  // element (returns undefined instead of throwing) so a bad id is a no-op.
  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="bg-[#08090B]">

      {/* Hero section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Parallax layer: moves at 0.3x scroll speed so the background grid
            drifts slower than the foreground content, creating depth.
            NOTE: this wrapper must be `absolute inset-0` itself. A transform
            makes an element the containing block for its absolutely-positioned
            children, so without a size here the inner `absolute inset-0` svg
            would collapse to zero height and vanish. inset-0 fills the hero. */}
        <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
        {/* Perspective grid + horizon glow, replaces the old corner blur circles.
            preserveAspectRatio "slice" makes the SVG cover the area (like
            background-size: cover) so the grid always reaches the edges. */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMax slice">
          <defs>
            <radialGradient id="horizonGlow" cx="50%" cy="55%" r="45%">
              <stop offset="0%" stopColor="#C9915A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C9915A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="380" width="600" height="300" fill="url(#horizonGlow)" />
          {/* Radiating lines converging at the vanishing point = perspective floor */}
          <g stroke="#C9915A" strokeOpacity="0.15" strokeWidth="1">
            <line x1="300" y1="420" x2="0" y2="800" />
            <line x1="300" y1="420" x2="100" y2="800" />
            <line x1="300" y1="420" x2="200" y2="800" />
            <line x1="300" y1="420" x2="400" y2="800" />
            <line x1="300" y1="420" x2="500" y2="800" />
            <line x1="300" y1="420" x2="600" y2="800" />
          </g>
          {/* Curved horizon rings for depth */}
          <g stroke="#C9915A" strokeOpacity="0.1" strokeWidth="1" fill="none">
            <path d="M 80 800 Q 300 700 520 800" />
            <path d="M 160 800 Q 300 740 440 800" />
          </g>
        </svg>
        </div>

        {/* Nav — floating text, no boxed pill, no border */}
        <nav className="relative flex justify-center gap-8 pt-10 text-sm">
          <span className="text-[#F0EAE2] font-medium tracking-wide">illuminate</span>
          <button onClick={() => scrollToSection('how-it-works')} className="text-[#7A756C] hover:text-[#ADA79E]">
            How it works
          </button>
          <button onClick={() => scrollToSection('tracks')} className="text-[#7A756C] hover:text-[#ADA79E]">
            Tracks
          </button>
        </nav>

        {/* Content pulled up from the bottom, centered higher on the page.
            The translateY here is a *counter*-scroll: the page already moves
            content up by scrollY, and this pushes back down by the multiplier.
            A smaller multiplier (0.15) counteracts less than the background's
            0.3, so the headline ends up moving faster than the grid — that
            speed difference is the parallax. opacity fades to 0 by 400px so the
            headline dissolves as you scroll past the hero. */}
        <div
          className="relative flex flex-col items-center text-center px-10 pt-24"
          style={{ transform: `translateY(${scrollY * 0.15}px)`, opacity: Math.max(1 - scrollY / 400, 0) }}
        >
          <h1 className="font-serif font-bold text-5xl text-[#F0EAE2] leading-tight">
            Chart Your<br />Tech Career
          </h1>
          <p className="text-[#ADA79E] text-sm mt-4 mb-7 max-w-xs">
            A few words about where you're starting. We'll help chart the rest.
          </p>

          <div className="flex gap-3 items-center w-full max-w-md">
            <input
              type="text"
              placeholder="I want to work in cybersecurity, but I'm not sure where to start..."
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder-[#8A8378]"
            />
            <button
              onClick={onStart}
              className="bg-[#C9915A] text-[#150E06] font-medium px-5 py-3 rounded-lg text-sm whitespace-nowrap"
            >
              Chart my path
            </button>
          </div>
          <button onClick={onLogin} className="text-xs text-[#6B6660] underline mt-3">
            Already have an account? Log in
          </button>
        </div>
      </div>

      {/* How it works section */}
      <div id="how-it-works" className="px-10 py-24 max-w-5xl mx-auto text-center">
        <h2 className="text-[#F0EAE2] text-3xl font-serif font-bold mb-12">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-12 md:gap-16">
          {[
            { step: "01", title: "Tell us about yourself", desc: "A few words about your background and goals." },
            { step: "02", title: "AI builds your roadmap", desc: "A personalized path from where you are to where you're going." },
            { step: "03", title: "Track your progress", desc: "Check off skills as you master them, tier by tier." },
          ].map((item) => (
            <div key={item.step}>
              <p className="text-[#C9915A] text-sm font-medium mb-2">{item.step}</p>
              <p className="text-[#F0EAE2] font-medium mb-1">{item.title}</p>
              <p className="text-[#8A8378] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tracks section */}
      <div id="tracks" className="px-10 py-24 max-w-4xl mx-auto text-center">
        <h2 className="text-[#F0EAE2] text-3xl font-serif font-bold mb-10">Tracks</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Cloud", "Cybersecurity", "Data Engineering", "Software Engineering", "Systems Support"].map((track) => (
            <div key={track} className="bg-white/5 border border-white/10 rounded-lg py-6 px-4 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)]">
              <p className="text-[#F0EAE2] text-sm font-medium">{track}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default LandingPage;
