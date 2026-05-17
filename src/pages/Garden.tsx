import type { Memory } from "@/models/memory";

type GardenProps = {
  memories: Memory[];

  deleteMemory: (id: number) => void;
};

function getPlantEmoji(emotion: Memory["emotion"]) {
  if (emotion === "happy") return "🌻";
  if (emotion === "peaceful") return "🌸";
  if (emotion === "nostalgic") return "🍂";
  if (emotion === "dream") return "⭐";
  if (emotion === "milestone") return "🌲";

  return "🌿";
}

function Garden({
  memories,
  deleteMemory,
}: GardenProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-4 text-5xl font-bold text-emerald-900">
        Your Garden 🌸
      </h1>

      <p className="mb-10 text-stone-600">
        Every memory you plant grows here.
      </p>

      {memories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-300 bg-white p-10 text-center">
          <p className="text-5xl">🌱</p>

          <h2 className="mt-4 text-2xl font-semibold text-emerald-900">
            Your garden is empty
          </h2>

          <p className="mt-2 text-stone-500">
            Plant your first memory.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory) => (
            <article
              key={memory.id}
              className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-5xl">
                  {getPlantEmoji(memory.emotion)}
                </span>

                <button
                  onClick={() =>
                    deleteMemory(memory.id)
                  }
                  className="rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
                >
                  Delete
                </button>
              </div>

              {memory.mediaUrl &&
                memory.mediaType === "image" && (
                  <img
                    src={memory.mediaUrl}
                    alt={memory.title}
                    className="mb-4 h-48 w-full rounded-2xl object-cover"
                  />
                )}

              {memory.mediaUrl &&
                memory.mediaType === "video" && (
                  <video
                    src={memory.mediaUrl}
                    controls
                    className="mb-4 h-48 w-full rounded-2xl object-cover"
                  />
                )}

              <h2 className="text-2xl font-bold text-emerald-900">
                {memory.title}
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                {memory.date}
              </p>

              <p className="mt-4 text-stone-600">
                {memory.description}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Garden;