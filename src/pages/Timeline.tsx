import type { Memory } from "@/models/memory";

type TimelineProps = {
  memories: Memory[];
};

function Timeline({ memories }: TimelineProps) {
  const sortedMemories = [...memories].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-4 text-5xl font-bold text-emerald-900">
        Memory Timeline 📖
      </h1>

      <p className="mb-10 text-stone-600">
        View your planted memories from newest to oldest.
      </p>

      {sortedMemories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-300 bg-white p-10 text-center">
          <p className="text-5xl">📖</p>
          <h2 className="mt-4 text-2xl font-semibold text-emerald-900">
            No memories yet
          </h2>
          <p className="mt-2 text-stone-500">
            Plant a memory first to build your timeline.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedMemories.map((memory) => (
            <article
              key={memory.id}
              className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg"
            >
              <p className="text-sm font-medium text-emerald-700">
                {memory.date}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-emerald-900">
                {memory.title}
              </h2>

              <p className="mt-3 text-stone-600">
                {memory.description}
              </p>

              <p className="mt-4 text-sm text-stone-500">
                Emotion: {memory.emotion}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Timeline;