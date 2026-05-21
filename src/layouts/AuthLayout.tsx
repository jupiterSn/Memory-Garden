import { Outlet } from "react-router-dom";
import { Leaf } from "lucide-react";

function AuthLayout() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-pink-50 to-stone-100 px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-xl backdrop-blur lg:grid-cols-[1fr_1.1fr]">
          <section className="hidden bg-emerald-900 p-10 text-white lg:block">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-white/15">
                <Leaf className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Memory Garden</h1>
                <p className="text-sm text-emerald-100">
                  A peaceful place for personal memories.
                </p>
              </div>
            </div>

            <div className="mt-20">
              <p className="text-4xl font-semibold leading-tight">
                Plant memories.
                <br />
                Watch them grow.
              </p>
              <p className="mt-5 max-w-md text-sm leading-7 text-emerald-100">
                Turn emotions, milestones, dreams, and nostalgic moments into a
                living digital garden.
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <Outlet />
          </section>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;