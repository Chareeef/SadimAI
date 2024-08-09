"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between bg-sky-700 p-2 text-white">
      <div className="flex items-center font-bold">
        <Image
          src="/ChatWithAI.png"
          alt="ChatWithAI Logo"
          width={64}
          height={64}
        />
        <h1 className="text-3xl ml-2">Chat With AI</h1>
      </div>
      <nav>
        {session && session.user ? (
          <button
            onClick={() => signOut()}
            className="text-2xl p-2 bg-sky-900 border-2 border-white rounded-lg"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-2xl p-2 bg-sky-900 border-2 border-white rounded-lg"
          >
            Sign In
          </button>
        )}{" "}
      </nav>
    </header>
  );
}
