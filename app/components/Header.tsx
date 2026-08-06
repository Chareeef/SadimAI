"use client";

import { Icon } from "@iconify/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/#capabilities", label: "Capabilities" },
];

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#030807]/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Sadim home"
        >
          <span className="relative grid size-10 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] shadow-[0_0_28px_rgba(52,211,153,0.12)] transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/Sadim_Logo.png"
              alt=""
              width={40}
              height={40}
              className="size-8 rounded-full"
              priority
            />
          </span>
          <span>
            <span className="block text-[17px] font-semibold leading-none tracking-[-0.03em] text-white">
              Sadim
            </span>
            <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/60 sm:block">
              Nebula intelligence
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active =
              item.href === "/" && pathname === "/" && !item.href.includes("#");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-white/[0.06] text-white"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {status !== "loading" && session?.user && (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden min-h-10 rounded-full px-4 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white sm:block"
            >
              Sign out
            </button>
          )}
          <Link
            href="/chat"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-300 px-4 text-sm font-semibold text-emerald-950 shadow-[0_10px_35px_rgba(52,211,153,0.16)] transition-all hover:-translate-y-0.5 hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030807] sm:px-5"
          >
            {session?.user ? "Open workspace" : "Start chatting"}
            <Icon
              icon="solar:arrow-right-linear"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
