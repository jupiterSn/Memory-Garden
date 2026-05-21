import { CalendarDays, Image, Play, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getMemoryMedia } from "@/lib/memoryMedia";
import type { Memory } from "@/models/memory";

type MemoryCardProps = {
  memory: Memory;
  onDelete?: (id: number) => void;
  onOpen?: (memory: Memory) => void;
};

const emotionStyles: Record<Memory["emotion"], string> = {
  happy: "bg-amber-100 text-amber-800",
  peaceful: "bg-cyan-100 text-cyan-800",
  nostalgic: "bg-pink-100 text-pink-600",
  dream: "bg-violet-100 text-violet-800",
  milestone: "bg-emerald-100 text-emerald-800",
};

function MemoryCard({ memory, onDelete, onOpen }: MemoryCardProps) {
  const mediaItems = getMemoryMedia(memory);
  const coverMedia = mediaItems[0];
  const hasVideo = mediaItems.some((item) => item.type === "video");
  const openMemory = () => onOpen?.(memory);

  return (
    <article
      className={`mg-panel overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md ${
        onOpen ? "cursor-pointer" : ""
      }`}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={openMemory}
      onKeyDown={(event) => {
        if (onOpen && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          openMemory();
        }
      }}
    >
      <div className="relative aspect-[16/10] bg-zinc-100">
        {coverMedia?.type === "image" && (
          <img
            src={coverMedia.url}
            alt={memory.title}
            className="h-full w-full object-cover"
          />
        )}

        {coverMedia?.type === "video" && (
          <video
            src={coverMedia.url}
            controls
            className="h-full w-full object-cover"
          />
        )}

        {!coverMedia && (
          <div className="flex h-full items-center justify-center">
            <Image className="size-10 text-zinc-300" />
          </div>
        )}

        <span
          className={`absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-semibold capitalize ${emotionStyles[memory.emotion]}`}
        >
          {memory.emotion}
        </span>

        {mediaItems.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-stone-700 shadow-sm">
            {mediaItems.length} files
          </span>
        )}

        {hasVideo && (
          <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-pink-500/85 text-white">
            <Play className="size-4" />
          </span>
        )}
      </div>

      <div className="space-y-4 p-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-500">
            <CalendarDays className="size-3.5" />
            {memory.date}
          </div>
          <h2 className="line-clamp-1 text-base font-semibold text-stone-900">
            {memory.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
            {memory.description}
          </p>
        </div>

        {onDelete && (
          <div className="flex justify-end border-t border-zinc-100 pt-3">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(memory.id);
              }}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}

export default MemoryCard;
