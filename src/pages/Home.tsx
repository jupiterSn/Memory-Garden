import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flower2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import sakuraHero from "@/assets/sakura-hero.png";

const petals = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  size: `${8 + (index % 5) * 3}px`,
  delay: `${-(index * 0.7)}s`,
  duration: `${8 + (index % 7) * 1.4}s`,
  drift: `${index % 2 === 0 ? 80 + index * 3 : -70 - index * 2}px`,
  opacity: `${0.34 + (index % 4) * 0.09}`,
  blur: `${index % 4 === 0 ? 0.8 : 0}px`,
}));

function Home() {
  return (
    <main className="min-h-screen bg-[#fff8fb] text-stone-900">
      <section className="relative min-h-screen overflow-hidden">
        <img
          src={sakuraHero}
          alt="Sakura tree in a peaceful spring garden"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,247,242,0.94)_0%,rgba(255,247,242,0.74)_42%,rgba(255,247,242,0.22)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          {petals.map((petal) => (
            <span
              key={petal.id}
              className="sakura-petal"
              style={
                {
                  left: petal.left,
                  "--petal-size": petal.size,
                  "--petal-delay": petal.delay,
                  "--petal-duration": petal.duration,
                  "--petal-drift": petal.drift,
                  "--petal-opacity": petal.opacity,
                  "--petal-blur": petal.blur,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div className="relative z-10 flex min-h-screen max-w-7xl flex-col justify-between px-6 py-6 sm:px-10 lg:px-14">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/80 text-pink-500 shadow-sm shadow-pink-100 backdrop-blur">
              <Flower2 className="size-5" />
            </span>
            <span className="font-semibold tracking-tight text-stone-900">
              Memory Garden
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl py-14"
          >
            <p className="mg-label">A softer place to remember</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl">
              Memory Garden
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-stone-700">
              Plant personal memories in a calm sakura garden, attach photos or
              videos, and watch each story become part of a living landscape.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="garden-button h-11 px-5"
              >
                <Link to="/signup">
                  Create account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-pink-100 bg-white/75 px-5 text-stone-800 shadow-sm shadow-pink-100 backdrop-blur hover:-translate-y-0.5 hover:bg-pink-50"
              >
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </motion.div>

          <div className="mb-2 grid max-w-2xl gap-3 border-t border-pink-100/80 pt-5 text-sm text-stone-600 sm:grid-cols-3">
            <span>Sakura garden view</span>
            <span>Plant-based memories</span>
            <span>Gentle private archive</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
