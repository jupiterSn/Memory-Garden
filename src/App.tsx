import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

import Dashboard from "@/pages/main/Dashboard";
import GardenHome from "@/pages/main/GardenHome";
import PlantMemory from "@/pages/main/PlantMemory";
import Garden from "@/pages/main/Garden";
import Timeline from "@/pages/main/Timeline";
import Profile from "@/pages/main/Profile";
import Settings from "@/pages/main/Settings";
import Admin from "@/pages/main/Admin";

import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import type { Memory } from "@/models/memory";

function App() {
  const [memories, setMemories] = useState<Memory[]>(() => {
    const savedMemories = localStorage.getItem("memory-garden-memories");
    return savedMemories ? JSON.parse(savedMemories) : [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "memory-garden-memories",
        JSON.stringify(memories)
      );
    } catch (error) {
      console.error("Unable to save memories locally", error);
    }
  }, [memories]);

  const addMemory = (memory: Memory) => {
    setMemories((currentMemories) => [...currentMemories, memory]);
  };

  const deleteMemory = (id: number) => {
    setMemories((currentMemories) =>
      currentMemories.filter((memory) => memory.id !== id)
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard memories={memories} />} />

          <Route path="/app" element={<GardenHome />} />

          <Route
            path="/plant"
            element={<PlantMemory addMemory={addMemory} />}
          />

          <Route
            path="/garden"
            element={
              <Garden memories={memories} deleteMemory={deleteMemory} />
            }
          />

          <Route
            path="/timeline"
            element={<Timeline memories={memories} />}
          />

          <Route path="/profile" element={<Profile />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
