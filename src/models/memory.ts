export type MemoryEmotion =
  | "happy"
  | "peaceful"
  | "nostalgic"
  | "dream"
  | "milestone";

export type Memory = {
  id: number;
  title: string;
  description: string;
  emotion: MemoryEmotion;
  date: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
};