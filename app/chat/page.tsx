"use client";

import { Icon } from "@iconify/react";
import {
  FieldValue,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import Aurora from "../components/Aurora";
import Markdown from "../components/Markdown";
import { db } from "./firestore";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ConversationMeta {
  id: string;
  title: string;
  lastUpdated?: { toDate: () => Date };
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

const starterPrompts = [
  {
    icon: "solar:pen-new-square-linear",
    title: "Create",
    prompt: "Help me turn a rough idea into a clear, compelling first draft.",
  },
  {
    icon: "solar:lightbulb-bolt-linear",
    title: "Brainstorm",
    prompt: "Brainstorm ten fresh approaches to a problem I am working on.",
  },
  {
    icon: "solar:book-2-linear",
    title: "Learn",
    prompt: "Teach me a complex topic step by step with practical examples.",
  },
  {
    icon: "solar:checklist-minimalistic-linear",
    title: "Plan",
    prompt: "Build me a focused, realistic action plan for my next project.",
  },
];

function useConversationHistory(user: User | undefined): ConversationMeta[] {
  const [historyState, setHistoryState] = useState<{
    owner?: string;
    conversations: ConversationMeta[];
  }>({ conversations: [] });

  useEffect(() => {
    if (!user?.email) return;

    const owner = user.email;

    const conversationsQuery = query(
      collection(db, "users", owner, "conversations"),
      orderBy("lastUpdated", "desc"),
    );

    return onSnapshot(conversationsQuery, (snapshot) => {
      setHistoryState({
        owner,
        conversations: snapshot.docs.map((conversationDoc) => ({
          id: conversationDoc.id,
          title: conversationDoc.data().title ?? "Untitled conversation",
          lastUpdated: conversationDoc.data().lastUpdated,
        })),
      });
    });
  }, [user?.email]);

  return historyState.owner === user?.email ? historyState.conversations : [];
}

function formatRelativeDate(date: Date): string {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const intervals: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unit, secondsInUnit] of intervals) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return formatter.format(Math.round(seconds / secondsInUnit), unit);
    }
  }

  return "just now";
}

