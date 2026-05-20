import { useCallback, useEffect, useState } from "react";
import {
  Ban,
  CheckCircle2,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "disabled" | "review";
  createdAt?: string;
  lastLoginAt?: string | null;
  activeSessions: number;
  failedLoginCount: number;
};

type SecuritySummary = {
  activeSessions: number;
  blacklistedSessions: number;
  blacklistedUsers: number;
  globalInvalidationAt: number;
  recentEvents: Array<{
    id: number;
    type: string;
    createdAt: string;
  }>;
};

function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [security, setSecurity] = useState<SecuritySummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAdminData = useCallback(async () => {
    if (user?.role !== "admin") {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [usersResponse, securityResponse] = await Promise.all([
        apiClient.get("/admin/users"),
        apiClient.get("/admin/security"),
      ]);

      setUsers(usersResponse.data.users);
      setSecurity(securityResponse.data);
    } catch (error) {
      console.error(error);
      toast.error("Admin data could not be loaded");
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    // Admin data is fetched once when the protected admin page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAdminData();
  }, [loadAdminData]);

  const updateStatus = async (targetUser: AdminUser, status: AdminUser["status"]) => {
    try {
      await apiClient.patch(`/admin/users/${targetUser.id}/status`, { status });
      toast.success("User status updated");
      await loadAdminData();
    } catch (error) {
      console.error(error);
      toast.error("Status update failed");
    }
  };

  const revokeSessions = async (targetUser: AdminUser) => {
    try {
      await apiClient.post(`/admin/users/${targetUser.id}/revoke-sessions`);
      toast.success("Sessions revoked");
      await loadAdminData();
    } catch (error) {
      console.error(error);
      toast.error("Could not revoke sessions");
    }
  };

  if (user?.role !== "admin") {
    return (
      <section className="mg-panel p-8 text-center">
        <ShieldAlert className="mx-auto size-10 text-pink-300" />
        <h1 className="mt-4 text-2xl font-semibold text-stone-900">
          Admin access required
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          This area is reserved for user safety and account operations.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="mg-panel p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mg-label">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
              User safety console
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              Manage accounts, sessions, and security signals without opening
              anyone's private memories.
            </p>
          </div>
          <Button className="garden-button h-10 px-4" onClick={loadAdminData}>
            <RefreshCcw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Users",
            value: users.length,
            icon: Users,
          },
          {
            label: "Active sessions",
            value: security?.activeSessions ?? 0,
            icon: ShieldCheck,
          },
          {
            label: "Session blocks",
            value: security?.blacklistedSessions ?? 0,
            icon: Ban,
          },
          {
            label: "User blocks",
            value: security?.blacklistedUsers ?? 0,
            icon: ShieldAlert,
          },
        ].map((metric) => {
          const Icon = metric.icon;

          return (
            <div key={metric.label} className="mg-panel p-5">
              <Icon className="size-5 text-pink-400" />
              <p className="mt-4 text-sm text-stone-500">{metric.label}</p>
              <p className="mt-1 text-3xl font-semibold text-stone-900">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mg-panel overflow-hidden">
        <div className="border-b border-pink-100 p-5">
          <h2 className="text-lg font-semibold text-stone-900">
            Account management
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Admins see account metadata only, never personal memories.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-pink-50/70 text-xs uppercase tracking-[0.12em] text-stone-500">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Sessions</th>
                <th className="px-5 py-3">Failed logins</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100">
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-stone-500" colSpan={6}>
                    Loading users...
                  </td>
                </tr>
              ) : (
                users.map((targetUser) => (
                  <tr key={targetUser.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-stone-900">{targetUser.name}</p>
                      <p className="text-xs text-stone-500">{targetUser.email}</p>
                    </td>
                    <td className="px-5 py-4 capitalize">{targetUser.role}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold capitalize text-pink-500">
                        {targetUser.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">{targetUser.activeSessions}</td>
                    <td className="px-5 py-4">{targetUser.failedLoginCount}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => updateStatus(targetUser, "active")}
                        >
                          <CheckCircle2 className="size-4" />
                          Active
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => updateStatus(targetUser, "review")}
                        >
                          Review
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => revokeSessions(targetUser)}
                        >
                          Revoke
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Admin;
