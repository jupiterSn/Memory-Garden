import { useState, type FormEvent } from "react";
import { Bell, Eye, Lock, Moon, Palette, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  changeDemoPassword,
  getDemoPreferences,
  saveDemoPreferences,
} from "@/data/mockAuth";
import { useAuth } from "@/hooks/useAuth";

const defaultPreferences = {
  petals: true,
  reminders: true,
  privateMode: true,
  lowLight: false,
};

function Settings() {
  const { logout, user } = useAuth();
  const [preferences, setPreferences] = useState(() => ({
    ...defaultPreferences,
    ...getDemoPreferences(),
  }));
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);

    if (key === "lowLight") {
      saveDemoPreferences(updatedPreferences);
      window.dispatchEvent(new Event("memory-garden-preferences-updated"));
    }
  };

  const savePreferences = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      saveDemoPreferences(preferences);
      window.dispatchEvent(new Event("memory-garden-preferences-updated"));
      toast.success("Settings saved");
    } catch (error) {
      console.error(error);
      toast.error("Settings could not be saved");
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!user) {
        throw new Error("You must be logged in to change your password.");
      }

      changeDemoPassword(user, passwords.currentPassword, passwords.newPassword);
      toast.success("Password updated", {
        description: "Please log in again with your new password.",
      });
      logout();
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      toast.error("Password could not be changed", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <section className="space-y-6">
      <div className="mg-panel p-6">
        <p className="mg-label">Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Control the garden experience, privacy posture, and account security.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <form onSubmit={savePreferences} className="mg-panel p-6">
          <h2 className="text-lg font-semibold text-stone-900">Garden preferences</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              { key: "petals", label: "Petal animation", icon: Palette },
              { key: "reminders", label: "Gentle reminders", icon: Bell },
              { key: "privateMode", label: "Private viewing", icon: Eye },
              { key: "lowLight", label: "Low-light comfort", icon: Moon },
            ].map((setting) => {
              const Icon = setting.icon;
              const key = setting.key as keyof typeof preferences;

              return (
                <label key={setting.key} className="flex cursor-pointer items-center justify-between rounded-2xl border border-pink-100 bg-white/70 p-4">
                  <span className="flex items-center gap-3 text-sm font-semibold text-stone-700">
                    <Icon className="size-4 text-pink-400" />
                    {setting.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences[key]}
                    onChange={(event) => updatePreference(key, event.target.checked)}
                    className="size-5 accent-pink-300"
                  />
                </label>
              );
            })}
          </div>
          <Button className="garden-button mt-5 h-11 px-5">
            <Save className="size-4" />
            Save settings
          </Button>
        </form>

        <form onSubmit={changePassword} className="mg-panel p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-stone-900">Change password</h2>
              <p className="text-sm text-stone-500">Changing it revokes active sessions.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mg-label">Current password</span>
              <input
                type="password"
                className="mg-input mt-2"
                value={passwords.currentPassword}
                onChange={(event) =>
                  setPasswords({ ...passwords, currentPassword: event.target.value })
                }
              />
            </label>
            <label className="block">
              <span className="mg-label">New password</span>
              <input
                type="password"
                className="mg-input mt-2"
                value={passwords.newPassword}
                onChange={(event) =>
                  setPasswords({ ...passwords, newPassword: event.target.value })
                }
              />
            </label>
            <Button className="h-11 w-full rounded-full" variant="destructive">
              <Lock className="size-4" />
              Update password
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Settings;
