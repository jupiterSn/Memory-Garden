import { Outlet } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8fb_0%,#f3f8ed_48%,#eef7f2_100%)] text-stone-900">
      <div className="flex">
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
