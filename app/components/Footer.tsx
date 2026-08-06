import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { href: "https://github.com/Chareeef", label: "GitHub", icon: "mdi:github" },
  {
    href: "https://linkedin.com/in/youssef-charif-hamidi",
    label: "LinkedIn",
    icon: "mdi:linkedin",
  },
  { href: "https://x.com/YoussefCharifH2", label: "X", icon: "tabler:brand-x" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[#020605]/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/Sadim_Logo.png"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full opacity-90"
          />
          <div>
            <p className="text-sm font-semibold text-white">Sadim AI</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Built for fast, thoughtful conversations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
          <Link href="/chat" className="transition-colors hover:text-emerald-300">
            Chat
          </Link>
          <Link href="/signin" className="transition-colors hover:text-emerald-300">
            Sign in
          </Link>
          <span>© {new Date().getFullYear()} Sadim</span>
        </div>

        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="grid size-10 place-items-center rounded-full border border-white/[0.08] bg-white/[0.025] text-slate-400 transition-all hover:-translate-y-0.5 hover:border-emerald-300/25 hover:bg-emerald-300/[0.07] hover:text-emerald-300"
            >
              <Icon icon={link.icon} className="size-[18px]" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
