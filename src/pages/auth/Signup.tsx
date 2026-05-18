import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

function Signup() {
  const navigate = useNavigate();

  const { signup } = useAuth();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await signup(name, email, password);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-emerald-50 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="mb-2 text-4xl font-bold text-emerald-900">
          Create Account 🌱
        </h1>

        <p className="mb-8 text-stone-500">
          Start growing your Memory Garden
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-2xl border border-emerald-200 px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-2xl border border-emerald-200 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-2xl border border-emerald-200 px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-700 px-6 py-4 font-semibold text-white"
          >
            {loading
              ? "Creating Account..."
              : "Signup"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-700"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Signup;