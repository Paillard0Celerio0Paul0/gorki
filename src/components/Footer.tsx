import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-800/50 bg-black/60 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/qr-code.png"
            alt="QR code Buy me a coffee"
            className="w-24 h-24 rounded-md border border-gray-800/60"
          />
          <div className="text-gray-400 text-sm">
            <div className="font-dogelica text-white">Soutenir le projet</div>
            <div className="opacity-80">Scanne le QR ou clique sur le bouton</div>
          </div>
        </div>

        <div className="flex-1" />

        <Link
          href="https://buymeacoffee.com/rhaaamen"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-yellow-400/40 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 hover:text-yellow-200 transition-colors font-dogelica"
        >
          ☕ Buy me a coffee
        </Link>
      </div>
    </footer>
  );
}
