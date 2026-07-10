// Displays the full career roadmap as a vertical stack of three levels.
// Pulls in CourseCard for each one so the actual card layout only lives in one place.
import CourseCard from "./CourseCard";
import { toggleSkill } from "../../services/api";

// persona and userId are new: persona is forwarded to CourseCard so it knows
// whether to show priority-skill highlighting (aspiring_candidate only), and
// userId lets us know whose skill to update when a checklist item is clicked.
function Timeline({ roadmap, persona, userId }) {
  // Wired to CourseCard's onToggleSkill prop. Only calls the API if we
  // actually have a userId (guest sessions without one just no-op).
  async function handleToggleSkill(skillName) {
    if (userId) {
      await toggleSkill(userId, skillName);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Top summary: which track the user matched to, and why */}
      <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-100">
        <h2 className="font-medium text-lg mb-1">{roadmap.track.title}</h2>
        <p className="text-gray-600 text-sm mb-2">
          {roadmap.track.match_reason}
        </p>
        <p className="text-blue-700 font-medium text-sm">
          {roadmap.track.avg_salary}
        </p>
      </div>

      {/* One CourseCard per level, in order: junior → middle → senior.
          prioritySkills/persona/onToggleSkill are passed through so each
          card can decide whether to show "recommended next" and handle clicks. */}
      {["junior", "middle", "senior"].map((level) => (
        <CourseCard
          key={level}
          level={level}
          data={roadmap.timeline[level]}
          persona={persona}
          prioritySkills={roadmap.track.priority_skills || []}
          onToggleSkill={handleToggleSkill}
        />
      ))}
    </div>
  );
}

export default Timeline;
