"use client";
import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  doc,
  serverTimestamp,
  setDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  getDoc,
  FieldValue,
} from "firebase/firestore";
import { db } from "./firestore";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Aurora from "../components/Aurora";
import Markdown from "../components/Markdown";

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

interface ChatWindowProps {
  openAside: boolean;
  setOpenAside: Dispatch<SetStateAction<boolean>>;
  user: User | undefined;
  conversation: Message[];
  setConversation: Dispatch<SetStateAction<Message[]>>;
  conversationId: string;
  setConversationId: Dispatch<SetStateAction<string>>;
}

interface AsideProps {
  openAside: boolean;
  setOpenAside: Dispatch<SetStateAction<boolean>>;
  user: User | undefined;
  setConversation: Dispatch<SetStateAction<Message[]>>;
  currentConversationId: string;
  setConversationId: Dispatch<SetStateAction<string>>;
}

interface ConversationMeta {
  id: string;
  title: string;
  lastUpdated: any;
}

function useConversationHistory(user: User | undefined): ConversationMeta[] {
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMeta[]
  >([]);

  useEffect(() => {
    if (!user?.email) return;

    const q = query(
      collection(db, "users", user.email, "conversations"),
      orderBy("lastUpdated", "desc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setConversationHistory(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title ?? "Untitled conversation",
          lastUpdated: doc.data().lastUpdated,
        })),
      );
    });

    return () => unsub();
  }, [user?.email]);

  return conversationHistory;
}

