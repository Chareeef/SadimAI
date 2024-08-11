"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 bg-teal-700 p-2 text-white text-lg">
      <div className="flex flex-col md:flex-row items-center font-bold">
        <Image src="/Sadim_Logo.png" alt="Sadim Logo" width={64} height={64} />
        <h1 className="text-xl md:text-3xl m-2">Sadim</h1>
      </div>
      <nav>
        {session && session.user ? (
          <div className="flex items-center space-x-4">
            <Link
              href="/chat"
              className="md:text-2xl p-2 bg-teal-500 hover:bg-teal-600 border-2 border-white rounded-lg"
            >
              Chat
            </Link>
            <button
              onClick={() => signOut()}
              className="md:text-2xl p-2 bg-emerald-500 hover:bg-emerald-600 border-2 border-white rounded-lg"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="md:text-2xl p-2 bg-emerald-500 hover:bg-emerald-600 border-2 border-white rounded-lg"
          >
            Sign In
          </button>
        )}{" "}
      </nav>
    </header>
  );
}
