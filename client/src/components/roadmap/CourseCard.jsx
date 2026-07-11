// Renders one TIER of the roadmap (junior/middle/senior). A tier can hold
// multiple courses — e.g. Junior has both "IT Support Training" and
// "Low Voltage Telecom Training" — each with its own skill checklist.
function CourseCard({ level, data, onToggleSkill }) {
  const isActive = data.status === "active";

  // Combine skills across every course in this tier to compute percent
  // complete, in case the backend hasn't sent one directly yet.
  const allSkills = data.courses.flatMap((course) => course.skills);
  const masteredCount = allSkills.filter((s) => s.isMastered).length;
  const computedPercent = allSkills.length
    ? Math.round((masteredCount / allSkills.length) * 100)
    : 0;
  const progressPercent = data.progress_percent ?? computedPercent;

  return (
    <div className={`rounded-lg border p-4 mb-3 transition ${
      isActive ? "border-[#C9915A]/30 bg-[#1A1610]" : "border-white/10 bg-[#0F1012] opacity-60"
    }`}>
      <h3 className="font-medium mb-1 text-[#F0EAE2]">
        {data.label || level} {isActive ? "· active" : "· locked"}
      </h3>

      {isActive && (
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
  );
}

export default CourseCard;
