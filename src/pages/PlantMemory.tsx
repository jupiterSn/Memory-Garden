import { useState } from "react";

import type { Memory, MemoryEmotion } from "@/models/memory";

type PlantMemoryProps = {
  addMemory: (memory: Memory) => void;
};

function PlantMemory({ addMemory }: PlantMemoryProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emotion, setEmotion] = useState<MemoryEmotion>("happy");
  const [date, setDate] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleMediaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setMedia(null);
      setPreviewUrl("");
      return;
    }

    setMedia(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const newMemory: Memory = {
      id: Date.now(),
      title,
      description,
      emotion,
      date,
      mediaUrl: previewUrl || undefined,
      mediaType: media?.type.startsWith("video")
        ? "video"
        : media
          ? "image"
          : undefined,
    };

    addMemory(newMemory);

    setTitle("");
    setDescription("");
    setEmotion("happy");
    setDate("");
    setMedia(null);
    setPreviewUrl("");
  };

  const isVideo = media?.type.startsWith("video");

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center px-6">
      <div className="w-full rounded-3xl border border-emerald-100 bg-white p-10 shadow-xl">
        <h1 className="mb-2 text-5xl font-bold text-emerald-900">
          Plant a Memory 🌱
        </h1>

        <p className="mb-8 text-stone-500">
          Add the story first. A photo or video is optional.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            required
            placeholder="Memory title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-emerald-200 px-4 py-3"
          />

          <textarea
            required
            placeholder="Describe your memory..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[140px] w-full rounded-2xl border border-emerald-200 px-4 py-3"
          />

          <select
            value={emotion}
            onChange={(e) =>
              setEmotion(e.target.value as MemoryEmotion)
            }
            className="w-full rounded-2xl border border-emerald-200 px-4 py-3"
          >
            <option value="happy">🌻 Happy</option>
            <option value="peaceful">🌸 Peaceful</option>
            <option value="nostalgic">🍂 Nostalgic</option>
            <option value="dream">⭐ Dream</option>
            <option value="milestone">🌲 Milestone</option>
          </select>

          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-emerald-200 px-4 py-3"
          />

          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="w-full rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-4"
          />

          {previewUrl && (
            <div className="rounded-3xl bg-emerald-50 p-4">
              {isVideo ? (
                <video
                  src={previewUrl}
                  controls
                  className="max-h-72 w-full rounded-2xl object-cover"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Selected memory preview"
                  className="max-h-72 w-full rounded-2xl object-cover"
                />
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-700 px-6 py-4 text-lg font-semibold text-white"
          >
            Plant Memory
          </button>
        </form>
      </div>
    </section>
  );
}

export default PlantMemory;