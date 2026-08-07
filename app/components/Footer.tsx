import { Icon } from "@iconify/react";
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
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#03100b]/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-emerald-100/55">
          © {new Date().getFullYear()} All rights reserved.
        </p>
        <nav
          className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-emerald-50/70"
          aria-label="Footer navigation"
        >
          <Link href="/" className="py-2 transition-colors hover:text-emerald-300">
            Home
          </Link>
          <Link href="/#capabilities" className="py-2 transition-colors hover:text-emerald-300">
            Capabilities
          </Link>
          <Link href="/chat" className="py-2 transition-colors hover:text-emerald-300">
            Chat
          </Link>
          <Link href="/signin" className="py-2 transition-colors hover:text-emerald-300">
            Sign in
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="grid size-10 place-items-center rounded-full border border-white/[0.09] bg-white/[0.035] text-emerald-50/70 transition-all hover:-translate-y-0.5 hover:border-emerald-300/25 hover:bg-emerald-300/[0.08] hover:text-emerald-300"
            >
              <Icon icon={link.icon} className="size-[18px]" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
