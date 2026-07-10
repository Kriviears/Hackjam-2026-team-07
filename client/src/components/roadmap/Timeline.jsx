import CourseCard from './CourseCard';

// No longer calls the API directly — onToggleSkill is passed down from
// App.jsx, which owns the roadmap state and can actually trigger a re-render.
function Timeline({ roadmap, onToggleSkill }) {
  return (
    <div className="max-w-xl mx-auto">
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
