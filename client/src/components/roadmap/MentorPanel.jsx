// Shows the track-matched mentors the backend returns on roadmap.mentors
// (from both the onboarding and roadmap routes). className/style are optional
// pass-throughs so Timeline can fold this into its staggered fade-in, matching
// EmployerPortal. Renders nothing when there are no mentors so the layout stays
// clean for tracks/personas without any.
function MentorPanel({ roadmap, className = "", style }) {
  const mentors = roadmap.mentors || [];
  if (mentors.length === 0) return null;

  return (
    <div className={`${className} mb-6 p-4 rounded-lg bg-[#141518] border border-white/10`} style={style}>
      <h3 className="text-[#F0EAE2] font-medium mb-1">Mentors matched to your path</h3>
      <p className="text-xs text-[#8A8378] mb-3">People who've walked this road and can guide you</p>

      <div className="space-y-3">
        {mentors.map((mentor) => {
          // Initials for the avatar circle, derived from the name (max 2).
          const initials = mentor.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("");
          return (
            <div key={mentor.name} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#C9915A]/15 text-[#C9915A] text-xs font-medium flex items-center justify-center">
                {initials}
              </div>
              <div>
                <p className="text-[#F0EAE2] text-sm font-medium">{mentor.name}</p>
                <p className="text-[#ADA79E] text-xs">{mentor.role}</p>
                {mentor.expertise && (
                  <p className="text-[#8A8378] text-xs mt-0.5">{mentor.expertise}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MentorPanel;