function InputArea({
  userMessage,
  setUserMessage,
  sendMessage,
}: InputAreaProps) {
  return (
    <div className="mx-2 h-[4rem] gap-2 flex items-center px-2 py-2 border-t border-green-800/50 shadow-lg md:static md:border-t-0 md:shadow-none">
      <Aurora />
      <textarea
        className="grow h-12 pb-4 pt-2 px-3 bg-gray-900 text-green-300 border border-green-600 rounded-l-lg outline-none focus:border-green-400 resize-none overflow-hidden"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button
        className="px-6 py-[10px] bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold rounded-r-lg shadow-lg shadow-green-500/50 transition-all"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
}

function ChatWindow({
  openAside,
  setOpenAside,
  user,
  conversation,
  setConversation,
  conversationId,
  setConversationId,
}: ChatWindowProps) {
  const [userMessage, setUserMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function saveToFirestore() {
    if (!user) return;

    const ref =
      conversationId !== ""
        ? doc(
            db,
            "users",
            user.email as string,
            "conversations",
            conversationId,
          )
        : null;

    const snap = ref && (await getDoc(ref));

    if (snap?.exists()) {
      if (snap.data().messages.length === conversation.length) {
        return;
      }
    }

    try {
      const data: {
        conversationId: string;
        messages: Message[];
        title?: string;
        lastUpdated: FieldValue;
      } = {
        conversationId: conversationId,
        messages: conversation,
        lastUpdated: serverTimestamp(),
      };

      // Only generate title for new conversations
      if (conversationId === "") {
        const res = await fetch("/api/chat_title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation: conversation,
          }),
        });

        if (res.ok) {
          const { title } = await res.json();
          data.title = title;
          data.conversationId = `${title.toLowerCase().replace(/\s+/g, "-")}-${uuidv4()}`;
          setConversationId(data.conversationId);
        }
      }

      const docRef = doc(
        db,
        "users",
        user.email as string,
        "conversations",
        data.conversationId,
      );

      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error("Failed to save conversation:", error);
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
    setIsStreaming(true);

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
        setIsStreaming(false);
        console.error("response.body is not found");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value }: ReadableStreamReadResult<Uint8Array> =
          await reader.read();

        if (done) {
          setIsStreaming(false);
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
      setIsStreaming(false);
      console.error(error);
    }
  }

  useEffect(() => {
    if (!user || isStreaming) {
      return;
    }
    if (
      conversation.length > 1 &&
      conversation[conversation.length - 1].role === "assistant" &&
      conversation[conversation.length - 1].content
    ) {
      saveToFirestore();
    }
  }, [conversation, user, isStreaming]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.length]);

  return (
    <main className="relative h-full flex flex-col grow md:col-span-3 text-lg bg-transparent overflow-hidden">
      <button
        onClick={() => setOpenAside(true)}
        className={`md:hidden fixed top-10 left-0 z-30 p-2 bg-green-600 hover:bg-green-500 rounded-r-lg transition-all ${openAside ? "-translate-x-full" : "translate-x-0"}`}
      >
        <Icon icon="mdi:menu" className="w-6 h-6 text-green-300" />
      </button>
      <div
        className={`grow min-h-0 relative flex flex-col ${conversation.length === 0 ? "justify-center" : "justify-end"}`}
      >
        {conversation.length === 0 ? (
          <p className="text-base text-green-300 self-center text-center py-8">
            I am Sadim! Ready to help you with anything you need!
          </p>
        ) : (
          <div className="relative w-full flex flex-col overflow-y-auto p-4 space-y-4">
            {conversation.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg shadow-md max-w-[80%] ${
                  message.role === "user"
                    ? "bg-green-800/50 text-green-200 self-end"
                    : "bg-teal-800/50 text-teal-200 self-start"
                }`}
              >
                <Markdown content={message.content ?? ""} />
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <InputArea
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        sendMessage={sendMessage}
      />
    </main>
  );
}

function Aside({
  openAside,
  setOpenAside,
  user,
  setConversation,
  currentConversationId,
  setConversationId,
}: AsideProps) {
  const asideRef = useRef<HTMLDivElement>(null);
  const conversationHistory = useConversationHistory(user);

  function formatDate(date: Date): string {
    let timeDifferenceInMinutes = Math.floor(
      (Date.now() - date.getTime()) / 1000 / 60,
    );
    if (timeDifferenceInMinutes < 1) {
      return "Just now";
    } else if (timeDifferenceInMinutes < 60) {
      // less than 1 hour
      return `${timeDifferenceInMinutes} minute${timeDifferenceInMinutes === 1 ? "" : "s"} ago`;
    } else if (timeDifferenceInMinutes < 60 * 24) {
      // less than 1 day
      const hours = Math.floor(timeDifferenceInMinutes / 60);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (timeDifferenceInMinutes < 60 * 24 * 7) {
      // less than 1 week
      const days = Math.floor(timeDifferenceInMinutes / (60 * 24));
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (timeDifferenceInMinutes < 60 * 24 * 30) {
      // less than 1 month
      const weeks = Math.floor(timeDifferenceInMinutes / (60 * 24 * 7));
      return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    } else if (timeDifferenceInMinutes < 60 * 24 * 365) {
      // less than 1 year
      const months = Math.floor(timeDifferenceInMinutes / (60 * 24 * 30));
      return `${months} month${months === 1 ? "" : "s"} ago`;
    } else {
      // more than 1 year
      // DD/MM/YYYY
      return `${date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
    }
  }

  async function loadConversation(conversationId: string) {
    if (!user || conversationId === "") return;

    const ref = doc(
      db,
      "users",
      user.email as string,
      "conversations",
      conversationId,
    );

    const snap = await getDoc(ref);

    if (snap.exists()) {
      setConversationId(conversationId);
      setConversation(snap.data().messages || []);
    }
  }

  function handleNewChat() {
    setConversationId("");
    setConversation([]);
    setOpenAside(false);
  }

  function handleSelectConversation(conversationId: string) {
    loadConversation(conversationId);
    setOpenAside(false);
  }

  return (
    <motion.aside
      ref={asideRef}
      className={`fixed md:relative h-full md:col-span-1 z-30 flex flex-col w-[60%] md:w-full border-r border-green-800/50 shadow-2xl shadow-green-900/30 overflow-hidden transition-transform md:transition-none duration-300 md:translate-x-0 ${
        openAside ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Aurora />
      <button
        onClick={() => setOpenAside(false)}
        className="md:hidden absolute top-4 right-4 p-2 bg-green-600/50 hover:bg-green-500/80 rounded-full"
      >
        <Icon icon="mdi:close" className="w-5 h-5 text-green-300" />
      </button>
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

      {/* History  */}
      <div className="grow p-4 overflow-y-auto space-y-2">
        {conversationHistory.map((conv) => (
          <button
            key={conv.id}
            onClick={() => handleSelectConversation(conv.id)}
            className={`w-full text-left p-3 rounded-lg ${conv.id === currentConversationId ? "bg-green-800/50" : "bg-green-900/40"} hover:bg-green-800/60 transition`}
          >
            <p className="text-green-300 font-medium truncate">{conv.title}</p>
            <p className="text-xs text-green-500">
              {formatDate(conv.lastUpdated?.toDate() || new Date())}
            </p>
          </button>
        ))}
      </div>
      {/* Actions */}
      <div className="p-2 flex flex-wrap items-center  h-[4rem] justify-center gap-4 border-t border-green-800/50">
        <button
          onClick={handleNewChat}
          className="p-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-black font-medium rounded-lg shadow-md shadow-teal-500/50 transition-all"
        >
          New Chat
        </button>
        {user ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium rounded-lg shadow-md shadow-rose-500/50 transition-all"
          >
            Sign Out
          </button>
        ) : (
          <Link href="/signin">
            <button className=" px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-medium rounded-lg shadow-md shadow-green-500/50 transition-all">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </motion.aside>
  );
}

export default function Chat() {
  const [openAside, setOpenAside] = useState<boolean>(false);
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>("");

  const user = session?.user;

  useEffect(() => {
    // Set openAside to true if screen width is greater than or equal to 768px
    if (window.innerWidth >= 768) {
      setOpenAside(true);
    }
  }, []);

  return (
    <div className="relative md:grid md:grid-cols-4 h-dvh overflow-hidden ">
      <Aside
        openAside={openAside}
        setOpenAside={setOpenAside}
        user={user}
        setConversation={setConversation}
        currentConversationId={conversationId}
        setConversationId={setConversationId}
      />

      <ChatWindow
        openAside={openAside}
        setOpenAside={setOpenAside}
        user={user}
        conversation={conversation}
        setConversation={setConversation}
        conversationId={conversationId}
        setConversationId={setConversationId}
      />
    </div>
  );
}
