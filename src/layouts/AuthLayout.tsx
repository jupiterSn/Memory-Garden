import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import wisteriaBackground from "@/assets/purple-wisteria-blossoms.jpg";
import wisteriaLayer from "@/assets/minimalist-flower-illustration.jpg";

function AuthLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7eefc]">
      <img
        src={wisteriaBackground}
        alt="Wisteria garden background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-white/20" />

      <motion.img
        src={wisteriaLayer}
        alt="Animated wisteria vines"
        className="pointer-events-none absolute left-1/2 top-0 h-[78vh] max-h-[760px] w-auto -translate-x-1/2 object-contain opacity-80 mix-blend-multiply"
        animate={{
          x: ["-50%", "-49%", "-50%", "-51%", "-50%"],
          y: [0, 8, 0, 6, 0],
          rotate: [0, 0.8, 0, -0.8, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-purple-200/40 to-transparent"
        animate={{
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-2xl shadow-purple-200/50 backdrop-blur-xl"
        >
          <Outlet />
        </motion.div>
      </div>
    </main>
  );
}

export default AuthLayout;