import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Plant Memory",
      path: "/plant",
    },
    {
      name: "Garden",
      path: "/garden",
    },
    {
      name: "Timeline",
      path: "/timeline",
    },
  ];

  return (
    <nav className="border-b border-emerald-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-emerald-900"
        >
          🌿 Memory Garden
        </Link>

        <div className="flex items-center gap-2">
          {links.map((link) => {
            const isActive =
              location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-xl px-4 py-2 transition ${
                  isActive
                    ? "bg-emerald-700 text-white"
                    : "text-stone-600 hover:bg-emerald-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;