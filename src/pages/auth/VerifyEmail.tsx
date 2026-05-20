import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Flower2, Loader2, XCircle } from "lucide-react";

import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import wisteriaAuth from "@/assets/wisteria-auth.png";

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirming your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        await apiClient.get(`/auth/verify-email/${token}`);
        setStatus("success");
        setMessage("Your email is confirmed. You can now log in.");
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage("This verification link is invalid or expired.");
      }
    };

    void verify();
  }, [token]);

  const Icon =
    status === "loading" ? Loader2 : status === "success" ? CheckCircle2 : XCircle;

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-pink-50">
      <img
        src={wisteriaAuth}
        alt="Wisteria tree garden"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-white/65" />

      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="mg-panel max-w-md bg-white/70 p-8 text-center shadow-xl shadow-pink-100/60 backdrop-blur-md">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-pink-100 text-pink-500">
            <Flower2 className="size-7" />
          </div>
          <Icon
            className={`mx-auto mt-6 size-10 ${
              status === "loading" ? "animate-spin text-stone-400" : "text-pink-500"
            }`}
          />
          <h1 className="mt-4 text-2xl font-semibold text-stone-900">
            Email confirmation
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">{message}</p>
          <Button asChild className="garden-button mt-6 h-11 px-5">
            <Link to="/login">Go to login</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default VerifyEmail;
