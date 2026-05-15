import { motion } from "framer-motion";

function Timeline() {
  const memories = [
    {
      year: "2024",
      title: "Beach Sunset",
      emoji: "🌅",
    },
    {
      year: "2025",
      title: "Japan Trip",
      emoji: "🌸",
    },
    {
      year: "2026",
      title: "Graduation",
      emoji: "🎓",
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="mb-10 text-5xl font-bold text-emerald-900">
          Memory Timeline 📖
        </h1>

        <div className="space-y-6">
          {memories.map((memory) => (
            <div
              key={memory.title}
              className="flex items-center gap-6 rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-lg"
            >
              <div className="text-5xl">
                {memory.emoji}
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-stone-800">
                  {memory.title}
                </h2>

                <p className="text-stone-500">
                  {memory.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Timeline;