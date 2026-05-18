import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "@/components/Navbar";

import Home from "@/pages/Home";
import Garden from "@/pages/Garden";
import Timeline from "@/pages/Timeline";
import PlantMemory from "@/pages/PlantMemory";

import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

import Dashboard from "@/pages/main/Dashboard";

import ProtectedRoute from "@/routes/ProtectedRoute";

import type { Memory } from "@/models/memory";

import { useState, useEffect } from "react";

function App() {
  const [memories, setMemories] = useState<Memory[]>(() => {
    const savedMemories = localStorage.getItem(
      "memory-garden-memories"
    );

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
    setMemories((currentMemories) => [
      ...currentMemories,
      memory,
    ]);
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

        <main>
          <Routes>
            
            {/* PUBLIC ROUTES */}

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route
              path="/signup"
              element={<Signup />}
            />

            
            {/* PROTECTED ROUTES */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/plant"
              element={
                <ProtectedRoute>
                  <PlantMemory
                    addMemory={addMemory}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/garden"
              element={
                <ProtectedRoute>
                  <Garden
                    memories={memories}
                    deleteMemory={
                      deleteMemory
                    }
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/timeline"
              element={
                <ProtectedRoute>
                  <Timeline
                    memories={memories}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;