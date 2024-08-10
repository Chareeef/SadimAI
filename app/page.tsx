import Link from "next/link";
import Header from "./components/Header";

export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center  bg-gradient-to-r from-pink-400 to-fuchsia-600 w-full min-h-dvh">
        <div className="p-2">
          <Link href="/chat" className="bg-violet-700 p-2 rounded">
            Chat
          </Link>
        </div>
      </div>
    </>
  );
}
