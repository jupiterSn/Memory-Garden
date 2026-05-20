import { useState, type ChangeEvent, type FormEvent } from "react";
import { CalendarDays, FileVideo, ImagePlus, Save, Sparkles, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Memory, MemoryEmotion } from "@/models/memory";

type PlantMemoryProps = {
  addMemory: (memory: Memory) => void;
};

const emotionOptions: Array<{ label: string; value: MemoryEmotion }> = [
  { label: "Happy", value: "happy" },
  { label: "Peaceful", value: "peaceful" },
  { label: "Nostalgic", value: "nostalgic" },
  { label: "Dream", value: "dream" },
  { label: "Milestone", value: "milestone" },
];

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function PlantMemory({ addMemory }: PlantMemoryProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emotion, setEmotion] = useState<MemoryEmotion>("happy");
  const [date, setDate] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setMedia(null);
      setPreviewUrl("");
      return;
    }

    setMedia(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let persistentMediaUrl = "";

    if (media) {
      try {
        persistentMediaUrl = await readFileAsDataUrl(media);
      } catch (error) {
        console.error(error);
        toast.error("The media could not be saved");
        return;
      }
    }

    const newMemory: Memory = {
      id: Date.now(),
      title,
      description,
      emotion,
      date,
      mediaUrl: persistentMediaUrl || undefined,
      mediaType: media?.type.startsWith("video")
        ? "video"
        : media
          ? "image"
          : undefined,
    };

    try {
      addMemory(newMemory);
      toast.success("Memory planted", {
        description: "Your garden has grown a little more.",
      });
    } catch (error) {
      console.error(error);
      toast.error("This file is too large to keep in the browser", {
        description: "Try a smaller image for now.",
      });
      return;
    }

    setTitle("");
    setDescription("");
    setEmotion("happy");
    setDate("");
    setMedia(null);
    setPreviewUrl("");
  };

  const isVideo = media?.type.startsWith("video");

  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <motion.aside
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mg-panel p-6"
      >
        <p className="mg-label">Create</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Plant a new memory
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Add the core story, choose the feeling it carries, and attach a photo
          or video when the moment needs one.
        </p>

        <div className="mt-8 grid gap-3">
          {[
            ["1", "Write the story"],
            ["2", "Tag the emotion"],
            ["3", "Attach image or video"],
          ].map(([step, label]) => (
            <div key={step} className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
              <span className="grid size-8 place-items-center rounded-md bg-pink-100 text-sm font-semibold text-pink-500">
                {step}
              </span>
              <span className="text-sm font-medium text-zinc-700">{label}</span>
            </div>
          ))}
        </div>
      </motion.aside>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mg-panel overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="grid gap-0 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-5 p-6">
            <div>
              <label htmlFor="memory-title" className="mg-label">
                Title
              </label>
              <input
                id="memory-title"
                type="text"
                required
                placeholder="Weekend in Beirut"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mg-input mt-2"
              />
            </div>

            <div>
              <label htmlFor="memory-description" className="mg-label">
                Description
              </label>
              <textarea
                id="memory-description"
                required
                placeholder="Describe the details you want future-you to remember..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mg-input mt-2 min-h-40 py-3"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="memory-emotion" className="mg-label">
                  Emotion
                </label>
                <select
                  id="memory-emotion"
                  value={emotion}
                  onChange={(event) => setEmotion(event.target.value as MemoryEmotion)}
                  className="mg-select mt-2"
                >
                  {emotionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="memory-date" className="mg-label">
                  Date
                </label>
                <input
                  id="memory-date"
                  type="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mg-date mt-2"
                />
              </div>
            </div>

            <div>
              <label htmlFor="memory-media" className="mg-label">
                Media upload
              </label>
              <label
                htmlFor="memory-media"
                className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50"
              >
                <UploadCloud className="size-8 text-zinc-400" />
                <span className="mt-3 text-sm font-semibold text-zinc-800">
                  Upload image or video
                </span>
                <span className="mt-1 text-xs text-zinc-500">
                  Photos stay with your saved memories on this browser.
                </span>
              </label>
              <input
                id="memory-media"
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="sr-only"
              />
            </div>

            <Button type="submit" className="h-11 w-full rounded-xl bg-pink-500 text-white hover:bg-pink-500">
              <Save className="size-4" />
              Plant memory
            </Button>
          </div>

          <aside className="border-t border-zinc-200 bg-zinc-50 p-6 lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center justify-between">
              <p className="mg-label">Preview</p>
              <span className="rounded-md bg-white px-2 py-1 text-xs font-medium capitalize text-zinc-600 ring-1 ring-zinc-200">
                {emotion}
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              <div className="aspect-[16/11] bg-zinc-100">
                {previewUrl ? (
                  isVideo ? (
                    <video src={previewUrl} controls className="h-full w-full object-cover" />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Selected memory preview"
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center">
                    {isVideo ? (
                      <FileVideo className="size-10 text-zinc-300" />
                    ) : (
                      <ImagePlus className="size-10 text-zinc-300" />
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <CalendarDays className="size-3.5" />
                  {date || "Memory date"}
                </div>
                <h2 className="text-lg font-semibold text-stone-900">
                  {title || "Untitled memory"}
                </h2>
                <p className="text-sm leading-6 text-zinc-600">
                  {description || "Your description will appear here as you write."}
                </p>
                <div className="flex items-center gap-2 border-t border-zinc-100 pt-3 text-xs font-medium text-zinc-500">
                  <Sparkles className="size-3.5" />
                  Ready to grow in your garden
                </div>
              </div>
            </div>
          </aside>
        </form>
      </motion.div>
    </section>
  );
}

export default PlantMemory;
