import type { Memory } from "@/models/memory";

export function memoryMatchesQuery(memory: Memory, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = [
    memory.title,
    memory.description,
    memory.emotion,
    memory.date,
    ...(memory.mediaItems?.map((item) => item.name) ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function filterMemories(memories: Memory[], query: string) {
  return memories.filter((memory) => memoryMatchesQuery(memory, query));
}
