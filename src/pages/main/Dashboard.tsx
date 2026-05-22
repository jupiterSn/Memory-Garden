import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Image,
  Leaf,
  PlayCircle,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

import MemoryDetailModal from "@/components/MemoryDetailModal";
import MemoryCard from "@/components/MemoryCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getMemoryMedia } from "@/lib/memoryMedia";
import { filterMemories } from "@/lib/memorySearch";
import type { Memory } from "@/models/memory";

import frierenGroupGrass from "@/assets/frieren-group-grass.jpg";

type DashboardProps = {
  memories: Memory[];
  updateMemory: (memory: Memory) => void;
};

type MemoryRow = {
  id: number;
  title: string;
  emotion: string;
  date: string;
  media: string;
};

function Dashboard({ memories, updateMemory }: DashboardProps) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const searchQuery = searchParams.get("q") ?? "";
  const visibleMemories = useMemo(
    () => filterMemories(memories, searchQuery),
    [memories, searchQuery]
  );

  const stats = useMemo(() => {
    const mediaItems = memories.flatMap((memory) => getMemoryMedia(memory));

    const withMedia = memories.filter(
      (memory) => (memory.mediaItems?.length ?? (memory.mediaUrl ? 1 : 0)) > 0
    ).length;

    const videos = mediaItems.filter((item) => item.type === "video").length;
    const uniqueMoods = new Set(memories.map((memory) => memory.emotion)).size;

    return [
      {
        label: "Total memories",
        value: memories.length,
        detail:
          memories.length === 1
            ? "1 story archived"
            : `${memories.length} stories archived`,
        icon: Leaf,
        color: "bg-emerald-100 text-emerald-800",
      },
      {
        label: "With media",
        value: withMedia,
        detail: `${mediaItems.length} files attached`,
        icon: Image,
        color: "bg-pink-100 text-pink-700",
      },
      {
        label: "Video moments",
        value: videos,
        detail: "Video files captured",
        icon: PlayCircle,
        color: "bg-violet-100 text-violet-800",
      },
      {
        label: "Mood range",
        value: uniqueMoods,
        detail: "Emotion categories used",
        icon: Sparkles,
        color: "bg-amber-100 text-amber-800",
      },
    ];
  }, [memories]);

  const recentMemories = useMemo(
    () =>
      [...visibleMemories]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3),
    [visibleMemories]
  );

  const rowData = useMemo<MemoryRow[]>(
    () =>
      visibleMemories.map((memory) => {
        const mediaCount = getMemoryMedia(memory).length;

        return {
          id: memory.id,
          title: memory.title,
          emotion: memory.emotion,
          date: memory.date,
          media:
            mediaCount > 0
              ? `${mediaCount} file${mediaCount === 1 ? "" : "s"}`
              : "text",
        };
      }),
    [visibleMemories]
  );

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/60 shadow-2xl">
          <img
            src={frierenGroupGrass}
            alt="Memory Garden atmosphere"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 flex min-h-[340px] flex-col justify-between p-8 md:p-10"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-200">
                Memory Garden
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
                Welcome back, {user?.name ?? "Memory Keeper"}.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/85">
                Continue growing your memories, preserving emotions, and shaping
                your personal digital garden through peaceful moments and
                nostalgic stories.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                className="h-12 rounded-full bg-gradient-to-r from-pink-400 via-violet-400 to-purple-500 px-6 text-white shadow-xl shadow-pink-300/30 hover:scale-[1.02]"
              >
                <Link to="/plant">
                  <Plus className="size-4" />
                  Plant memory
                </Link>
              </Button>

              <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md">
                <TrendingUp className="size-4 text-pink-200" />

                <span className="text-sm font-medium text-white/90">
              {visibleMemories.length} memories shown
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mg-panel p-5"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`grid size-10 place-items-center rounded-lg ${stat.color}`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="text-xs font-medium text-zinc-500">Live</span>
              </div>

              <p className="mt-5 text-sm font-medium text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-semibold text-stone-900">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-zinc-500">{stat.detail}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="mg-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="mg-label">Recent memories</p>
              <h2 className="mt-1 text-lg font-semibold text-stone-900">
                Latest uploads
              </h2>
            </div>

            <Button asChild variant="outline" className="h-9">
              <Link to="/garden">View all</Link>
            </Button>
          </div>

          {recentMemories.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {recentMemories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onOpen={setSelectedMemory}
                />
              ))}
            </div>
          ) : memories.length > 0 ? (
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/40 p-8 text-center">
              <Search className="mx-auto size-9 text-pink-300" />
              <h3 className="mt-3 font-semibold text-stone-900">
                No matches
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Try another title, emotion, description, or date.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/40 p-8 text-center">
              <CalendarDays className="mx-auto size-9 text-pink-300" />
              <h3 className="mt-3 font-semibold text-stone-900">
                No memories yet
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Plant your first memory to populate this dashboard.
              </p>
            </div>
          )}
        </section>

        <section className="mg-panel p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="mg-label">Archive</p>
              <h2 className="mt-1 text-lg font-semibold text-stone-900">
                Memory registry
              </h2>
            </div>

            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-500">
              {visibleMemories.length} shown
            </span>
          </div>

          {rowData.length > 0 ? (
            <div className="space-y-3">
              {rowData.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => {
                    const memory = memories.find((item) => item.id === row.id);
                    if (memory) {
                      setSelectedMemory(memory);
                    }
                  }}
                  className="group grid w-full gap-3 rounded-2xl border border-pink-100 bg-gradient-to-r from-white via-pink-50/60 to-violet-50/60 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-lg md:grid-cols-[1.3fr_0.8fr_0.8fr_0.6fr]"
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-900 transition group-hover:text-pink-600">
                      {row.title}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      Memory title
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium capitalize text-violet-600">
                      {row.emotion}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">Emotion</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-stone-700">
                      {row.date}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">Date</p>
                  </div>

                  <div className="flex items-start md:justify-end">
                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-pink-500 shadow-sm">
                      {row.media}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : memories.length > 0 ? (
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 p-8 text-center">
              <Search className="mx-auto size-9 text-pink-300" />
              <p className="mt-3 font-semibold text-stone-900">
                No registry matches
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Try another title, emotion, description, or date.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 p-8 text-center">
              <p className="font-semibold text-stone-900">
                No registry entries yet
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Plant your first memory to fill the archive.
              </p>
            </div>
          )}
        </section>
      </div>

      <MemoryDetailModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onUpdate={(memory) => {
          updateMemory(memory);
          setSelectedMemory(memory);
        }}
      />
    </section>
  );
}

export default Dashboard;
