import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flower2, Leaf, Lock, Sparkles, Stars } from "lucide-react";

import sakuraHero from "@/assets/sakura-hero.png";
import cherrySky from "@/assets/cherry-blossom-tree.jpg";
import sakuraArt from "@/assets/sakura-art.jpg";
import sakuraLake from "@/assets/sakura-lake.jpg";
import flowerLayer from "@/assets/minimalist-flower-illustration.jpg";
import wisteriaTree from "@/assets/wisteria-auth.png";

const fadeUp = {
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0 },
};

const softTransition = {
  duration: 0.75,
  ease: [0.16, 1, 0.3, 1],
} as const;

function SakuraPetals() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 22 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute top-[-40px] h-4 w-3 rounded-full bg-pink-300/70 shadow-sm"
          style={{
            left: `${(index * 47) % 100}%`,
            borderRadius: "70% 30% 70% 30%",
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, index % 2 === 0 ? 55 : -55, 0],
            rotate: [0, 120, 260],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: 11 + (index % 5),
            repeat: Infinity,
            delay: index * 0.45,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function Home() {
  return (
    <main className="overflow-hidden bg-[#fff7fb] text-stone-900">
      <section className="relative min-h-screen overflow-hidden">
        <motion.img
          src={sakuraHero}
          alt="Sakura garden path"
          className="absolute inset-0 h-full w-full object-cover"
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-pink-50/25 to-[#fff7fb]" />

        <motion.img
          src={flowerLayer}
          alt="Floating blossoms"
          className="pointer-events-none absolute right-[-4rem] top-[-2rem] h-[75vh] opacity-65 mix-blend-multiply"
          animate={{ y: [0, 18, 0], rotate: [0, 1.5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <SakuraPetals />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={softTransition}
          className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-500">
            Memory Garden
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-stone-900 md:text-7xl">
            A living digital garden for your memories.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-stone-600">
            Plant personal memories, connect them with emotions, and watch them
            become a calm visual archive inspired by flowers, trees, stars, and
            peaceful nature.
          </p>
        </motion.div>
      </section>

      <section className="relative min-h-screen overflow-hidden">
        <img
          src={cherrySky}
          alt="Cherry blossom sky"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-white/35" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={softTransition}
            viewport={{ once: false, amount: 0.35 }}
            className="max-w-xl rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-2xl backdrop-blur-xl"
          >
            <Flower2 className="size-10 text-pink-500" />

            <h2 className="mt-5 text-4xl font-semibold tracking-tight">
              What is Memory Garden?
            </h2>

            <p className="mt-5 leading-8 text-stone-600">
              Memory Garden is a frontend web application where users create a
              private archive of memories. Each memory can include a title,
              description, date, emotion, and optional media.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative min-h-screen overflow-hidden">
        <img
          src={wisteriaTree}
          alt="Wisteria tree"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-purple-950/25" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-end px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={softTransition}
            viewport={{ once: false, amount: 0.35 }}
            className="max-w-xl rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-2xl backdrop-blur-xl"
          >
            <Sparkles className="size-10 text-violet-500" />

            <h2 className="mt-5 text-4xl font-semibold tracking-tight">
              Memories become a visual garden.
            </h2>

            <p className="mt-5 leading-8 text-stone-600">
              Happy memories feel like flowers, peaceful moments like gardens,
              milestones like trees, dreams like stars, and nostalgic moments
              like soft sakura scenes.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative min-h-screen overflow-hidden">
        <img
          src={sakuraArt}
          alt="Sakura art"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-white/45" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={softTransition}
            viewport={{ once: false, amount: 0.35 }}
            className="max-w-xl rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur-xl"
          >
            <Leaf className="size-10 text-emerald-500" />

            <h2 className="mt-5 text-4xl font-semibold tracking-tight">
              Built as a frontend-only project.
            </h2>

            <p className="mt-5 leading-8 text-stone-600">
              This version uses mock authentication and browser localStorage to
              simulate saved users and memories, making it suitable for a
              frontend-focused software engineering presentation.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative min-h-screen overflow-hidden">
        <img
          src={sakuraLake}
          alt="Sakura lake"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-white/40" />

        <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-6 px-6 md:grid-cols-3">
          {[
            {
              icon: Lock,
              title: "Private memories",
              text: "Each user has their own local memory collection, protected through the frontend authentication flow.",
            },
            {
              icon: Stars,
              title: "Timeline and garden",
              text: "Users can review memories through cards, a chronological timeline, and a visual garden-style interface.",
            },
            {
              icon: Sparkles,
              title: "Polished experience",
              text: "The project uses React, TypeScript, routing, protected pages, layouts, localStorage, Tailwind CSS, and Framer Motion.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                transition={{ ...softTransition, delay: index * 0.12 }}
                viewport={{ once: false, amount: 0.3 }}
                className="rounded-[2rem] border border-white/70 bg-white/80 p-7 shadow-xl backdrop-blur-xl"
              >
                <Icon className="size-9 text-pink-500" />
                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-600">
                  {item.text}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-br from-pink-100 via-violet-100 to-purple-100 px-6 py-24 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={softTransition}
          viewport={{ once: false, amount: 0.35 }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="text-4xl font-semibold tracking-tight">
            Ready to enter your Memory Garden?
          </h2>

          <p className="mt-5 leading-8 text-stone-600">
            Create an account, plant memories, view your garden, explore the
            timeline, and manage your personal archive through a calm and
            nature-inspired interface.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-violet-400 to-purple-500 px-6 text-sm font-semibold text-white shadow-lg shadow-pink-200 transition hover:scale-[1.03]"
            >
              Start planting
              <ArrowRight className="size-4" />
            </Link>

            <Link
              to="/login"
              className="inline-flex h-12 items-center rounded-full border border-pink-200 bg-white/70 px-6 text-sm font-semibold text-pink-600 backdrop-blur transition hover:bg-white"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default Home;