import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock, Flower2, Plus, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function GardenHome() {
  const { user } = useAuth();

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mg-panel p-6"
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div>
            <p className="mg-label">Workspace</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-stone-900">
              Good to see you, {user?.name ?? "Memory Keeper"}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              Use this home base to add memories, browse the collection, or jump
              into timeline review.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-10 rounded-xl bg-pink-500 text-white hover:bg-pink-500">
                <Link to="/plant">
                  <Plus className="size-4" />
                  Plant memory
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-10">
                <Link to="/dashboard">
                  Open dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-stone-900">Protected session</p>
                <p className="text-sm text-zinc-500">Only you can enter this garden</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Garden", text: "View the complete visual collection.", icon: Flower2, to: "/garden" },
          { title: "Timeline", text: "Review memories by date and emotion.", icon: CalendarClock, to: "/timeline" },
          { title: "Dashboard", text: "Analyze archive status with AG Grid.", icon: ArrowRight, to: "/dashboard" },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.title} to={item.to} className="mg-panel block p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="grid size-10 place-items-center rounded-lg bg-zinc-100 text-zinc-800">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-5 font-semibold text-stone-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{item.text}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default GardenHome;
