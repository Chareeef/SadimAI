"use client";
import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

// Define the shape of a message for the chat
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface InputAreaProps {
  userMessage: string;
  setUserMessage: Dispatch<SetStateAction<string>>;
  sendMessage: MouseEventHandler<HTMLButtonElement>;
}

function InputArea({
  userMessage,
  setUserMessage,
  sendMessage,
}: InputAreaProps) {
  return (
    <div className="h-14 flex border-y-2 border-r-2 border-teal-500 m-0">
      <textarea
        className="grow h-full pt-3 px-2 bg-teal-600 text-white border-r-2 border-teal-500 focus:outline-none focus:bg-teal-700"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button
        className="flex items-center justify-center px-4 bg-emerald-500 hover:bg-emerald-600 text-white"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
}

function ChatWindow() {
  const initialConversation: Message[] = [];
  const [conversation, setConversation] =
    useState<Message[]>(initialConversation);
  const [userMessage, setUserMessage] = useState<string>("");

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

  return (
    <main className="col-span-3 flex flex-col text-lg bg-white max-h-dvh">
      <div className="grow overflow-y-auto">
        <div className="flex flex-col justify-end p-2 min-h-full space-y-2">
          {conversation.length === 0 && (
            <p className="text-base text-gray-700 self-center">
              I will be happy to help you with anything you need!
            </p>
          )}

          {conversation.map((message, index) => (
            <div
              key={index}
              className={`message p-2 ${
                message.role === "user"
                  ? "bg-teal-400 text-white self-end rounded-bl-lg"
                  : "bg-teal-500 text-white self-start rounded-br-lg"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
      <InputArea
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        sendMessage={sendMessage}
      />
    </main>
  );
}

function Aside() {
  const { data: session } = useSession();

  const user = session?.user;
  return (
    <aside className="flex flex-col bg-teal-800 border-r-2 border-teal-500">
      {/* Profile */}
      <div className="flex flex-col items-center text-center justify-around py-2 shadow-lg min-h-[25%]">
        <Image
          src={user?.image as string}
          alt="Profile picture"
          width={64}
          height={64}
          className="rounded-full border-2 border-emerald-400"
        />
        {user?.name !== user?.email ? (
          <>
            <p className="text-xl text-white font-mono font-bold italic">
              {user?.name}
            </p>
            <p className="text-base text-white font-mono font-bold break-all">
              {user?.email}
            </p>
          </>
        ) : (
          <p className="text-xl text-white font-mono font-bold italic">
            {user?.email}
          </p>
        )}
      </div>

      {/* History */}
      <div className="grow shadow-lg">
        <div className="flex flex col overflow-y-auto"></div>
      </div>

      {/* Logout */}
      <div className="h-14 p-4 flex items-center justify-center">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded bg-rose-500 hover:bg-rose-600 p-2"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function Chat() {
  return (
    <div className="grid grid-cols-4 gap-0 h-dvh">
      <Aside />
      <ChatWindow />
    </div>
  );
}
