"use client";
import { signIn } from "next-auth/react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SignIn() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center bg-gradient-to-b from-black to-green-900 w-full min-h-[85vh] text-center text-green-300 px-4">
        <motion.section
          className="flex flex-col items-center justify-center max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={childVariants}
            className="text-4xl md:text-6xl font-extrabold text-green-400 mb-6 tracking-tight"
          >
            Unlock the Nebula
          </motion.h1>
          <motion.p
            variants={childVariants}
            className="text-xl md:text-2xl font-light mb-10 max-w-xl text-green-200"
          >
            Sign in to blast off into lightning-fast AI chats.<br></br>Your
            warp-speed adventure awaits!
          </motion.p>
          <motion.button
            variants={childVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signIn("google", { callbackUrl: "/chat" })}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold text-xl rounded-full shadow-lg shadow-green-500/50 transition-all flex items-center justify-center space-x-3"
          >
            <Icon icon="mdi:google" className="w-6 h-6" />
            <span>Sign In with Google</span>
          </motion.button>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
