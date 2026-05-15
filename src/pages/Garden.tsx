import { motion } from "framer-motion";

function Garden() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <h1 className="mb-6 text-6xl font-bold text-emerald-900">
          Your Garden 🌸
        </h1>

        <p className="mb-10 text-lg leading-8 text-stone-600">
          Memories will bloom here as flowers,
          trees, stars, and seasonal elements based
          on their emotional meaning.
        </p>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="rounded-3xl bg-pink-100 p-8 text-5xl shadow-lg">
            🌸
          </div>

          <div className="rounded-3xl bg-yellow-100 p-8 text-5xl shadow-lg">
            🌻
          </div>

          <div className="rounded-3xl bg-emerald-100 p-8 text-5xl shadow-lg">
            🌲
          </div>

          <div className="rounded-3xl bg-orange-100 p-8 text-5xl shadow-lg">
            🍂
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Garden;