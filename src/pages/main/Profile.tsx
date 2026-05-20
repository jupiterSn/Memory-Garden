import {
  CalendarDays,
  KeyRound,
  Mail,
  ShieldCheck,
  Smartphone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function Profile() {
  const { user } = useAuth();

  return (
    <section className="space-y-6">
      <div className="mg-panel p-6">
        <p className="mg-label">Account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Profile management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Keep your identity, sign-in safety, and personal garden preferences
          organized from one place.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="mg-panel p-6">
          <div className="grid size-20 place-items-center rounded-[1.5rem] bg-pink-100 text-pink-500">
            <User className="size-9" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-stone-900">
            {user?.name ?? "Memory Keeper"}
          </h2>
          <p className="mt-1 text-sm text-stone-500">{user?.email}</p>
          <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
            {user?.role ?? "user"}
          </span>

          <div className="mt-6 space-y-3">
            <Button className="garden-button h-10 w-full">Edit profile</Button>
            <Button variant="outline" className="h-10 w-full rounded-full bg-white/70">
              Export my data
            </Button>
          </div>
        </aside>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Email address",
              value: user?.email ?? "Not available",
              icon: Mail,
            },
            {
              title: "Account status",
              value: user?.status ?? "active",
              icon: ShieldCheck,
            },
            {
              title: "Last login",
              value: user?.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString()
                : "Current session",
              icon: CalendarDays,
            },
            {
              title: "Trusted devices",
              value: "Managed automatically after sign-in",
              icon: Smartphone,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="mg-panel p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-pink-50 text-pink-500">
                  <Icon className="size-5" />
                </span>
                <p className="mt-5 text-sm font-semibold text-stone-900">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  {item.value}
                </p>
              </div>
            );
          })}

          <div className="mg-panel p-5 md:col-span-2">
            <div className="flex items-start gap-4">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <KeyRound className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold text-stone-900">Security controls</h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Password verification, device trust, session limits, anomaly
                  detection, and token invalidation are handled by the backend
                  before a session is accepted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
