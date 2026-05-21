import type { Memory, MemoryMedia } from "@/models/memory";

export function getMemoryMedia(memory: Memory): MemoryMedia[] {
  return (
    memory.mediaItems ??
    (memory.mediaUrl && memory.mediaType
      ? [
          {
            id: memory.id,
            url: memory.mediaUrl,
            type: memory.mediaType,
            name: memory.title,
          },
        ]
      : [])
  );
}
