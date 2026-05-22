import { useState, type FormEvent } from "react";
import { CalendarDays, Edit3, Save, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getMemoryMedia } from "@/lib/memoryMedia";
import type { Memory, MemoryEmotion } from "@/models/memory";

type MemoryDetailModalProps = {
  memory: Memory | null;
  onClose: () => void;
  onUpdate?: (memory: Memory) => void;
};

function MemoryDetailModal({
  memory,
  onClose,
  onUpdate,
}: MemoryDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!memory) return null;

  const mediaItems = getMemoryMedia(memory);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const emotion = String(formData.get("emotion") ?? "") as MemoryEmotion;
    const date = String(formData.get("date") ?? "").trim();

    if (!title || !description || !date) {
      toast.error("Please fill all fields before saving");
      return;
    }

    const updatedMemory: Memory = {
      ...memory,
      title,
      description,
      emotion,
      date,
    };

    onUpdate?.(updatedMemory);
    setIsEditing(false);
    toast.success("Memory updated successfully");
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-pink-100 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="w-full">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-400">
              Memory details
            </p>

            <h2 className="mt-2 text-2xl font-bold text-stone-800">
              {isEditing ? "Edit memory" : memory.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-stone-100 p-2 text-stone-500 transition hover:bg-pink-100 hover:text-pink-500"
          >
            <X size={20} />
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Title
              </label>
              <input
                name="title"
                defaultValue={memory.title}
                className="w-full rounded-2xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-stone-800 outline-none focus:border-pink-300"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  defaultValue={memory.date}
                  className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-stone-700 outline-none focus:border-pink-300"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Emotion
                </label>
                <select
                  name="emotion"
                  defaultValue={memory.emotion}
                  className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-stone-700 outline-none focus:border-pink-300"
                >
                  <option value="happy">Happy</option>
                  <option value="peaceful">Peaceful</option>
                  <option value="nostalgic">Nostalgic</option>
                  <option value="milestone">Milestone</option>
                  <option value="dream">Dream</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Story
              </label>
              <textarea
                name="description"
                defaultValue={memory.description}
                rows={5}
                className="w-full resize-none rounded-2xl border border-pink-100 bg-pink-50/50 px-4 py-3 text-stone-700 outline-none focus:border-pink-300"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>

              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-emerald-700">
                <CalendarDays size={16} />
                {memory.date}
              </span>

              <span className="rounded-full bg-pink-50 px-4 py-2 capitalize text-pink-600">
                {memory.emotion}
              </span>
            </div>

            <div className="mb-5">
              <h3 className="mb-2 font-semibold text-stone-700">Story</h3>
              <p className="leading-7 text-stone-600">{memory.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-stone-700">Media</h3>

              {mediaItems.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-pink-100 bg-pink-50"
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          controls
                          className="h-40 w-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="h-40 w-full object-cover"
                        />
                      )}

                      <p className="px-3 py-2 text-sm text-stone-600">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-500">
                  No media attached
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={() => setIsEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit memory
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default MemoryDetailModal;
