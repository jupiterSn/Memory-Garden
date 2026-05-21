import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  CalendarDays,
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

const emotionOptions: Array<{
  label: string;
  value: MemoryEmotion;
  accent: string;
}> = [
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
    return Array.from(
      { length: currentYear - 1949 },
      (_, index) => String(currentYear - index)
    );
  }, [currentYear]);

  const days = useMemo(() => {
    return Array.from(
      { length: selectedMonthData.days },
      (_, index) => String(index + 1).padStart(2, "0")
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
    <section className="rounded-[32px] bg-gradient-to-br from-pink-50 via-white to-violet-50 p-4">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">

        {/* Left aside */}
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mg-panel overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-pink-100"
        >
          <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-violet-50 p-6">
            <p className="mg-label text-pink-500">Create</p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
              Plant a new memory
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
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
                className="flex gap-3 rounded-2xl border border-pink-100 bg-white p-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-pink-100 to-violet-100 text-sm font-semibold text-pink-600">
                  {step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-zinc-400">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.aside>

        {/* Right form panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mg-panel overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-pink-100"
        >
          <form
            onSubmit={handleSubmit}
            className="grid gap-0 lg:grid-cols-[1fr_0.8fr]"
          >
            <div className="space-y-5 p-6">
              <div>
                <label htmlFor="memory-title" className="mg-label text-zinc-500">
                  Title
                </label>
                <input
                  id="memory-title"
                  type="text"
                  required
                  placeholder="Weekend in Beirut"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mg-input mt-2 border-zinc-200 bg-zinc-50 focus:border-pink-300 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="memory-description" className="mg-label text-zinc-500">
                  Description
                </label>
                <textarea
                  id="memory-description"
                  required
                  placeholder="Describe the details you want future-you to remember..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mg-input mt-2 min-h-40 border-zinc-200 bg-zinc-50 py-3 focus:border-pink-300 focus:bg-white"
                />
              </div>

              <div>
                <p className="mg-label text-zinc-500">Emotion</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-5">
                  {emotionOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setEmotion(option.value)}
                      className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                        emotion === option.value
                          ? "border-pink-200 bg-gradient-to-br from-pink-50 to-violet-50 text-pink-600 shadow-sm"
                          : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-pink-100 hover:bg-pink-50 hover:text-pink-500"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mg-label text-zinc-500">Date</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="mg-input border-zinc-200 bg-zinc-50 focus:border-pink-300"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="mg-input border-zinc-200 bg-zinc-50 focus:border-pink-300"
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="mg-input border-zinc-200 bg-zinc-50 focus:border-pink-300"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="mg-label text-zinc-500">Media</p>
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-5 transition hover:border-pink-300 hover:bg-pink-50">
                  <UploadCloud className="size-6 text-pink-300" />
                  <span className="text-xs text-zinc-400">
                    {mediaFiles.length > 0
                      ? `${mediaFiles.length} file(s) selected`
                      : "Upload photos or videos"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaChange}
                  />
                </label>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-2xl bg-gradient-to-r from-pink-400 via-violet-400 to-purple-500 text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg"
              >
                <Save className="size-4" />
                Plant memory
              </Button>
            </div>

            {/* Preview */}
            <aside className="border-t border-zinc-100 bg-gradient-to-b from-pink-50/60 to-violet-50/60 p-6 lg:border-l lg:border-t-0">
              <div className="mb-4 flex items-center justify-between">
                <p className="mg-label text-zinc-500">Preview</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    selectedEmotion?.accent ?? "bg-pink-50 text-pink-600"
                  }`}
                >
                  {emotion}
                </span>
              </div>

              <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
                <div className="aspect-[16/11] bg-gradient-to-br from-pink-50 to-violet-100">
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
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                    <CalendarDays className="size-3.5 text-pink-400" />
                    {date}
                  </div>

                  <h2 className="text-lg font-semibold text-stone-900">
                    {title || "Untitled memory"}
                  </h2>

                  <p className="text-sm leading-6 text-zinc-500">
                    {description || "Your description will appear here as you write."}
                  </p>

                  <div className="flex items-center gap-2 border-t border-zinc-100 pt-3 text-xs font-medium text-zinc-400">
                    <Sparkles className="size-3.5 text-violet-400" />
                    Ready to grow in your garden
                  </div>
                </div>
              </div>
            </aside>
          </form>
        </motion.div>

      </div>
    </section>
  );
}

export default PlantMemory;