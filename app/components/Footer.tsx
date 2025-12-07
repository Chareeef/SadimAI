import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-4 min-h-[10vh] justify-center items-center p-4 bg-teal-900/40 border-t-2 border-green-800/50 text-green-400 text-xl shadow-2xl shadow-green-900/30">
      <h3 className="font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
        Youssef Charif Hamidi
      </h3>
      <div className="flex space-x-4">
        <a
          className="hover:text-emerald-300 transition-colors"
          href="https://github.com/Chareeef"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon icon="mdi:github" width={24} height={24} />
        </a>
        <a
          className="hover:text-emerald-300 transition-colors"
          href="https://linkedin.com/in/youssef-charif-hamidi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon icon="mdi:linkedin" width={24} height={24} />
        </a>
        <a
          className="hover:text-emerald-300 transition-colors"
          href="https://x.com/YoussefCharifH2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon icon="tabler:brand-x" width={24} height={24} />
        </a>
      </div>
      <p className="text-green-500">© 2025</p>
    </footer>
  );
}
