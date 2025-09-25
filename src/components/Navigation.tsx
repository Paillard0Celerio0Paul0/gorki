'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white font-dogelica">
              Gorki SoloQ Challenge
            </Link>
          </div>
          
          <div className="flex space-x-8">
            <Link
              href="/participants"
              className={`px-3 py-2 rounded-md text-sm font-medium font-dogelica transition-colors duration-200 ${
                pathname === '/participants'
                  ? 'text-white bg-gray-800/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              Participants
            </Link>
            <Link
              href="/regles"
              className={`px-3 py-2 rounded-md text-sm font-medium font-dogelica transition-colors duration-200 ${
                pathname === '/regles'
                  ? 'text-white bg-gray-800/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              Règles
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
