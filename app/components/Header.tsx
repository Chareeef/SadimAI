"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="py-2 md:py-4 bg-teal-900/40 backdrop-blur-md border-b border-green-800/50 shadow-2xl shadow-green-900/50"
    >
      <div className="flex items-center justify-between h-full px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Image
              src="/Sadim_Logo.png"
              alt="Sadim Logo"
              width={56}
              height={56}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-teal-400/50"
            />
          </motion.div>

          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Sadim
            </h1>
          </div>
        </Link>

        {/* Nav - Responsive with text on all screens */}
        <nav className="flex items-center space-x-3 md:space-x-6">
          {session?.user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-black font-semibold rounded-full shadow-sm shadow-green-500/50 transition-all border-2 border-emerald-500"
              >
                <Link href="/chat">Chat</Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut()}
                className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-xl border-2 border-green-500 text-green-400 hover:bg-green-500/20 rounded-full font-medium transition-all shadow-sm shadow-green-500/50"
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signIn()}
              className="px-4 py-2 md:px-8 md:py-3 text-sm md:text-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold rounded-full shadow-sm shadow-green-500/50 transition-all"
            >
              Sign In
            </motion.button>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
