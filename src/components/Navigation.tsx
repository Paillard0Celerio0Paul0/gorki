'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-sm lg:text-2xl font-bold text-white font-dogelica">
              Gorki SoloQ Challenge
            </Link>
          </div>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/participants"
              className={`px-3 py-2 rounded-md text-sm font-medium font-dogelica transition-colors duration-200 ${
                pathname === '/participants'
                  ? 'text-white bg-gray-800/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              👥 Participants
            </Link>
            <Link
              href="/leaderboard"
              className={`px-3 py-2 rounded-md text-sm font-medium font-dogelica transition-colors duration-200 ${
                pathname === '/leaderboard'
                  ? 'text-yellow-400 bg-gray-800/50'
                  : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/30'
              }`}
            >
              🏆 Leaderboard
            </Link>
            {session?.user && (
              <Link
                href="/predictions"
                className={`px-3 py-2 rounded-md text-sm font-medium font-dogelica transition-colors duration-200 ${
                  pathname === '/predictions'
                    ? 'text-purple-400 bg-gray-800/50'
                    : 'text-gray-300 hover:text-purple-400 hover:bg-gray-800/30'
                }`}
              >
                🔮 Prédictions
              </Link>
            )}
            <Link
              href="/regles"
              className={`px-3 py-2 rounded-md text-sm font-medium font-dogelica transition-colors duration-200 ${
                pathname === '/regles'
                  ? 'text-white bg-gray-800/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
              }`}
            >
              📋 Règles
            </Link>
            {session?.user?.is_admin && (
              <Link
                href="/admin/predictions"
                className={`px-3 py-2 rounded-md text-sm font-medium font-dogelica transition-colors duration-200 ${
                  pathname === '/admin/predictions'
                    ? 'text-purple-400 bg-gray-800/50'
                    : 'text-gray-300 hover:text-purple-400 hover:bg-gray-800/30'
                }`}
              >
                ⚙️ Admin
              </Link>
            )}
          </div>

          {/* Bouton Hamburger Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-sm border-t border-gray-800/50">
              <Link
                href="/participants"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium font-dogelica transition-colors duration-200 ${
                  pathname === '/participants'
                    ? 'text-white bg-gray-800/50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                }`}
              >
                👥 Participants
              </Link>
              <Link
                href="/leaderboard"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium font-dogelica transition-colors duration-200 ${
                  pathname === '/leaderboard'
                    ? 'text-yellow-400 bg-gray-800/50'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/30'
                }`}
              >
                🏆 Leaderboard
              </Link>
              {session?.user && (
                <Link
                  href="/predictions"
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium font-dogelica transition-colors duration-200 ${
                    pathname === '/predictions'
                      ? 'text-purple-400 bg-gray-800/50'
                      : 'text-gray-300 hover:text-purple-400 hover:bg-gray-800/30'
                  }`}
                >
                  🔮 Prédictions
                </Link>
              )}
              <Link
                href="/regles"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium font-dogelica transition-colors duration-200 ${
                  pathname === '/regles'
                    ? 'text-white bg-gray-800/50'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
                }`}
              >
                📋 Règles
              </Link>
              {session?.user?.is_admin && (
                <Link
                  href="/admin/predictions"
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium font-dogelica transition-colors duration-200 ${
                    pathname === '/admin/predictions'
                      ? 'text-purple-400 bg-gray-800/50'
                      : 'text-gray-300 hover:text-purple-400 hover:bg-gray-800/30'
                  }`}
                >
                  ⚙️ Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
