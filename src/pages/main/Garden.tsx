import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Shovel, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import MemoryDetailModal from "@/components/MemoryDetailModal";
import { Button } from "@/components/ui/button";
import gardenBed from "@/assets/garden-bed.png";
import { getMemoryMedia } from "@/lib/memoryMedia";
import type { Memory } from "@/models/memory";

type GardenProps = {
  memories: Memory[];
  deleteMemory: (id: number) => void;
};

const plantPositions = [
  "left-[8%] top-[34%]",
  "left-[24%] top-[25%]",
  "left-[41%] top-[38%]",
  "left-[61%] top-[27%]",
  "left-[78%] top-[37%]",
  "left-[18%] top-[52%]",
  "left-[50%] top-[54%]",
  "left-[72%] top-[55%]",
];

function PlantVisual({ memory }: { memory: Memory }) {
  const mediaItems = getMemoryMedia(memory);
  const imageMedia = mediaItems.find((item) => item.type === "image");
  const imageBloom =
    imageMedia ? (
      <div className="absolute left-1/2 top-1 z-20 size-14 -translate-x-1/2 overflow-hidden rounded-full border-4 border-white/80 shadow-lg shadow-pink-100">
        <img
          src={imageMedia.url}
          alt={memory.title}
          className="h-full w-full object-cover"
        />
      </div>
    ) : null;

  if (memory.emotion === "happy") {
    return (
      <div className="relative h-28 w-28 drop-shadow-sm">
        <div className="absolute bottom-3 left-1/2 h-16 w-2.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-700" />
        <div className="absolute bottom-11 left-6 h-8 w-12 -rotate-[28deg] rounded-[80%_18%_70%_30%] bg-gradient-to-br from-emerald-200 to-emerald-500" />
        <div className="absolute bottom-10 right-6 h-8 w-12 rotate-[22deg] rounded-[18%_80%_30%_70%] bg-gradient-to-bl from-lime-200 to-emerald-500" />
        <div className="absolute left-1/2 top-4 grid size-16 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-amber-100 via-amber-300 to-orange-400 shadow-lg shadow-amber-100">
          <div className="size-7 rounded-full bg-gradient-to-br from-orange-300 to-amber-700" />
        </div>
        {imageBloom}
      </div>
    );
  }

  if (memory.emotion === "peaceful") {
    return (
      <div className="relative h-28 w-28 drop-shadow-sm">
        <div className="absolute bottom-3 left-1/2 h-16 w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-300 to-emerald-700" />
        <div className="absolute left-4 top-8 size-12 rounded-[60%_40%_55%_45%] bg-gradient-to-br from-cyan-50 to-sky-200 shadow-lg shadow-sky-100" />
        <div className="absolute right-5 top-10 size-12 rounded-[42%_58%_44%_56%] bg-gradient-to-br from-white to-cyan-200 shadow-lg shadow-cyan-100" />
        <div className="absolute left-9 top-5 size-10 rounded-[65%_35%_55%_45%] bg-gradient-to-br from-pink-50 to-pink-200" />
        {imageBloom}
      </div>
    );
  }

  if (memory.emotion === "nostalgic") {
    return (
      <div className="relative h-30 w-28 drop-shadow-sm">
        <div className="absolute bottom-2 left-1/2 h-20 w-3.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-900 via-amber-700 to-amber-500" />
        <div className="absolute left-1 top-9 h-14 w-24 rounded-[58%_42%_61%_39%] bg-gradient-to-br from-orange-100 via-orange-200 to-amber-400 shadow-lg shadow-orange-100" />
        <div className="absolute left-9 top-3 h-14 w-16 rounded-[50%_50%_43%_57%] bg-gradient-to-br from-pink-100 to-orange-300" />
        <div className="absolute right-0 top-11 h-12 w-16 rounded-[46%_54%_58%_42%] bg-gradient-to-br from-amber-100 to-yellow-400" />
        {imageBloom}
      </div>
    );
  }

  if (memory.emotion === "dream") {
    return (
      <div className="relative h-28 w-28 drop-shadow-sm">
        <div className="absolute bottom-3 left-1/2 h-16 w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-300 to-teal-700" />
        <div className="absolute bottom-11 left-4 h-9 w-14 -rotate-12 rounded-[70%_30%_72%_28%] bg-gradient-to-br from-violet-100 to-violet-300 shadow-lg shadow-violet-100" />
        <div className="absolute bottom-13 right-4 h-9 w-14 rotate-12 rounded-[30%_70%_28%_72%] bg-gradient-to-bl from-pink-100 to-fuchsia-300 shadow-lg shadow-pink-100" />
        <div className="absolute left-1/2 top-5 size-12 -translate-x-1/2 rotate-45 rounded-[42%_58%_40%_60%] bg-gradient-to-br from-fuchsia-100 to-purple-300" />
        {imageBloom}
      </div>
    );
  }

  return (
    <div className="relative h-32 w-28 drop-shadow-sm">
      <div className="absolute bottom-2 left-1/2 h-24 w-4 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-900 via-amber-700 to-amber-500" />
      <div className="absolute left-4 top-3 size-16 rounded-[48%_52%_45%_55%] bg-gradient-to-br from-emerald-100 to-emerald-500 shadow-lg shadow-emerald-100" />
      <div className="absolute right-1 top-10 size-14 rounded-[58%_42%_60%_40%] bg-gradient-to-br from-lime-100 to-emerald-600 shadow-lg shadow-emerald-100" />
      <div className="absolute left-0 top-14 size-14 rounded-[42%_58%_44%_56%] bg-gradient-to-br from-green-100 to-emerald-400" />
      {imageBloom}
    </div>
  );
}

