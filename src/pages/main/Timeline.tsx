import { Link } from "react-router-dom";
import { CalendarClock, Plus } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import type { Memory } from "@/models/memory";

type TimelineProps = {
  memories: Memory[];
};

function Timeline({ memories }: TimelineProps) {
  const sortedMemories = [...memories].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <section className="space-y-6">
      <div className="mg-panel p-6">
        <p className="mg-label">Chronology</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Memory timeline
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          Review planted memories from newest to oldest with their emotional
          context preserved.
        </p>
      </div>

      {sortedMemories.length === 0 ? (
        <div className="mg-panel p-10 text-center">
          <CalendarClock className="mx-auto size-10 text-zinc-300" />
          <h2 className="mt-4 text-xl font-semibold text-stone-900">
            No timeline entries yet
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Plant a memory first to build your history.
          </p>
          <Button asChild className="mt-5 h-10 rounded-xl bg-pink-500 text-white hover:bg-pink-500">
            <Link to="/plant">
              <Plus className="size-4" />
              Plant memory
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mg-panel p-6">
          <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-zinc-200">
            {sortedMemories.map((memory, index) => (
              <motion.article
                key={memory.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="relative grid gap-3 pl-11 md:grid-cols-[180px_1fr]"
              >
                <span className="absolute left-0 top-1 grid size-8 place-items-center rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-600">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{memory.date}</p>
                  <p className="mt-1 text-xs font-medium capitalize text-zinc-500">
                    {memory.emotion}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <h2 className="text-base font-semibold text-stone-900">
                    {memory.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {memory.description}
                  </p>
                  {(memory.mediaItems?.length ?? (memory.mediaUrl ? 1 : 0)) > 0 && (
                    <p className="mt-3 text-xs font-semibold text-pink-500">
                      {memory.mediaItems?.length ?? 1} media file
                      {(memory.mediaItems?.length ?? 1) === 1 ? "" : "s"} attached
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Timeline;
