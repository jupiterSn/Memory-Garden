import { useAuth } from "@/hooks/useAuth";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold text-emerald-900">
            Dashboard 🌿
          </h1>

          <p className="mt-2 text-stone-500">
            Welcome back,
            {" "}
            <span className="font-semibold">
              {user?.name}
            </span>
          </p>
        </div>

        <button
          onClick={logout}
          className="rounded-2xl bg-red-100 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-200"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <p className="text-sm text-stone-500">
            Total Memories
          </p>

          <h2 className="mt-3 text-4xl font-bold text-emerald-900">
            0
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <p className="text-sm text-stone-500">
            Happy Memories
          </p>

          <h2 className="mt-3 text-4xl font-bold text-yellow-500">
            🌻
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <p className="text-sm text-stone-500">
            Peaceful Memories
          </p>

          <h2 className="mt-3 text-4xl font-bold text-pink-500">
            🌸
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <p className="text-sm text-stone-500">
            Dreams
          </p>

          <h2 className="mt-3 text-4xl font-bold text-purple-500">
            ⭐
          </h2>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;