function Garden({ memories, deleteMemory }: GardenProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const handleDelete = (id: number) => {
    const targetMemory = memories.find((memory) => memory.id === id);
    const title = targetMemory?.title ?? "this memory";

    const confirmationToast = toast.warning("Remove this memory?", {
      description: `"${title}" will be removed from your garden.`,
      duration: 10000,
      action: {
        label: "Remove",
        onClick: () => {
          deleteMemory(id);
          toast.dismiss(confirmationToast);
          toast.success("Memory gently removed from the garden");
          setSelectedMemory((currentMemory) =>
            currentMemory?.id === id ? null : currentMemory
          );
        },
      },
      cancel: {
        label: "Keep",
        onClick: () => toast.dismiss(confirmationToast),
      },
      actionButtonStyle: {
        background: "#dc2626",
        color: "#fff",
      },
    });
  };

  return (
    <section className="space-y-6">
      <div className="mg-panel p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mg-label">Living collection</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
              Your planted garden
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              Every memory now grows as a plant in the garden. The plant style
              changes with the emotion you choose when planting.
            </p>
          </div>

          <Button asChild className="garden-button h-10 px-4">
            <Link to="/plant">
              <Plus className="size-4" />
              Plant memory
            </Link>
          </Button>
        </div>

        <div className="mt-6 flex h-11 items-center gap-2 rounded-xl border border-pink-100 bg-white/75 px-3 text-sm text-stone-500">
          <Search className="size-4" />
          <span>Find a memory by title, feeling, or season.</span>
        </div>
      </div>

      {memories.length === 0 ? (
        <div className="mg-panel p-10 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-pink-100 text-pink-500">
            <Shovel className="size-7" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-stone-900">
            Your soil is waiting
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
            Plant your first memory and it will appear here as a living plant,
            not just a card.
          </p>
          <Button asChild className="garden-button mt-5 h-10 px-4">
            <Link to="/plant">Plant first memory</Link>
          </Button>
        </div>
      ) : (
        <div className="mg-panel overflow-hidden">
          <div className="relative min-h-[620px] overflow-hidden bg-stone-100">
            <img
              src={gardenBed}
              alt="Peaceful garden bed"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,251,0.22)_0%,rgba(255,255,255,0.02)_45%,rgba(73,92,57,0.08)_100%)]" />

            {memories.map((memory, index) => (
              <motion.article
                key={memory.id}
                initial={{ opacity: 0, scale: 0.8, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`group absolute ${plantPositions[index % plantPositions.length]} -translate-x-1/2`}
              >
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedMemory(memory)}
                    className="transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-pink-100/70"
                    title="Open this memory"
                  >
                    <PlantVisual memory={memory} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMemory(memory)}
                    className="mt-2 max-w-40 rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-center text-xs font-semibold text-stone-700 shadow-sm shadow-emerald-100 backdrop-blur transition hover:bg-pink-50 hover:text-pink-500"
                    title="Open this memory"
                  >
                    <span className="block truncate">{memory.title}</span>
                    <span className="mt-0.5 block text-[10px] font-medium capitalize text-stone-500">
                      {memory.emotion}
                    </span>
                  </button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-2 bg-white/80"
                    onClick={() => handleDelete(memory.id)}
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}

      <MemoryDetailModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />
    </section>
  );
}

export default Garden;
