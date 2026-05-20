import { NavLink } from "react-router-dom";
import {
  BarChart3,
  CalendarClock,
  Flower2,
  Home,
  LayoutDashboard,
  Settings,
  Sprout,
  Shield,
  User,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const baseLinks = [
  { name: "Home", path: "/app", icon: Home },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Plant", path: "/plant", icon: Sprout },
  { name: "Garden", path: "/garden", icon: Flower2 },
  { name: "Timeline", path: "/timeline", icon: CalendarClock },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
];

function Sidebar() {
  const { user } = useAuth();
  const links =
    user?.role === "admin"
      ? [...baseLinks, { name: "Admin", path: "/admin", icon: Shield }]
      : baseLinks;

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-pink-100 bg-[#fffafd]/95 text-stone-800 shadow-sm shadow-pink-100/80 backdrop-blur lg:flex lg:flex-col">
        <div className="border-b border-pink-100 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-pink-100 text-pink-500">
              <Flower2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Memory Garden
              </h2>
              <p className="text-xs text-stone-500">Soft memory garden</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-pink-100 text-pink-700 shadow-sm shadow-pink-100"
                      : "text-stone-600 hover:bg-pink-50 hover:text-pink-700",
                  ].join(" ")
                }
              >
                <Icon className="size-4" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-pink-100 p-4">
          <div className="rounded-xl bg-pink-50/80 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="size-4 text-emerald-600" />
              Weekly activity
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[42, 66, 35, 80, 55, 92, 48].map((height, index) => (
                <div
                  key={index}
                  className="flex h-16 items-end rounded bg-white/80 px-1"
                >
                  <span
                    className="w-full rounded-sm bg-emerald-300/80"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-1 rounded-xl border border-pink-100 bg-white/95 p-1 shadow-lg shadow-pink-100/80 backdrop-blur lg:hidden">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                [
                  "grid min-h-12 place-items-center rounded-lg text-xs font-medium transition",
                  isActive
                    ? "bg-pink-100 text-pink-700"
                    : "text-stone-500 hover:bg-pink-50 hover:text-pink-700",
                ].join(" ")
              }
              aria-label={link.name}
            >
              <Icon className="size-5" />
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}

export default Sidebar;
