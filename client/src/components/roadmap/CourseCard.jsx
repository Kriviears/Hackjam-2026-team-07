// Renders ONE course level (junior, middle, or senior) as a card.
// Reused 3 times by Timeline.jsx — once per level.
function CourseCard({ level, data }) {
  const isActive = data.status === "active";

  return (
    <div
      className={`rounded-lg border p-4 mb-3 transition ${
        isActive
          ? "border-green-200 bg-green-50" // active level stands out
          : "border-gray-200 bg-gray-50 opacity-60" // locked levels are dimmed
      }`}
    >
      <h3 className="capitalize font-medium mb-2">
        {level} {isActive ? "· active" : "· locked"}
      </h3>
      <p className="font-bold mb-2">{data.course}</p>

      {/* Only the active level has a real progress number to show */}
      {isActive && data.progress_percent !== undefined && (
        <p className="text-gray-500 mb-3">{data.progress_percent}% complete</p>
      )}

      {/* Skill checklist — checkmark if mastered, circle if not yet */}
      <ul className="list-none p-0 m-0 space-y-1">
        {data.skills.map((skill, index) => (
          <li
            key={index}
            className={skill.isMastered ? "text-green-600" : "text-gray-400"}
          >
            {skill.isMastered ? "✔" : "○"} {skill.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseCard;
