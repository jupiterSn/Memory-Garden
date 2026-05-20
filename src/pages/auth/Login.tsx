import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Flower2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import AuthGardenPanel from "@/components/AuthGardenPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import wisteriaAuth from "@/assets/wisteria-auth.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState(() =>
    localStorage.getItem("memory-garden-remembered-email") ?? ""
  );
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(() =>
    Boolean(localStorage.getItem("memory-garden-remembered-email"))
  );
  const [verificationUrl] = useState(() =>
    localStorage.getItem("memory-garden-pending-verification-url")
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      await login(email, password);
      if (rememberEmail) {
        localStorage.setItem("memory-garden-remembered-email", email);
      } else {
        localStorage.removeItem("memory-garden-remembered-email");
      }
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      const response = error instanceof AxiosError ? error.response?.data : null;

      if (response?.emailVerificationRequired) {
        toast.error("Email confirmation needed", {
          description: "Open the verification link sent to your email.",
        });
        return;
      }

      toast.error("Login failed", {
        description: "Check your email and password, then try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-pink-50">
      <img
        src={wisteriaAuth}
        alt="Wisteria tree garden"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,248,251,0.70)_0%,rgba(255,248,251,0.34)_44%,rgba(255,248,251,0.10)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-white/5" />
      <AuthGardenPanel
        eyebrow="Under the wisteria"
        title="Return to a quiet garden made for the moments you keep close."
      />

      <div className="relative z-10 flex min-h-screen items-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-pink-100 text-pink-500">
              <Flower2 className="size-5" />
            </span>
            <span className="font-semibold tracking-tight text-stone-900">
              Memory Garden
            </span>
          </Link>

          <div className="mg-panel bg-white/62 p-6 shadow-xl shadow-pink-100/50 backdrop-blur-md">
            <p className="mg-label">Login</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Sign in to continue curating your private archive.
            </p>

            {verificationUrl && (
              <div className="mt-5 rounded-2xl border border-pink-100 bg-pink-50/80 p-4 text-sm text-stone-600">
                <p className="font-semibold text-stone-900">
                  Email confirmation is waiting
                </p>
                <p className="mt-1 leading-6">
                  Open the confirmation link before logging in.
                </p>
                <Link
                  to={new URL(verificationUrl).pathname}
                  className="mt-3 inline-flex font-semibold text-pink-500"
                  onClick={() =>
                    localStorage.removeItem("memory-garden-pending-verification-url")
                  }
                >
                  Confirm email
                </Link>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mg-label">Email</span>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mg-input pl-9"
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mg-label">Password</span>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mg-input pl-9"
                    placeholder="Your password"
                  />
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white/60 px-3 py-2 text-sm text-stone-600">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(event) => setRememberEmail(event.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`grid size-5 place-items-center rounded-md border ${
                    rememberEmail
                      ? "border-pink-200 bg-pink-100 text-pink-500"
                      : "border-pink-100 bg-white text-transparent"
                  }`}
                >
                  <Check className="size-3.5" />
                </span>
                Remember my email on this device
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="garden-button h-11 w-full"
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Do not have an account?{" "}
              <Link to="/signup" className="font-semibold text-pink-500">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
