import { CalendarDays, Image, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getMemoryMedia } from "@/lib/memoryMedia";
import type { Memory } from "@/models/memory";

type MemoryDetailModalProps = {
  memory: Memory | null;
  onClose: () => void;
};

function MemoryDetailModal({ memory, onClose }: MemoryDetailModalProps) {
  if (!memory) {
    return null;
  }

  const mediaItems = getMemoryMedia(memory);

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-stone-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-pink-100/70 bg-white/86 shadow-2xl shadow-stone-900/20 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-pink-100/70 p-5">
          <div>
            <p className="mg-label">Memory details</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
              {memory.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {memory.date}
              </span>
              <span className="rounded-full bg-pink-100/80 px-3 py-1 text-xs font-semibold capitalize text-pink-600">
                {memory.emotion}
              </span>
            </div>
          </div>
          <Button type="button" variant="outline" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_0.9fr]">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-500">
              Story
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">
              {memory.description}
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-500">
                Media
              </h3>
              <span className="text-xs font-semibold text-stone-500">
                {mediaItems.length} file{mediaItems.length === 1 ? "" : "s"}
              </span>
            </div>

            {mediaItems.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {mediaItems.map((item) => (
                  <figure
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-pink-100/70 bg-white/60"
                  >
                    <div className="aspect-video bg-zinc-100">
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          controls
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name || memory.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <figcaption className="truncate px-3 py-2 text-xs font-medium text-stone-500">
                      {item.name}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-pink-100 bg-white/50 text-center">
                <div>
                  <Image className="mx-auto size-9 text-stone-300" />
                  <p className="mt-3 text-sm font-semibold text-stone-700">
                    No media attached
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default MemoryDetailModal;
