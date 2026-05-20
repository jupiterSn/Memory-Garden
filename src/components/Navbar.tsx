import { useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, Search, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const pageTitles: Record<string, string> = {
  "/app": "Garden Home",
  "/dashboard": "Dashboard",
  "/plant": "Plant Memory",
  "/garden": "Garden",
  "/timeline": "Timeline",
  "/profile": "Profile",
  "/settings": "Settings",
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-[#fff8fb]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Memory Garden
          </p>
          <h1 className="truncate text-lg font-semibold tracking-tight text-stone-900">
            {pageTitles[location.pathname] ?? "Workspace"}
          </h1>
        </div>

        <div className="hidden h-10 min-w-[280px] items-center gap-2 rounded-xl border border-pink-100 bg-white/80 px-3 text-sm text-stone-500 md:flex">
          <Search className="size-4" />
          <span>Search memories, moods, dates</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Notifications"
            onClick={() => toast.info("No new notifications")}
          >
            <Bell className="size-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            className="hidden h-10 gap-2 px-3 sm:inline-flex"
            onClick={() => navigate("/profile")}
          >
            <span className="grid size-6 place-items-center rounded-md bg-pink-100 text-pink-500">
              <User className="size-3.5" />
            </span>
            <span className="max-w-28 truncate">{user?.name ?? "Profile"}</span>
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="h-10 gap-2 px-3"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
