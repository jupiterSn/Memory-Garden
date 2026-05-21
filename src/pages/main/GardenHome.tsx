import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flower2,
  Leaf,
  Sparkles,
  Stars,
} from "lucide-react";

import frierenFlowers from "@/assets/frieren-flowers.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1],
} as const;

function GardenHome() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-2xl backdrop-blur-xl">
      <div className="relative min-h-[88vh] overflow-hidden">
        <motion.img
          src={frierenFlowers}
          alt="Flower field"
          className="absolute inset-0 h-full w-full object-cover"
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-pink-50/45 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fff7fb]" />

        <div className="relative z-10 flex min-h-[88vh] items-center px-8 py-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={transition}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-4 py-2 backdrop-blur">
              <Flower2 className="size-4 text-pink-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
                Welcome back
              </span>
            </div>

            <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight text-stone-900 md:text-7xl">
              Your memories are blooming beautifully.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-700 md:text-lg">
              Continue growing your digital garden through memories,
              emotions, milestones, dreams, peaceful moments, and nostalgic
              stories preserved in a calm visual archive.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/plant"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-violet-400 to-purple-500 px-6 text-sm font-semibold text-white shadow-xl shadow-pink-200 transition hover:scale-[1.03]"
              >
                Plant new memory
                <ArrowRight className="size-4" />
              </Link>

              <Link
                to="/garden"
                className="inline-flex h-12 items-center rounded-full border border-pink-200 bg-white/70 px-6 text-sm font-semibold text-pink-600 backdrop-blur transition hover:bg-white"
              >
                Open garden
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Leaf,
                  title: "Living archive",
                  text: "Every memory becomes part of your personal garden.",
                },
                {
                  icon: Stars,
                  title: "Emotion driven",
                  text: "Different feelings shape different visual moods.",
                },
                {
                  icon: Sparkles,
                  title: "Peaceful experience",
                  text: "Built with smooth motion and calm aesthetics.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-white/70 bg-white/55 p-5 shadow-lg backdrop-blur-md"
                  >
                    <Icon className="size-6 text-pink-500" />

                    <h3 className="mt-4 text-lg font-semibold text-stone-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default GardenHome;