"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import Aurora from "./components/Aurora";
import Footer from "./components/Footer";
import Header from "./components/Header";

const capabilities = [
  {
    icon: "solar:bolt-circle-linear",
    title: "Answers at your pace",
    description:
      "Low-latency responses keep your train of thought moving—from a quick question to a deep working session.",
  },
  {
    icon: "solar:chat-round-dots-linear",
    title: "Conversation that flows",
    description:
      "Clean context, natural follow-ups, and polished Markdown make complex ideas easier to work through.",
  },
  {
    icon: "solar:history-linear",
    title: "Pick up where you left off",
    description:
      "Sign in to keep conversations organized and return to the work that matters without starting over.",
  },
  {
    icon: "solar:monitor-smartphone-linear",
    title: "Focused on every screen",
    description:
      "A responsive workspace designed to feel calm and capable across desktop, tablet, and mobile.",
  },
];

const prompts = [
  "Debug this React component and explain what’s causing the render loop",
  "Rewrite this client email so it sounds confident, warm, and concise",
  "Review my landing-page layout and suggest a clearer visual hierarchy",
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020a06]/15">
      <Aurora />
      <Header />
      <main className="relative z-10">
        <section className="relative px-5 pb-28 pt-20 sm:px-8 sm:pb-36 sm:pt-28 lg:pb-44">
          <div className="mx-auto max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3.5 py-2 text-xs font-medium text-emerald-200"
            >
              <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
              Fast intelligence, now in focus
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
              className="text-balance mx-auto max-w-5xl text-[clamp(3rem,8vw,7.4rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-white"
            >
              Think further.
              <span className="block bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Move faster.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="text-balance mx-auto mt-7 max-w-2xl text-base leading-7 text-emerald-50/70 sm:text-lg sm:leading-8"
            >
              Sadim is your calm, high-speed AI workspace for untangling ideas,
              creating better work, and finding a clear next step.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/chat"
                className="group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-emerald-300 px-7 py-3.5 text-sm font-semibold text-emerald-950 shadow-[0_16px_44px_rgba(52,211,153,0.2)] transition-all hover:-translate-y-0.5 hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:w-auto"
              >
                Start a conversation
                <Icon
                  icon="solar:arrow-right-linear"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="#capabilities"
                className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-7 py-3.5 text-sm font-medium text-emerald-50/90 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.08] sm:w-auto"
              >
                See what Sadim can do
              </a>
            </motion.div>
          </div>
        </section>

        <section id="capabilities" className="landing-section-wash px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <motion.div {...reveal} className="max-w-2xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Made for momentum
              </p>
              <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                Less interface. More headspace.
              </h2>
              <p className="mt-5 text-base leading-7 text-emerald-50/70">
                Everything is designed to help you reach useful answers without
                visual noise getting in the way.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-emerald-100/[0.08] bg-emerald-100/[0.07] shadow-[0_28px_90px_rgba(0,28,17,0.18)] md:grid-cols-2">
              {capabilities.map((capability, index) => (
                <motion.article
                  key={capability.title}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.06 }}
                  className="group bg-[#071810]/72 p-7 backdrop-blur-xl transition-colors hover:bg-[#0a2117]/80 sm:p-9"
                >
                  <span className="mb-8 grid size-11 place-items-center rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-300 transition-transform duration-300 group-hover:-translate-y-1">
                    <Icon icon={capability.icon} className="size-5" />
                  </span>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                    {capability.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-emerald-50/70">
                    {capability.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div {...reveal}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Start naturally
              </p>
              <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                Bring the messy first draft.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-emerald-50/70">
                You don’t need a perfect prompt. Start with the thought you have,
                then refine it together through a real conversation.
              </p>
              <Link
                href="/chat"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
              >
                Try your first prompt
                <Icon icon="solar:arrow-right-linear" className="size-4" />
              </Link>
            </motion.div>

            <motion.div {...reveal} className="space-y-3">
              {prompts.map((prompt, index) => (
                <Link
                  href="/chat"
                  key={prompt}
                  className="group flex min-h-[76px] items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 text-left backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-emerald-300/[0.045] sm:px-6"
                >
                  <span className="text-xs font-semibold text-emerald-300/50">0{index + 1}</span>
                  <span className="grow text-sm text-emerald-50/80 sm:text-base">{prompt}</span>
                  <Icon
                    icon="solar:arrow-up-linear"
                    className="size-5 rotate-45 text-emerald-100/45 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-300"
                  />
                </Link>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8 lg:pb-32">
          <motion.div
            {...reveal}
            className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-emerald-300/15 bg-emerald-300/[0.055] px-6 py-16 text-center backdrop-blur-2xl sm:px-12 sm:py-20"
          >
            <div className="absolute left-1/2 top-0 h-40 w-3/4 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
            <Icon
              icon="solar:stars-minimalistic-bold"
              className="relative mx-auto mb-5 size-7 text-emerald-300"
            />
            <h2 className="text-balance relative text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
              Your next clear thought starts here.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-base leading-7 text-emerald-50/70">
              Open Sadim, ask what’s on your mind, and keep moving while the idea is fresh.
            </p>
            <Link
              href="/chat"
              className="relative mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-300 px-7 py-3 text-sm font-semibold text-emerald-950 transition-all hover:-translate-y-0.5 hover:bg-emerald-200"
            >
              Chat with Sadim
              <Icon icon="solar:arrow-right-linear" className="size-4" />
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
