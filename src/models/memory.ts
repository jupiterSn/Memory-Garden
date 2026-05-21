export type MemoryEmotion =
  | "happy"
  | "peaceful"
  | "nostalgic"
  | "dream"
  | "milestone";

export type MemoryMedia = {
  id: number;
  url: string;
  type: "image" | "video";
  name: string;
};

export type Memory = {
  id: number;
  title: string;
  description: string;
  emotion: MemoryEmotion;
  date: string;
  mediaItems?: MemoryMedia[];
  mediaUrl?: string;
  mediaType?: "image" | "video";
};
