import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "@/components/Navbar";

import Home from "@/pages/Home";
import PlantMemory from "@/pages/PlantMemory";
import Garden from "@/pages/Garden";
import Timeline from "@/pages/Timeline";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-emerald-50 text-stone-900">
        <Navbar />

        <main className="px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/plant"
              element={<PlantMemory />}
            />

            <Route
              path="/garden"
              element={<Garden />}
            />

            <Route
              path="/timeline"
              element={<Timeline />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;