function Composer({
  value,
  setValue,
  onSend,
  onStop,
  isStreaming,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (!isStreaming && value.trim()) onSend();
    }
  }

  return (
    <div className="relative z-10 bg-gradient-to-t from-[#020605] via-[#020605] to-transparent px-3 pb-3 pt-5 sm:px-6 sm:pb-5">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[22px] border border-white/10 bg-[#09120f]/95 p-2 shadow-[0_16px_55px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition-colors focus-within:border-emerald-300/25">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={12000}
            placeholder="Message Sadim..."
            aria-label="Message Sadim"
            className="block min-h-12 max-h-40 w-full resize-none bg-transparent px-3 py-3 text-[15px] leading-6 text-slate-100 outline-none placeholder:text-slate-600"
          />
          <div className="flex items-center justify-between gap-3 pl-3">
            <div className="hidden items-center gap-1.5 text-[10px] text-slate-600 sm:flex">
              <Icon icon="solar:enter-key-linear" className="size-3.5" />
              Enter to send · Shift + Enter for a new line
            </div>
            <div className="ml-auto flex items-center gap-2">
              {value.length > 10000 && (
                <span className="text-[10px] text-slate-600">{value.length}/12000</span>
              )}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStop}
                  aria-label="Stop generating"
                  className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-200 transition-colors hover:bg-white/[0.1]"
                >
                  <Icon icon="solar:stop-bold" className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSend}
                  disabled={!value.trim()}
                  aria-label="Send message"
                  className="grid size-10 place-items-center rounded-2xl bg-emerald-300 text-emerald-950 transition-all hover:bg-emerald-200 disabled:bg-white/[0.06] disabled:text-slate-600"
                >
                  <Icon icon="solar:arrow-up-linear" className="size-[18px]" />
                </button>
              )}
            </div>
          </div>
        </div>
        <p className="mt-2.5 text-center text-[10px] leading-4 text-slate-600">
          Sadim can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  name,
  onSelectPrompt,
}: {
  name?: string | null;
  onSelectPrompt: (prompt: string) => void;
}) {
  const firstName = name?.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="mx-auto flex w-full max-w-3xl grow flex-col justify-center px-4 py-12 sm:px-6"
    >
      <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.07] shadow-[0_0_35px_rgba(52,211,153,0.1)]">
        <Icon icon="solar:stars-minimalistic-bold" className="size-5 text-emerald-300" />
      </div>
      <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
        {firstName ? `What can we explore, ${firstName}?` : "What can we explore together?"}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
        Start with a goal, a half-formed thought, or a question. We’ll shape the next step from there.
      </p>

      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        {starterPrompts.map((starter) => (
          <button
            type="button"
            key={starter.title}
            onClick={() => onSelectPrompt(starter.prompt)}
            className="group min-h-[112px] min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-emerald-300/[0.04]"
          >
            <div className="flex items-center justify-between">
              <Icon icon={starter.icon} className="size-5 text-emerald-300/80" />
              <Icon
                icon="solar:arrow-up-linear"
                className="size-4 rotate-45 text-slate-700 transition-colors group-hover:text-emerald-300"
              />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-200">{starter.title}</p>
            <p className="mt-1 block max-w-full truncate text-xs text-slate-600">{starter.prompt}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function MessageBubble({ message, isStreaming }: { message: Message; isStreaming: boolean }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function copyMessage() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (message.role === "system") return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06]">
          <Icon icon="solar:stars-minimalistic-bold" className="size-3.5 text-emerald-300" />
        </span>
      )}
      <div className={`min-w-0 ${isUser ? "max-w-[88%] sm:max-w-[78%]" : "max-w-[calc(100%-2.75rem)]"}`}>
        <div
          className={
            isUser
              ? "rounded-2xl rounded-br-md border border-emerald-300/10 bg-emerald-300/[0.09] px-4 py-3 text-[15px] leading-7 text-emerald-50"
              : "py-1 text-[15px] leading-7 text-slate-300"
          }
        >
          {!message.content && isStreaming ? (
            <div className="flex h-7 items-center gap-1.5" aria-label="Sadim is thinking">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="size-1.5 rounded-full bg-emerald-300/70"
                  animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.16 }}
                />
              ))}
            </div>
          ) : isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <Markdown content={message.content} />
          )}
        </div>
        {!isStreaming && message.content && (
          <div className={`mt-1 flex ${isUser ? "justify-end" : "justify-start"}`}>
            <button
              type="button"
              onClick={copyMessage}
              aria-label="Copy message"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] text-slate-600 opacity-0 transition-all hover:bg-white/[0.04] hover:text-slate-300 focus:opacity-100 group-hover:opacity-100"
            >
              <Icon icon={copied ? "solar:check-circle-linear" : "solar:copy-linear"} className="size-3.5" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </motion.article>
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
  const [userMessage, setUserMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  async function saveToFirestore() {
    if (!user?.email || conversation.length < 2) return;

    if (conversationId) {
      const existingRef = doc(db, "users", user.email, "conversations", conversationId);
      const snapshot = await getDoc(existingRef);
      if (snapshot.exists() && snapshot.data().messages?.length === conversation.length) return;
    }

    try {
      const nextId = conversationId || `conversation-${uuidv4()}`;
      const data: {
        conversationId: string;
        messages: Message[];
        title?: string;
        lastUpdated: FieldValue;
      } = {
        conversationId: nextId,
        messages: conversation,
        lastUpdated: serverTimestamp(),
      };

      if (!conversationId) {
        const response = await fetch("/api/chat_title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversation }),
        });

        if (response.ok) {
          const { title } = await response.json();
          if (title) data.title = title;
        }
        setConversationId(nextId);
      }

      await setDoc(doc(db, "users", user.email, "conversations", nextId), data, {
        merge: true,
      });
    } catch (saveError) {
      console.error("Failed to save conversation:", saveError);
    }
  }

  async function sendMessage() {
    const outgoingMessage = userMessage.trim();
    if (!outgoingMessage || isStreaming) return;

    const nextConversation: Message[] = [
      ...conversation,
      { role: "user", content: outgoingMessage },
      { role: "assistant", content: "" },
    ];

    setConversation(nextConversation);
    setUserMessage("");
    setError(null);
    setIsStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...conversation, { role: "user", content: outgoingMessage }]),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Sadim could not start a response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setConversation((current) => [
            ...current.slice(0, -1),
            {
              role: "assistant",
              content: `${current[current.length - 1]?.content ?? ""}${chunk}`,
            },
          ]);
        }
      }
    } catch (requestError) {
      if ((requestError as Error).name !== "AbortError") {
        setError("The connection slipped out of orbit. Please try again in a moment.");
        setConversation((current) =>
          current[current.length - 1]?.content ? current : current.slice(0, -1),
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }

  function stopGenerating() {
    abortControllerRef.current?.abort();
    setConversation((current) =>
      current[current.length - 1]?.content ? current : current.slice(0, -1),
    );
    setIsStreaming(false);
  }

  useEffect(() => {
    if (
      user &&
      !isStreaming &&
      conversation.length > 1 &&
      conversation[conversation.length - 1]?.role === "assistant" &&
      conversation[conversation.length - 1]?.content
    ) {
      saveToFirestore();
    }
    // saveToFirestore intentionally follows the latest completed message.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, user, isStreaming]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: isStreaming ? "auto" : "smooth" });
  }, [conversation, isStreaming]);

  return (
    <main className="relative flex min-w-0 grow flex-col overflow-hidden">
      <header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#030807]/70 px-3 backdrop-blur-2xl sm:px-5">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOpenAside(true)}
            className={`grid size-10 place-items-center rounded-xl text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white md:hidden ${openAside ? "invisible" : "visible"}`}
            aria-label="Open conversation history"
          >
            <Icon icon="solar:hamburger-menu-linear" className="size-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-white">Sadim</p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.65)]" />
              Ready to help
            </div>
          </div>
        </div>
        <Link
          href="/"
          aria-label="Back to home"
          className="grid size-10 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-white"
        >
          <Icon icon="solar:home-2-linear" className="size-[18px]" />
        </Link>
      </header>

      <div className="relative flex min-h-0 grow flex-col overflow-hidden">
        {conversation.length === 0 ? (
          <EmptyState name={user?.name} onSelectPrompt={setUserMessage} />
        ) : (
          <div className="min-h-0 grow overflow-y-auto px-3 py-7 sm:px-6 sm:py-10">
            <div className="mx-auto flex max-w-3xl flex-col gap-7" aria-live="polite">
              {conversation.map((message, index) => (
                <MessageBubble
                  key={`${message.role}-${index}`}
                  message={message}
                  isStreaming={isStreaming && index === conversation.length - 1}
                />
              ))}
              {error && (
                <div className="ml-11 flex items-start gap-2 rounded-xl border border-rose-400/15 bg-rose-400/[0.055] px-3 py-2.5 text-xs text-rose-200/80">
                  <Icon icon="solar:danger-triangle-linear" className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="ml-auto text-rose-200/50 hover:text-rose-100"
                    aria-label="Dismiss error"
                  >
                    <Icon icon="solar:close-circle-linear" className="size-4" />
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      <Composer
        value={userMessage}
        setValue={setUserMessage}
        onSend={sendMessage}
        onStop={stopGenerating}
        isStreaming={isStreaming}
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
  const conversationHistory = useConversationHistory(user);

  async function loadConversation(id: string) {
    if (!user?.email || !id) return;
    const snapshot = await getDoc(doc(db, "users", user.email, "conversations", id));
    if (snapshot.exists()) {
      setConversationId(id);
      setConversation(snapshot.data().messages || []);
    }
    setOpenAside(false);
  }

  function handleNewChat() {
    setConversationId("");
    setConversation([]);
    setOpenAside(false);
  }

  async function handleDeleteConversation(id: string) {
    if (!user?.email || !window.confirm("Delete this conversation? This cannot be undone.")) return;
    if (id === currentConversationId) handleNewChat();
    try {
      await deleteDoc(doc(db, "users", user.email, "conversations", id));
    } catch (deleteError) {
      console.error("Error deleting conversation:", deleteError);
    }
  }

  return (
    <>
      <AnimatePresence>
        {openAside && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenAside(false)}
            aria-label="Close conversation history"
            className="fixed inset-0 z-30 bg-black/65 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(88vw,320px)] shrink-0 flex-col border-r border-white/[0.07] bg-[#040a09]/95 shadow-2xl backdrop-blur-2xl transition-transform duration-300 md:relative md:z-0 md:w-[292px] md:translate-x-0 md:shadow-none ${
          openAside ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Sadim home">
            <Image
              src="/Sadim_Logo.png"
              alt=""
              width={34}
              height={34}
              className="size-[34px] rounded-xl"
              priority
            />
            <div>
              <p className="text-sm font-semibold tracking-[-0.02em] text-white">Sadim</p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-300/50">
                AI workspace
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setOpenAside(false)}
            className="grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-white/[0.05] hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <Icon icon="solar:close-circle-linear" className="size-5" />
          </button>
        </div>

        <div className="px-3 pb-3 pt-2">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex min-h-11 w-full items-center gap-2.5 rounded-xl bg-emerald-300 px-3.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-200"
          >
            <Icon icon="solar:pen-new-square-linear" className="size-[18px]" />
            New conversation
          </button>
        </div>

        <div className="min-h-0 grow overflow-y-auto px-3 pb-3">
          <div className="mb-2 flex items-center justify-between px-2 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Conversations
            </p>
            {conversationHistory.length > 0 && (
              <span className="text-[10px] text-slate-700">{conversationHistory.length}</span>
            )}
          </div>

          {!user ? (
            <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-300/[0.07] text-emerald-300">
                <Icon icon="solar:history-linear" className="size-[18px]" />
              </span>
              <p className="mt-4 text-sm font-medium text-slate-200">Keep your thinking close</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                Sign in to save conversations and continue them on any device.
              </p>
              <Link
                href="/signin"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
              >
                Sign in
                <Icon icon="solar:arrow-right-linear" className="size-3.5" />
              </Link>
            </div>
          ) : conversationHistory.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <Icon icon="solar:chat-round-dots-linear" className="mx-auto size-5 text-slate-700" />
              <p className="mt-3 text-xs leading-5 text-slate-600">
                Your conversations will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversationHistory.map((conversationItem) => {
                const isActive = conversationItem.id === currentConversationId;
                return (
                  <div
                    key={conversationItem.id}
                    className={`group relative rounded-xl transition-colors ${
                      isActive ? "bg-white/[0.065]" : "hover:bg-white/[0.035]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => loadConversation(conversationItem.id)}
                      className="w-full min-w-0 px-3 py-3 pr-10 text-left"
                    >
                      <p className={`truncate text-xs font-medium ${isActive ? "text-slate-100" : "text-slate-400"}`}>
                        {conversationItem.title}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-700">
                        {formatRelativeDate(conversationItem.lastUpdated?.toDate() || new Date())}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteConversation(conversationItem.id)}
                      className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-slate-700 opacity-0 transition-all hover:bg-rose-400/10 hover:text-rose-300 focus:opacity-100 group-hover:opacity-100"
                      aria-label={`Delete ${conversationItem.title}`}
                    >
                      <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-white/[0.07] p-3">
          {user ? (
            <div className="flex items-center gap-3 rounded-xl p-2">
              {user.image ? (
                <Image
                  src={user.image}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded-xl object-cover"
                />
              ) : (
                <span className="grid size-9 place-items-center rounded-xl bg-emerald-300/10 text-xs font-semibold text-emerald-300">
                  {(user.name || user.email || "S").charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0 grow">
                <p className="truncate text-xs font-medium text-slate-200">{user.name || "Sadim user"}</p>
                <p className="truncate text-[10px] text-slate-600">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="grid size-9 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-white/[0.05] hover:text-slate-200"
                aria-label="Sign out"
              >
                <Icon icon="solar:logout-2-linear" className="size-[18px]" />
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.05]"
            >
              <Icon icon="solar:login-2-linear" className="size-4 text-emerald-300" />
              Sign in to save your chats
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

export default function Chat() {
  const [openAside, setOpenAside] = useState(false);
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState("");

  useEffect(() => {
    function handleShortcut(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        setConversationId("");
        setConversation([]);
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="relative flex h-dvh overflow-hidden bg-[#020605]">
      <Aurora ifLanding={false} />
      <Aside
        openAside={openAside}
        setOpenAside={setOpenAside}
        user={session?.user}
        setConversation={setConversation}
        currentConversationId={conversationId}
        setConversationId={setConversationId}
      />
      <ChatWindow
        openAside={openAside}
        setOpenAside={setOpenAside}
        user={session?.user}
        conversation={conversation}
        setConversation={setConversation}
        conversationId={conversationId}
        setConversationId={setConversationId}
      />
    </div>
  );
}
