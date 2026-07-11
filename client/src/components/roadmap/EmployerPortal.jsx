// Surfaces every distinct target role across all three tiers of the roadmap,
// so the learner can see which real-world jobs this path prepares them for.
function EmployerPortal({ roadmap }) {
  // Collect target_roles from every course at every level, deduped via a Set.
  const allRoles = new Set();
  ["junior", "middle", "senior"].forEach((level) => {
    roadmap.timeline[level]?.courses?.forEach((course) => {
      course.target_roles?.forEach((role) => allRoles.add(role));
    });
  });
  const roles = Array.from(allRoles);

  // Nothing to show if no course declares any target roles.
  if (roles.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-lg bg-[#141518] border border-white/10">
      <h3 className="text-[#F0EAE2] font-medium mb-1">Career opportunities on this path</h3>
      <p className="text-xs text-[#8A8378] mb-3">Roles this roadmap prepares you for</p>
      {/* Each role rendered as a pill */}
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <span key={role} className="text-xs bg-[#C9915A]/10 text-[#C9915A] border border-[#C9915A]/20 px-3 py-1.5 rounded-full">
            {role}
          </span>
        ))}
      </div>
    </div>
  );
}

export default EmployerPortal;
