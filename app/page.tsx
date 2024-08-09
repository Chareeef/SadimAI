import Link from "next/link";
import Header from "./components/Header";

export default function LandingPage() {
  return (
    <>
      <Header />
      <Link href="/chat">Chat</Link>
    </>
  );
}
