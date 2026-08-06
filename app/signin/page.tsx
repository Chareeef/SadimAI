"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Aurora from "../components/Aurora";
import Footer from "../components/Footer";
import Header from "../components/Header";

const benefits = [
  {
    icon: "solar:history-linear",
    title: "Keep every conversation",
    description: "Your useful threads stay organized and ready when you return.",
  },
  {
    icon: "solar:bolt-circle-linear",
    title: "Return to your flow",
    description: "Move from an open question to a clear next step, quickly.",
  },
  {
    icon: "solar:shield-check-linear",
    title: "Simple, secure access",
    description: "Use your Google account—no extra password to remember.",
  },
];

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/chat" });
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020605]">
      <Aurora ifLanding={false} />
      <Header />
      <main className="relative px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#050c0b]/75 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:min-h-[650px] lg:grid-cols-[1.08fr_0.92fr]"
        >
          <section className="relative hidden overflow-hidden border-r border-white/[0.07] p-12 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-24 -top-24 size-80 rounded-full bg-teal-600/20 blur-3xl" />
            <div className="absolute -bottom-28 right-0 size-96 rounded-full bg-blue-900/20 blur-3xl" />
            <div className="relative">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.055] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                <Icon icon="solar:stars-minimalistic-bold" className="size-3.5" />
                Your personal workspace
              </div>
              <h1 className="text-balance max-w-lg text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-white">
                Ideas move faster when your context comes with you.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Sign in to keep your best conversations close, revisit unfinished
                thinking, and build on every useful answer.
              </p>
            </div>

            <div className="relative grid gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-300/[0.07] text-emerald-300">
                    <Icon icon={benefit.icon} className="size-[19px]" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-100">{benefit.title}</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center justify-center px-5 py-14 sm:px-12 lg:px-14">
            <div className="w-full max-w-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8 grid size-12 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-300 shadow-[0_0_35px_rgba(52,211,153,0.1)]"
              >
                <Icon icon="solar:stars-minimalistic-bold" className="size-5" />
              </motion.div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Welcome to Sadim
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-white">
                Continue your journey
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                One click takes you back to a fast, focused AI workspace.
              </p>

              <button
                type="button"
                onClick={handleSignIn}
                disabled={isLoading}
                className="mt-9 flex min-h-13 w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-0.5 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:translate-y-0 disabled:opacity-70"
              >
                {isLoading ? (
                  <Icon icon="svg-spinners:ring-resize" className="size-5 text-emerald-700" />
                ) : (
                  <Icon icon="logos:google-icon" className="size-5" />
                )}
                {isLoading ? "Opening Google…" : "Continue with Google"}
              </button>

              <div className="my-7 flex items-center gap-3" aria-hidden="true">
                <span className="h-px grow bg-white/[0.07]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
                  Secure access
                </span>
                <span className="h-px grow bg-white/[0.07]" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["solar:lock-password-unlocked-linear", "No password"],
                  ["solar:cloud-check-linear", "Synced history"],
                  ["solar:smartphone-2-linear", "Any device"],
                ].map(([icon, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-3"
                  >
                    <Icon icon={icon} className="mx-auto size-4 text-emerald-300/70" />
                    <p className="mt-2 text-[10px] leading-4 text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-center text-[11px] leading-5 text-slate-600">
                By continuing, you agree to use Sadim responsibly. Google handles
                your authentication securely.
              </p>
            </div>
          </section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
