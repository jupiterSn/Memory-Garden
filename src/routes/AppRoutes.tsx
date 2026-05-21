import { useMemo, useState } from "react";
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
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import { useAuth } from "@/hooks/useAuth";
import type { Memory } from "@/models/memory";

function getMemoryStorageKey(userId: number) {
  return `memory-garden-memories-${userId}`;
}

function AppRoutes() {
  const { user } = useAuth();

  const currentUserId = user?.id ?? null;
  const [memoryVersion, setMemoryVersion] = useState(0);

  const memories = useMemo(() => {
    void memoryVersion;

    if (!currentUserId) {
      return [];
    }

    try {
      const savedMemories = localStorage.getItem(
        getMemoryStorageKey(currentUserId)
      );

      return savedMemories ? (JSON.parse(savedMemories) as Memory[]) : [];
    } catch (error) {
      console.error("Unable to load memories locally", error);
      return [];
    }
  }, [currentUserId, memoryVersion]);

  const addMemory = (memory: Memory) => {
    if (!currentUserId) {
      return;
    }

    localStorage.setItem(
      getMemoryStorageKey(currentUserId),
      JSON.stringify([...memories, memory])
    );

    setMemoryVersion((currentVersion) => currentVersion + 1);
  };

  const deleteMemory = (id: number) => {
    if (!currentUserId) {
      return;
    }

    localStorage.setItem(
      getMemoryStorageKey(currentUserId),
      JSON.stringify(memories.filter((memory) => memory.id !== id))
    );

    setMemoryVersion((currentVersion) => currentVersion + 1);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard memories={memories} />} />
          <Route path="/app" element={<GardenHome />} />
          <Route path="/plant" element={<PlantMemory addMemory={addMemory} />} />
          <Route
            path="/garden"
            element={<Garden memories={memories} deleteMemory={deleteMemory} />}
          />
          <Route path="/timeline" element={<Timeline memories={memories} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;