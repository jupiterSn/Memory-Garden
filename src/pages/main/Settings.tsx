import {
  Bell,
  Cloud,
  Database,
  Eye,
  Lock,
  Moon,
  Palette,
  ShieldCheck,
} from "lucide-react";

const settings = [
  {
    title: "Garden ambience",
    description: "Petals, wisteria motion, and soft backgrounds keep the app calm.",
    icon: Palette,
    status: "Enabled",
  },
  {
    title: "Memory privacy",
    description: "Admins can manage accounts but cannot inspect memories.",
    icon: Lock,
    status: "Protected",
  },
  {
    title: "Media persistence",
    description: "Uploaded images stay with saved memories in this browser.",
    icon: Database,
    status: "Local",
  },
  {
    title: "Gentle reminders",
    description: "Notification surfaces are ready for future garden reminders.",
    icon: Bell,
    status: "Ready",
  },
  {
    title: "Low-light comfort",
    description: "A future theme option can reduce brightness for evening use.",
    icon: Moon,
    status: "Planned",
  },
  {
    title: "Account safety",
    description: "Rate limiting, session caps, and device checks guard sign-in.",
    icon: ShieldCheck,
    status: "Active",
  },
  {
    title: "Cloud challenge",
    description: "Cloudflare Turnstile support is wired for production secrets.",
    icon: Cloud,
    status: "Configured",
  },
  {
    title: "Private viewing",
    description: "The profile, admin, and garden areas are protected routes.",
    icon: Eye,
    status: "On",
  },
];

function Settings() {
  return (
    <section className="space-y-6">
      <div className="mg-panel p-6">
        <p className="mg-label">Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Configure the garden experience, privacy posture, and account safety
          features that shape Memory Garden.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {settings.map((setting) => {
          const Icon = setting.icon;

          return (
            <div key={setting.title} className="mg-panel p-5">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-pink-50 text-pink-500">
                  <Icon className="size-5" />
                </span>
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-stone-500">
                  {setting.status}
                </span>
              </div>
              <h2 className="mt-5 font-semibold text-stone-900">{setting.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                {setting.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Settings;
