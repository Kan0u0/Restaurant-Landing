import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="flex bg-[#f4f4f9] min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
