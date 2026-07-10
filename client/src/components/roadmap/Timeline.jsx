// Displays the full career roadmap as a vertical stack of three levels.
// Pulls in CourseCard for each one so the actual card layout only lives in one place.
import CourseCard from "./CourseCard";

function Timeline({ roadmap }) {
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

      {/* One CourseCard per level, in order: junior → middle → senior */}
      <CourseCard level="junior" data={roadmap.timeline.junior} />
      <CourseCard level="middle" data={roadmap.timeline.middle} />
      <CourseCard level="senior" data={roadmap.timeline.senior} />
    </div>
  );
}

export default Timeline;
