"use client";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center bg-gradient-to-b from-black to-green-900 w-full min-h-dvh text-center text-green-300">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center h-[60vh] px-4">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold text-green-400 mb-4 tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Sadim: AI at Lightning Speed
          </motion.h1>
          <motion.p
            className="text-xl md:text-3xl font-light mb-8 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Instant, human-like chats powered by Groq API. Your friendly AI
            companion.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href="/chat"
              className="bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-8 rounded-full text-xl shadow-lg shadow-green-500/50 transition-all"
            >
              Launch Chat
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-6xl px-4 pt-8 pb-16">
          <motion.h2
            className="text-4xl font-bold text-green-400 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Sadim?
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={childVariants}
              className="p-6 bg-gray-900 rounded-xl shadow-xl shadow-green-900/30 border border-green-700/50"
            >
              <h3 className="text-2xl font-semibold text-green-300 mb-4">
                Rapid Inference
              </h3>
              <p className="text-lg">
                Blazing-fast responses. No waiting, get answers instantly.
              </p>
            </motion.div>
            <motion.div
              variants={childVariants}
              className="p-6 bg-gray-900 rounded-xl shadow-xl shadow-green-900/30 border border-green-700/50"
            >
              <h3 className="text-2xl font-semibold text-green-300 mb-4">
                Smooth Conversations
              </h3>
              <p className="text-lg">
                Natural flow that feels real. Chat like with a friend.
              </p>
            </motion.div>
            <motion.div
              variants={childVariants}
              className="p-6 bg-gray-900 rounded-xl shadow-xl shadow-green-900/30 border border-green-700/50"
            >
              <h3 className="text-2xl font-semibold text-green-300 mb-4">
                Intuitive UI
              </h3>
              <p className="text-lg">
                Simple, effortless design. Dive in without any hassle.
              </p>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
