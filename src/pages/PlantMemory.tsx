import { motion } from "framer-motion";

function PlantMemory() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full rounded-3xl border border-emerald-100 bg-white/80 p-10 shadow-xl backdrop-blur-xl"
      >
        <h1 className="mb-4 text-5xl font-bold text-emerald-900">
          Plant a Memory 🌱
        </h1>

        <p className="text-lg leading-8 text-stone-600">
          Soon, users will be able to add memories,
          emotions, photos, and stories that grow into
          elements inside their personal digital
          garden.
        </p>
      </motion.div>
    </section>
  );
}

export default PlantMemory;