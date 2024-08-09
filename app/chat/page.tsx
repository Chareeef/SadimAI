"use client";
import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";

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
    <div className="flex">
      <textarea
        className="grow h-16 pt-4 px-2 border-t-2 border-r-2 border-black focus:border-blue-500"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button
        className="p-4 bg-sky-600 hover:bg-sky-500 text-white border-t-2 border-black"
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
    <main className="col-span-3 flex flex-col text-xl bg-sky-300 max-h-dvh">
      <div className="grow overflow-y-auto">
        <div className="flex flex-col justify-end p-2 min-h-full space-y-2">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`message p-2 ${
                message.role === "user"
                  ? "bg-sky-800 text-white self-end rounded-bl-lg"
                  : "bg-white self-start rounded-br-lg"
              }`}
            >
              {message.content}
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

export default function Chat() {
  return (
    <>
      <aside className="bg-sky-600 border-r-2 border-blue-800">History</aside>
      <ChatWindow />
    </>
  );
}
