import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  CalendarDays,
  FileVideo,
  ImagePlus,
  Save,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Memory, MemoryEmotion, MemoryMedia } from "@/models/memory";

type PlantMemoryProps = {
  addMemory: (memory: Memory) => void;
};

const emotionOptions: Array<{ label: string; value: MemoryEmotion; accent: string }> = [
  { label: "Happy", value: "happy", accent: "bg-pink-50 text-pink-600" },
  { label: "Peaceful", value: "peaceful", accent: "bg-emerald-50 text-emerald-600" },
  { label: "Nostalgic", value: "nostalgic", accent: "bg-amber-50 text-amber-600" },
  { label: "Dream", value: "dream", accent: "bg-violet-50 text-violet-600" },
  { label: "Milestone", value: "milestone", accent: "bg-rose-50 text-rose-600" },
];

const months = [
  { label: "January", value: "01", days: 31 },
  { label: "February", value: "02", days: 29 },
  { label: "March", value: "03", days: 31 },
  { label: "April", value: "04", days: 30 },
  { label: "May", value: "05", days: 31 },
  { label: "June", value: "06", days: 30 },
  { label: "July", value: "07", days: 31 },
  { label: "August", value: "08", days: 31 },
  { label: "September", value: "09", days: 30 },
  { label: "October", value: "10", days: 31 },
  { label: "November", value: "11", days: 30 },
  { label: "December", value: "12", days: 31 },
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
  const currentYear = new Date().getFullYear();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emotion, setEmotion] = useState<MemoryEmotion>("happy");

  const [selectedDay, setSelectedDay] = useState("01");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState(String(currentYear));

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const selectedEmotion = emotionOptions.find((option) => option.value === emotion);
  const selectedMonthData = months.find((month) => month.value === selectedMonth) ?? months[0];

  const years = useMemo(() => {
    return Array.from({ length: currentYear - 1949 }, (_, index) =>
      String(currentYear - index)
    );
  }, [currentYear]);

  const days = useMemo(() => {
    return Array.from({ length: selectedMonthData.days }, (_, index) =>
      String(index + 1).padStart(2, "0")
    );
  }, [selectedMonthData.days]);

  const date = `${selectedYear}-${selectedMonth}-${selectedDay}`;

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      setMediaFiles([]);
      setPreviewUrls([]);
      return;
    }

    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setMediaFiles(selectedFiles);
    setPreviewUrls(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleMonthChange = (month: string) => {
    const monthData = months.find((item) => item.value === month) ?? months[0];

    setSelectedMonth(month);

    if (Number(selectedDay) > monthData.days) {
      setSelectedDay(String(monthData.days).padStart(2, "0"));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let mediaItems: MemoryMedia[] = [];

    if (mediaFiles.length > 0) {
      try {
        mediaItems = await Promise.all(
          mediaFiles.map(async (file, index) => ({
            id: Date.now() + index,
            url: await readFileAsDataUrl(file),
            type: file.type.startsWith("video") ? "video" : "image",
            name: file.name,
          }))
        );
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
      mediaItems,
      mediaUrl: mediaItems[0]?.url,
      mediaType: mediaItems[0]?.type,
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
    setSelectedDay("01");
    setSelectedMonth("01");
    setSelectedYear(String(currentYear));
    setMediaFiles([]);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <motion.aside
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mg-panel overflow-hidden p-6"
      >
        <div className="rounded-3xl bg-gradient-to-br from-pink-50 via-violet-50 to-white p-6">
          <p className="mg-label">Create</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Plant a new memory
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Add the story, choose the feeling, pick a meaningful date, and attach
            media when the memory needs a visual trace.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {[
            ["1", "Write the story", "Name the memory and describe the moment."],
            ["2", "Choose the feeling", "Connect the memory to an emotion."],
            ["3", "Pick the date", "Select day, month, and year clearly."],
            ["4", "Attach media", "Add photos or videos if available."],
          ].map(([step, label, detail]) => (
            <div
              key={step}
              className="flex gap-3 rounded-2xl border border-pink-100 bg-white/70 p-3 shadow-sm"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-pink-200 to-violet-200 text-sm font-semibold text-pink-700">
                {step}
              </span>

              <div>
                <p className="text-sm font-semibold text-stone-800">{label}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{detail}</p>
              </div>
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
                className="mg-input mt-2 border-pink-100 bg-white/80 focus:border-pink-300"
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
                className="mg-input mt-2 min-h-40 border-pink-100 bg-white/80 py-3 focus:border-pink-300"
              />
            </div>

            <div>
              <p className="mg-label">Emotion</p>

              <div className="mt-2 grid gap-2 sm:grid-cols-5">
                {emotionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setEmotion(option.value)}
                    className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                      emotion === option.value
                        ? "border-pink-300 bg-gradient-to-br from-pink-100 to-violet-100 text-pink-700 shadow-sm"
                        : "border-pink-100 bg-white/70 text-zinc-500 hover:border-pink-200 hover:bg-pink-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="mg-label">Memory date</p>

                <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-500">
                  <CalendarDays className="size-3.5" />
                  {date}
                </span>
              </div>

              <div className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50/80 via-white to-violet-50/70 p-4 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-400">
                      Day
                    </span>
                    <select
                      value={selectedDay}
                      onChange={(event) => setSelectedDay(event.target.value)}
                      className="mt-2 h-12 w-full rounded-2xl border border-pink-100 bg-white/85 px-4 text-sm font-semibold text-stone-700 outline-none transition focus:border-pink-300"
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-400">
                      Month
                    </span>
                    <select
                      value={selectedMonth}
                      onChange={(event) => handleMonthChange(event.target.value)}
                      className="mt-2 h-12 w-full rounded-2xl border border-pink-100 bg-white/85 px-4 text-sm font-semibold text-stone-700 outline-none transition focus:border-pink-300"
                    >
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-400">
                      Year
                    </span>
                    <select
                      value={selectedYear}
                      onChange={(event) => setSelectedYear(event.target.value)}
                      className="mt-2 h-12 w-full rounded-2xl border border-pink-100 bg-white/85 px-4 text-sm font-semibold text-stone-700 outline-none transition focus:border-pink-300"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  This custom picker supports older memories clearly without the
                  plain browser date table.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="memory-media" className="mg-label">
                Media upload
              </label>

              <label
                htmlFor="memory-media"
                className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-pink-200 bg-gradient-to-br from-white via-pink-50/70 to-violet-50/60 px-4 py-8 text-center shadow-sm transition hover:border-pink-300 hover:shadow-md"
              >
                <UploadCloud className="size-8 text-pink-400" />

                <span className="mt-3 text-sm font-semibold text-stone-800">
                  Upload image or video
                </span>

                <span className="mt-1 text-xs text-zinc-500">
                  Photos stay with your saved memories on this browser.
                </span>

                {mediaFiles.length > 0 && (
                  <span className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-pink-500 ring-1 ring-pink-100">
                    {mediaFiles.length} file
                    {mediaFiles.length === 1 ? "" : "s"} selected
                  </span>
                )}
              </label>

              <input
                id="memory-media"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="sr-only"
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl bg-gradient-to-r from-pink-400 via-violet-400 to-purple-500 text-white shadow-lg shadow-pink-200/60 transition hover:scale-[1.01] hover:from-pink-500 hover:via-violet-500 hover:to-purple-600"
            >
              <Save className="size-4" />
              Plant memory
            </Button>
          </div>

          <aside className="border-t border-pink-100 bg-gradient-to-br from-pink-50/70 via-white to-violet-50/70 p-6 lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center justify-between">
              <p className="mg-label">Preview</p>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  selectedEmotion?.accent ?? "bg-pink-50 text-pink-600"
                }`}
              >
                {emotion}
              </span>
            </div>

            <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-xl shadow-pink-100/60">
              <div className="aspect-[16/11] bg-gradient-to-br from-pink-50 to-violet-50">
                {previewUrls.length > 0 ? (
                  mediaFiles[0]?.type.startsWith("video") ? (
                    <video
                      src={previewUrls[0]}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={previewUrls[0]}
                      alt="Selected memory preview"
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImagePlus className="size-12 text-pink-200" />
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4">
                {previewUrls.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {previewUrls.slice(1, 5).map((url, index) => {
                      const file = mediaFiles[index + 1];

                      return (
                        <div
                          key={url}
                          className="relative aspect-square overflow-hidden rounded-xl bg-pink-50"
                        >
                          {file?.type.startsWith("video") ? (
                            <>
                              <video
                                src={url}
                                className="h-full w-full object-cover"
                              />
                              <FileVideo className="absolute left-1 top-1 size-4 text-white drop-shadow" />
                            </>
                          ) : (
                            <img
                              src={url}
                              alt={`Selected media ${index + 2}`}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <CalendarDays className="size-3.5 text-pink-400" />
                  {date}
                </div>

                <h2 className="text-lg font-semibold text-stone-900">
                  {title || "Untitled memory"}
                </h2>

                <p className="text-sm leading-6 text-zinc-600">
                  {description || "Your description will appear here as you write."}
                </p>

                <div className="flex items-center gap-2 border-t border-pink-100 pt-3 text-xs font-medium text-zinc-500">
                  <Sparkles className="size-3.5 text-violet-400" />
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