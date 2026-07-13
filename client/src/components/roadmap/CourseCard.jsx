// Renders one TIER of the roadmap (junior/middle/senior). A tier can hold
// multiple courses — e.g. Junior has both "IT Support Training" and
// "Low Voltage Telecom Training" — each with its own skill checklist.
// delayIndex (0-based tier position) staggers this card's fade-in after the
// summary box and employer portal, so tiers cascade in one after another.
function CourseCard({ level, data, onToggleSkill, delayIndex = 0 }) {
  // Tier status from the backend: 'active' | 'locked' | 'completed'. A tier
  // reads 'completed' once one of its courses reaches 100% (GET /api/roadmap).
  const isCompleted = data.status === "completed";
  const isActive = data.status === "active";
  // Completed and active tiers are both "unlocked": full styling + progress line.
  const isUnlocked = isActive || isCompleted;

  // Combine skills across every course in this tier to compute percent
  // complete, in case the backend hasn't sent one directly yet.
  const allSkills = data.courses.flatMap((course) => course.skills);
  const masteredCount = allSkills.filter((s) => s.isMastered).length;
  const computedPercent = allSkills.length
    ? Math.round((masteredCount / allSkills.length) * 100)
    : 0;
  const progressPercent = data.progress_percent ?? computedPercent;

  return (
    // Outer wrapper owns the fade-in only; the locked dim lives on the inner
    // card box so the two never fight (nested opacities multiply).
    <div className="animate-fade-in mb-3" style={{ animationDelay: `${0.3 + delayIndex * 0.15}s` }}>
    {/* Contrast fix: locked cards were opacity-60, which compounded with the
        already-muted text colors (#6B6660) on the near-black bg and made course
        names, checkboxes, and "Leads to:" lines almost unreadable. Bumped to
        opacity-90 so text stays legible; the locked state is still clearly
        de-emphasized via its cooler/darker bg, neutral border, and "· locked"
        label (and the absence of the active "% complete" line). */}
    <div className={`rounded-lg border p-4 transition ${
      isCompleted
        ? "border-[#7FBF9E]/30 bg-[#12180F]"
        : isActive
        ? "border-[#C9915A]/30 bg-[#1A1610]"
        : "border-white/10 bg-[#0F1012] opacity-90"
    }`}>
      <h3 className="font-medium mb-1 text-[#F0EAE2]">
        {data.label || level} {isCompleted ? "· completed" : isActive ? "· active" : "· locked"}
      </h3>

      {isUnlocked && (
        <p className="text-[#ADA79E] mb-3 text-sm">{progressPercent}% complete</p>
      )}

      {data.courses.map((course) => {
        const courseComplete = course.skills.every((s) => s.isMastered);
        return (
          <div key={course.course_id} className="mb-4 last:mb-0">
            <div className="flex items-center gap-2 mb-1.5">
              <p className="font-bold text-[#F0EAE2] text-sm">{course.course_name}</p>
              {courseComplete && (
                <span className="text-xs bg-[#7FBF9E]/15 text-[#7FBF9E] px-2 py-0.5 rounded-full">
                  course complete
                </span>
              )}
            </div>

            <ul className="list-none p-0 m-0 space-y-1.5 mb-2">
              {course.skills.map((skill, index) => (
                <li
                  key={index}
                  onClick={onToggleSkill ? () => onToggleSkill(course.course_id, skill.name) : undefined}
                  className={`flex items-center gap-2 text-sm ${
                    skill.isMastered ? "text-[#7FBF9E]" : "text-[#6B6660]"
                  } ${onToggleSkill ? "cursor-pointer hover:opacity-70" : ""}`}
                >
                  <span>{skill.isMastered ? "✔" : "○"}</span>
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>

            {course.target_roles?.length > 0 && (
              <p className="text-xs text-[#6B6660]">Leads to: {course.target_roles.join(", ")}</p>
            )}
          </div>
        );
      })}
    </div>
    </div>
  );
}

export default CourseCard;
