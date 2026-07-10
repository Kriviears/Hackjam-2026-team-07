// Renders ONE course level as a card.
// - Priority skill highlighting/reordering ONLY applies to aspiring candidates
//   (the AI-driven flow). Learners/alumni always see the same static order.
// - onToggleSkill, when passed in, makes each skill clickable to mark it
//   mastered/unmastered — shared feature across all three personas.
function CourseCard({ level, data, persona, prioritySkills = [], onToggleSkill }) {
  const isActive = data.status === "active";
  const showPriority = persona === "aspiring_candidate";

  const sortedSkills = showPriority
    ? [...data.skills].sort((a, b) => {
        const aIsPriority = prioritySkills.includes(a.name);
        const bIsPriority = prioritySkills.includes(b.name);
        return bIsPriority - aIsPriority;
      })
    : data.skills;

  return (
    <div className={`rounded-lg border p-4 mb-3 transition ${
      isActive ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50 opacity-60"
    }`}>
      <h3 className="capitalize font-medium mb-2">
        {level} {isActive ? "· active" : "· locked"}
      </h3>
      <p className="font-bold mb-2">{data.course}</p>

      {isActive && data.progress_percent !== undefined && (
        <p className="text-gray-500 mb-3">{data.progress_percent}% complete</p>
      )}

      <ul className="list-none p-0 m-0 space-y-1">
        {sortedSkills.map((skill, index) => {
          const isPriority = showPriority && prioritySkills.includes(skill.name);
          return (
            <li
              key={index}
              onClick={onToggleSkill ? () => onToggleSkill(skill.name) : undefined}
              className={`flex items-center gap-2 ${skill.isMastered ? "text-green-600" : "text-gray-400"} ${
                onToggleSkill ? "cursor-pointer hover:opacity-70" : ""
              }`}
            >
              <span>{skill.isMastered ? "✔" : "○"}</span>
              <span>{skill.name}</span>
              {isPriority && !skill.isMastered && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  recommended next
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CourseCard;
