"use client";
import { useState } from "react";

// Define the shape of a message for the chat
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

function InputArea({ userMessage, setUserMessage }) {
  return (
    <div className="flex">
      <input
        className="w-2/3 border-t-2 border-black"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <button className="bg-sky-600 hover:bg-sky-300 text-center text-white">
        Send
      </button>
    </div>
  );
}

function ChatWindow() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");

  return (
    <div className="w-full flex flex-col text-xl">
      <div className="flex-grow flex flex-col p-2 overflow-auto"></div>
      <InputArea userMessage={userMessage} setUserMessage={setUserMessage} />
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex justify-center items-center w-full">
      <ChatWindow />
    </main>
  );
}
