import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import frierenParty from "@/assets/frieren-party.png";
import { getDemoPreferences } from "@/data/mockAuth";

const pageThemes: Record<
  string,
  {
    background: string;
    portrait: string;
    alt: string;
  }
> = {
  "/app": {
    background: "page-bg-app",
    portrait: "party-portrait-frieren",
    alt: "Frieren themed page portrait",
  },
  "/dashboard": {
    background: "page-bg-dashboard",
    portrait: "party-portrait-fern",
    alt: "Fern themed page portrait",
  },
  "/plant": {
    background: "page-bg-plant",
    portrait: "party-portrait-stark",
    alt: "Stark themed page portrait",
  },
  "/garden": {
    background: "page-bg-garden",
    portrait: "party-portrait-himmel",
    alt: "Himmel themed page portrait",
  },
  "/timeline": {
    background: "page-bg-timeline",
    portrait: "party-portrait-frieren",
    alt: "Frieren themed page portrait",
  },
  "/profile": {
    background: "page-bg-profile",
    portrait: "party-portrait-fern",
    alt: "Fern themed page portrait",
  },
  "/settings": {
    background: "page-bg-settings",
    portrait: "party-portrait-stark",
    alt: "Stark themed page portrait",
  },
  "/admin": {
    background: "page-bg-admin",
    portrait: "party-portrait-himmel",
    alt: "Himmel themed page portrait",
  },
};

function MainLayout() {
  const { pathname } = useLocation();
  const [lowLight, setLowLight] = useState(() => Boolean(getDemoPreferences()?.lowLight));
  const pageTheme = pageThemes[pathname] ?? pageThemes["/app"];

  useEffect(() => {
    const updateLowLight = () => {
      setLowLight(Boolean(getDemoPreferences()?.lowLight));
    };

    window.addEventListener("memory-garden-preferences-updated", updateLowLight);
    window.addEventListener("storage", updateLowLight);

    return () => {
      window.removeEventListener("memory-garden-preferences-updated", updateLowLight);
      window.removeEventListener("storage", updateLowLight);
    };
  }, []);

  return (
    <div
      className={`memory-world-bg ${pageTheme.background} ${
        lowLight ? "low-light-comfort" : ""
      } min-h-screen text-stone-900`}
    >
      <img
        src={frierenParty}
        alt={pageTheme.alt}
        className={`party-page-portrait ${pageTheme.portrait}`}
      />
      <div className="relative z-10 flex">
        <Sidebar />

        <div className="min-h-screen flex-1 lg:pl-72">
          <Navbar />

          <main className="mx-auto w-full max-w-[1500px] px-4 py-5 pb-28 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
