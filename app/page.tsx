import Link from "next/link";
import Header from "./components/Header";
import Image from "next/image";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center bg-gradient-to-r from-teal-300 to-teal-600 w-full min-h-dvh py-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Sadim</h1>
        <p className="text-2xl text-white italic mb-6">
          {" "}
          An AI Chatbot for all your needs.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 w-[90%]">
          <h2 className="text-2xl font-semibold mb-6 text-teal-600 text-center">
            Experience Lightning-Fast AI Conversations
          </h2>
          <div className="flex flex-col space-y-4 text-center">
            <div className="flex flex-col items-center p-4 bg-gradient-to-r from-teal-100 to-teal-200 rounded-lg shadow-sm">
              <div className="grow font-semibold text-teal-800">
                Rapid Inference
              </div>
              <div>Powered by Groq API for instantaneous AI responses</div>
            </div>

            <div className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-sm">
              <div className="grow font-semibold text-blue-800">
                Smooth Conversations
              </div>
              <div>Natural and fluid dialogues that feel human-like</div>
            </div>

            <div className="flex flex-col items-center p-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg shadow-sm">
              <div className="grow font-semibold text-purple-800">
                Intuitive UI
              </div>
              <div>
                User-friendly interface designed for effortless interaction
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center my-8">
            <Image
              src="/Sadim_Demo.png"
              alt="Sadim Demo"
              className="border-2 border-black rounded-lg shadow-md"
              width={1920}
              height={1200}
            />
          </div>
          <div className="flex justify-center">
            <Link
              href="/chat"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Start Chatting Now
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
