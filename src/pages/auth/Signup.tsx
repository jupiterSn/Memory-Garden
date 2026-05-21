import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flower2, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

import AuthGardenPanel from "@/components/AuthGardenPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import wisteriaAuth from "@/assets/wisteria-auth.png";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      await signup(name, email, password);

      toast.success("Account created", {
        description: "Please log in with your new account.",
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Signup failed", {
        description:
          error instanceof Error
            ? error.message
            : "Try a different email or check your details.",
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
        eyebrow="Begin beneath the blooms"
        title="Start a gentle garden for stories, photos, and small beautiful days."
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
            <p className="mg-label">Create account</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
              Start your garden
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Create a secure account for your memory workspace.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mg-label">Name</span>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mg-input pl-9"
                    placeholder="Full name"
                  />
                </div>
              </label>

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
                    placeholder="Create a password"
                  />
                </div>
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="garden-button h-11 w-full"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-pink-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
