import type { Memory, MemoryMedia } from "@/models/memory";

export function getMemoryMedia(memory: Memory): MemoryMedia[] {
  if (memory.mediaItems && memory.mediaItems.length > 0) {
    return memory.mediaItems;
  }

  if (memory.mediaUrl && memory.mediaType) {
    return [
      {
        id: memory.id,
        url: memory.mediaUrl,
        type: memory.mediaType,
        name: memory.title,
      },
    ];
  }

  return [];
}