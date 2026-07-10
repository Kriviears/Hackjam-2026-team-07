// Temporary test file — just proving CourseCard renders with real mock data.
// We'll replace this with proper page routing once we build the other pages.
import CourseCard from "./components/roadmap/CourseCard";
import { mockRoadmap } from "./data/mockRoadmap";

function App() {
  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-xl font-medium mb-4">Illuminate — roadmap preview</h1>
      <CourseCard level="junior" data={mockRoadmap.timeline.junior} />
      <CourseCard level="middle" data={mockRoadmap.timeline.middle} />
      <CourseCard level="senior" data={mockRoadmap.timeline.senior} />
    </div>
  );
}

export default App;
