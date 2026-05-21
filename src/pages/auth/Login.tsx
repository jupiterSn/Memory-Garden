import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Welcome back to your garden");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed", {
        description:
          error instanceof Error
            ? error.message
            : "Check your email and password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex min-h-[520px] max-w-md flex-col justify-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-400">
        Welcome back
      </p>

      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">
        Login to your garden
      </h2>

      <p className="mt-3 text-sm leading-6 text-stone-500">
        Continue growing your private memory collection.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Email</span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-pink-100 bg-white/85 px-4 py-3 shadow-sm">
            <Mail className="size-5 text-pink-400" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Password</span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-pink-100 bg-white/85 px-4 py-3 shadow-sm">
            <Lock className="size-5 text-pink-400" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="text-stone-400 transition hover:text-pink-500"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </div>
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-300 via-violet-300 to-purple-400 text-white shadow-lg shadow-pink-200/50 transition hover:scale-[1.02] hover:from-pink-400 hover:via-violet-400 hover:to-purple-500"
        >
          {loading ? "Opening garden..." : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-pink-500 hover:text-pink-600"
        >
          Create one
        </Link>
      </p>
    </motion.div>
  );
}

export default Login;