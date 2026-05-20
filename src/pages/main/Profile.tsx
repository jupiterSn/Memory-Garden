import { useState, type FormEvent } from "react";
import { CalendarDays, Download, Mail, Save, ShieldCheck, Smartphone, User } from "lucide-react";
import { toast } from "sonner";

import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await apiClient.patch("/account/profile", { name, email });
      updateUser(response.data.user);
      toast.success("Profile updated");
    } catch (error) {
      console.error(error);
      toast.error("Profile could not be updated");
    }
  };

  const exportProfile = async () => {
    try {
      const response = await apiClient.get("/account/export");
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "memory-garden-account-export.json";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Export failed");
    }
  };

  return (
    <section className="space-y-6">
      <div className="mg-panel p-6">
        <p className="mg-label">Account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Profile management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Edit your account identity and review account safety details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <form onSubmit={saveProfile} className="mg-panel p-6">
          <div className="grid size-20 place-items-center rounded-[1.5rem] bg-pink-100 text-pink-500">
            <User className="size-9" />
          </div>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mg-label">Name</span>
              <input className="mg-input mt-2" value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="block">
              <span className="mg-label">Email</span>
              <input className="mg-input mt-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <Button className="garden-button h-11 w-full">
              <Save className="size-4" />
              Save profile
            </Button>
            <Button type="button" variant="outline" className="h-11 w-full rounded-full bg-white/70" onClick={exportProfile}>
              <Download className="size-4" />
              Export account
            </Button>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Email status", value: user?.emailVerified ? "Verified" : "Needs confirmation", icon: Mail },
            { title: "Account status", value: user?.status ?? "active", icon: ShieldCheck },
            {
              title: "Last login",
              value: user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Current session",
              icon: CalendarDays,
            },
            { title: "Trusted devices", value: "Updated automatically after login", icon: Smartphone },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="mg-panel p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-pink-50 text-pink-500">
                  <Icon className="size-5" />
                </span>
                <p className="mt-5 text-sm font-semibold text-stone-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-stone-500">{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Profile;
