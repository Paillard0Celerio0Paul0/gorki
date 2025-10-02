'use client'

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export default function UserOverlay() {
  const { data: session, status } = useSession()
  const [isExpanded, setIsExpanded] = useState(false)

  if (status === "loading") {
    return null // Pas d'affichage pendant le chargement
  }

  if (!session?.user) {
    return null // Pas d'affichage si pas connecté
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Overlay utilisateur */}
      <div 
        className={`bg-black/80 backdrop-blur-sm border border-gray-800/50 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-glow hover:border-gray-600/70 ${
          isExpanded ? 'p-4 w-64' : 'p-3 w-auto'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        style={{
          boxShadow: isExpanded 
            ? '0 0 30px rgba(255, 255, 255, 0.1), 0 0 60px rgba(255, 255, 255, 0.05)' 
            : '0 10px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={session.user.image || "/default-avatar.png"}
              alt={(session.user as { username: string }).username}
              className="w-10 h-10 rounded-full border-2 border-gray-600/50 object-cover"
              onError={(e) => {
                // Fallback si l'image ne charge pas
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23374151'/%3E%3Ctext x='20' y='25' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3E%3C/svg%3E";
              }}
            />
            {/* Indicateur de connexion */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black/80"></div>
          </div>

          {/* Informations utilisateur */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-dogelica text-sm font-bold truncate max-w-[120px]">
                {session?.user && (session.user as { username?: string }).username}
              </span>
              {session?.user && (session.user as { is_admin?: boolean }).is_admin && (
                <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                  ADMIN
                </span>
              )}
            </div>
            
            {isExpanded && (
              <div className="mt-2 space-y-2">
                
                
                {/* Boutons d'action */}
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.href = "/predictions"}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors duration-200 font-dogelica"
                  >
                    🔮 Prédictions
                  </button>
                  
              
                </div>
                
                {/* Bouton déconnexion */}
                <button
                  onClick={handleSignOut}
                  className="w-full px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors duration-200 font-dogelica"
                >
                  🚪 Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Icône d'expansion */}
          <div className="text-gray-400">
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tooltip d'information */}
      {!isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Survole pour plus d&apos;options
        </div>
      )}

      {/* Styles CSS personnalisés */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
          }
        }
        
        .hover-glow:hover {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .user-overlay-enter {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        
        .user-overlay-enter-active {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: all 300ms ease-out;
        }
        
        .user-overlay-exit {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        
        .user-overlay-exit-active {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          transition: all 300ms ease-in;
        }
      `}</style>
    </div>
  )
}
