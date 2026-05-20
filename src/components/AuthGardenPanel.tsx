import type { CSSProperties } from "react";

import wisteriaAuth from "@/assets/wisteria-auth.png";

type AuthGardenPanelProps = {
  eyebrow: string;
  title: string;
};

const strands = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${6 + index * 8}%`,
  height: `${140 + (index % 4) * 34}px`,
  delay: `${-(index * 0.45)}s`,
  duration: `${5.5 + (index % 5) * 0.7}s`,
}));

function AuthGardenPanel({ eyebrow, title }: AuthGardenPanelProps) {
  return (
    <div className="relative hidden min-h-screen overflow-hidden p-8 text-stone-900 lg:block">
      <img
        src={wisteriaAuth}
        alt="Soft wisteria garden"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,248,251,0.50)_0%,rgba(255,248,251,0.26)_46%,rgba(255,248,251,0.08)_100%)]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
        {strands.map((strand) => (
          <span
            key={strand.id}
            className="wisteria-strand"
            style={
              {
                left: strand.left,
                height: strand.height,
                animationDelay: strand.delay,
                animationDuration: strand.duration,
              } as CSSProperties
            }
          >
            {Array.from({ length: 7 }, (_, bloomIndex) => (
              <span
                key={bloomIndex}
                className="wisteria-bloom"
                style={{
                  top: `${bloomIndex * 13}%`,
                  width: `${16 - bloomIndex}px`,
                  height: `${22 - bloomIndex}px`,
                  opacity: `${0.92 - bloomIndex * 0.06}`,
                }}
              />
            ))}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex h-full min-h-[calc(100vh-4rem)] flex-col justify-end rounded-[2rem] border border-white/45 bg-white/16 p-8 shadow-2xl shadow-pink-100/40 backdrop-blur-[1px]">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-pink-400">
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-stone-900">
          {title}
        </h2>
      </div>
    </div>
  );
}

export default AuthGardenPanel;
