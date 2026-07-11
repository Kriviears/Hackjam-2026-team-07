import CourseCard from './CourseCard';
import EmployerPortal from './EmployerPortal';

// No longer calls the API directly — onToggleSkill is passed down from
// App.jsx, which owns the roadmap state and can actually trigger a re-render.
// persona drives which contextual banner (if any) is shown at the top.
function Timeline({ roadmap, onToggleSkill, persona }) {
  // True only when the persona is an alumnus AND they've mastered every skill
  // in every junior-tier course — used to nudge them toward the Middle tier.
  const juniorComplete =
    roadmap.timeline.junior?.courses?.every((course) =>
      course.skills?.every((skill) => skill.isMastered)
    ) ?? false;

  return (
    <div className="max-w-xl mx-auto">
      {/* Alumni who've finished all Junior training: point them to Middle tier */}
      {persona === "alumni" && juniorComplete && (
        <div className="mb-4 p-3 rounded-lg bg-[#7FBF9E]/10 border border-[#7FBF9E]/20 text-sm text-[#7FBF9E]">
          Your Junior training is complete! Ready to move forward? Check out the Middle tier upskilling path below.
        </div>
      )}
      {/* Returning learner: welcome-back nudge */}
      {persona === "learner" && (
        <div className="mb-4 p-3 rounded-lg bg-[#C9915A]/10 border border-[#C9915A]/20 text-sm text-[#C9915A]">
          Welcome back — here's where you left off.
        </div>
      )}

      <div className="mb-6 p-4 rounded-lg bg-[#1A1610] border border-[#C9915A]/20">
        <h2 className="font-medium text-lg mb-1 text-[#F0EAE2]">{roadmap.track.title}</h2>
        <p className="text-[#ADA79E] text-sm mb-2">{roadmap.track.match_reason}</p>

        {roadmap.track.avg_salary && (
          <p className="text-[#C9915A] font-medium text-sm">{roadmap.track.avg_salary}</p>
        )}

        {roadmap.track.soft_skills?.length > 0 && (
          <p className="text-xs text-[#8A8378] mt-2">
            <span className="font-medium text-[#ADA79E]">Soft skills to focus on:</span> {roadmap.track.soft_skills.join(", ")}
          </p>
        )}
        {roadmap.track.growth_areas?.length > 0 && (
          <p className="text-xs text-[#8A8378] mt-1">
            <span className="font-medium text-[#ADA79E]">Growth areas:</span> {roadmap.track.growth_areas.join(", ")}
          </p>
        )}
        {roadmap.track.mentor_style_match && (
          <p className="text-xs text-[#8A8378] mt-1">
            <span className="font-medium text-[#ADA79E]">Your ideal mentor type:</span> {roadmap.track.mentor_style_match}
          </p>
        )}
      </div>

      {/* Career opportunities derived from course target_roles */}
      <EmployerPortal roadmap={roadmap} />

      {["junior", "middle", "senior"].map((level) => (
        <CourseCard
          key={level}
          level={level}
          data={roadmap.timeline[level]}
          onToggleSkill={onToggleSkill}
        />
      ))}
    </div>
  );
}

export default Timeline;
