import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

function Home() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <h1 className="mb-6 text-6xl font-bold tracking-tight text-emerald-900">
          Memory Garden 🌿
        </h1>

        <p className="mb-8 text-lg leading-8 text-stone-600">
          Instead of collecting memories in folders, grow them into a living
          digital garden.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button
            asChild
            className="rounded-2xl bg-emerald-700 px-8 py-6 text-lg hover:bg-emerald-800"
          >
            <Link to="/plant">Plant a Memory</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-2xl px-8 py-6 text-lg"
          >
            <Link to="/garden">Explore Garden</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

export default Home;