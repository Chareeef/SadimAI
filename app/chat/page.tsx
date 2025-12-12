"use client";
import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firestore";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface User {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface InputAreaProps {
  userMessage: string;
  setUserMessage: Dispatch<SetStateAction<string>>;
  sendMessage: MouseEventHandler<HTMLButtonElement>;
}

interface OpenAsideAndUserProps {
  openAside: boolean;
  setOpenAside: Dispatch<SetStateAction<boolean>>;
  user: User | undefined;
}

function InputArea({
  userMessage,
  setUserMessage,
  sendMessage,
}: InputAreaProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center p-4 bg-black/95 border-t border-green-800/50 shadow-lg z-20 md:static md:border-t-0 md:shadow-none">
      <textarea
        className="grow h-12 p-3 bg-gray-900 text-green-300 border border-green-600 rounded-l-lg outline-none focus:border-green-400 resize-none overflow-hidden"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold rounded-r-lg shadow-lg shadow-green-500/50 transition-all"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
}

function ChatWindow({ openAside, setOpenAside, user }: OpenAsideAndUserProps) {
  const initialConversation: Message[] = [];
  const [conversation, setConversation] =
    useState<Message[]>(initialConversation);
  const [conversationId, setConversationId] = useState<string>("");
  const [userMessage, setUserMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) {
      setConversationId(uuidv4());
    }
  }, [conversationId]);

  async function saveToFirestore() {
    const docRef = doc(
      db,
      "users",
      user?.email as string,
      "conversations",
      conversationId,
    );

    try {
      await setDoc(docRef, { messages: conversation }, { merge: true });
    } catch (error) {
      console.error(error);
    }
  }

  async function sendMessage() {
    if (!userMessage.trim()) return;

    setConversation((conversation) => [
      ...conversation,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);

    setUserMessage("");

    try {
      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          ...conversation,
          { role: "user", content: userMessage },
        ]),
      });

      if (!response.body) {
        console.error("response.body is not found");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value }: ReadableStreamReadResult<Uint8Array> =
          await reader.read();

        if (done) {
          break;
        } else if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setConversation((conversation) => [
            ...conversation.slice(0, conversation.length - 1),
            {
              role: "assistant",
              content: conversation[conversation.length - 1].content + chunk,
            },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
      // Display flash message
    }
  }

  useEffect(() => {
    if (!user) {
      return;
    }
    if (
      conversation.length > 0 &&
      conversation[conversation.length - 1].role === "assistant"
    ) {
      saveToFirestore();
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <main className="relative flex flex-col grow text-lg bg-transparent overflow-hidden">
      <button
        onClick={() => setOpenAside(true)}
        className={`md:hidden fixed top-1/2 left-0 z-30 p-2 bg-green-600/50 hover:bg-green-500/80 rounded-r-lg transition-all ${openAside ? "translate-x-[-100%]" : "translate-x-0"}`}
      >
        <Icon icon="mdi:menu" className="w-6 h-6 text-green-300" />
      </button>
      <div
        className={`grow flex flex-col overflow-y-auto p-4 space-y-4 ${conversation.length === 0 ? "items-center justify-center" : ""}`}
      >
        {conversation.length === 0 && (
          <p className="text-base text-green-300 self-center text-center py-8">
            I am Sadim! Ready to help you with anything you need!
          </p>
        )}

        {conversation.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg shadow-md ${
              message.role === "user"
                ? "bg-green-800/50 text-green-200 self-end max-w-[80%]"
                : "bg-teal-800/50 text-teal-200 self-start max-w-[80%]"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              className="prose prose-invert"
            >
              {message.content}
            </ReactMarkdown>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <InputArea
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        sendMessage={sendMessage}
      />
    </main>
  );
}

function Aside({ openAside, setOpenAside, user }: OpenAsideAndUserProps) {
  const asideRef = useRef<HTMLDivElement>(null);
  return (
    <AnimatePresence>
      {openAside && (
        <motion.aside
          ref={asideRef}
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed md:relative h-full w-full md:w-auto z-30 flex flex-col bg-black/95 border-r border-green-800/50 shadow-2xl shadow-green-900/30 overflow-hidden"
        >
          <button
            onClick={() => setOpenAside(false)}
            className="md:hidden absolute top-4 right-4 p-2 bg-green-600/50 hover:bg-green-500/80 rounded-full"
          >
            <Icon icon="mdi:close" className="w-5 h-5 text-green-300" />
          </button>
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1 bg-green-600/50" />
          {/* Profile */}
          <div className="flex flex-col items-center text-center py-6 shadow-lg border-b border-green-800/50">
            {user ? (
              <>
                <Image
                  src={user?.image as string}
                  alt="Profile picture"
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-green-400 shadow-md"
                />
                <p className="text-xl text-green-300 font-bold mt-2">
                  {user?.name || user?.email}
                </p>
                {user?.name !== user?.email && (
                  <p className="text-sm text-green-500">{user?.email}</p>
                )}
              </>
            ) : (
              <p className="text-xl text-green-300 font-bold">Not logged in</p>
            )}
          </div>

          {/* History (blank for now) */}
          <div className="grow p-4 overflow-y-auto">
            {/* Placeholder for history */}
            <p className="text-green-500 text-center">History coming soon...</p>
          </div>

          {/* Actions */}
          <div className="p-4 flex items-center justify-center gap-4 border-t border-green-800/50">
            {user ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/signin">
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-medium rounded-lg transition-colors">
                  Sign In
                </button>
              </Link>
            )}
            <Link href="/">
              <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-black font-medium rounded-lg transition-colors">
                Home
              </button>
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default function Chat() {
  const [openAside, setOpenAside] = useState<boolean>(false);
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <div className="relative flex h-dvh overflow-hidden bg-black">
      <Aside openAside={openAside} setOpenAside={setOpenAside} user={user} />
      <ChatWindow
        openAside={openAside}
        setOpenAside={setOpenAside}
        user={user}
      />
    </div>
  );
}
