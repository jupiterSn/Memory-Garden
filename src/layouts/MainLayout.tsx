import { Outlet } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

function MainLayout() {
  return (
    <div className="memory-world-bg min-h-screen text-stone-900">
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
