import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "@/components/Navbar";

import Home from "@/pages/Home";
import PlantMemory from "@/pages/PlantMemory";
import Garden from "@/pages/Garden";
import Timeline from "@/pages/Timeline";

import type { Memory } from "@/models/memory";

function App() {
  const [memories, setMemories] = useState<Memory[]>(() => {
    const savedMemories = localStorage.getItem("memory-garden-memories");

    if (!savedMemories) {
      return [];
    }

    return JSON.parse(savedMemories);
  });

  useEffect(() => {
    localStorage.setItem(
      "memory-garden-memories",
      JSON.stringify(memories)
    );
  }, [memories]);

  const addMemory = (memory: Memory) => {
    setMemories((currentMemories) => [...currentMemories, memory]);
  };

  const deleteMemory = (id: number) => {
  setMemories((currentMemories) =>
    currentMemories.filter(
      (memory) => memory.id !== id
    )
  );
};

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-emerald-50 text-stone-900">
        <Navbar />

        <main className="px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/plant"
              element={<PlantMemory addMemory={addMemory} />}
            />

            <Route
              path="/garden"
              element={
              <Garden
               memories={memories} 
               deleteMemory={deleteMemory}
               />
              }
            />

            <Route
              path="/timeline"
              element={<Timeline memories={memories} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;