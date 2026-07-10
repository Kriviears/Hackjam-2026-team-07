import Timeline from "./components/roadmap/Timeline";
import { mockRoadmap } from "./data/mockRoadmap";

function App() {
  return (
    <div className="mt-10 px-4">
      <Timeline roadmap={mockRoadmap} />
    </div>
  );
}

export default App;
