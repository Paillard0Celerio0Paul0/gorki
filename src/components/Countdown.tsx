'use client';

import { useSession } from "next-auth/react";

export default function Countdown() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden pt-16">
      {/* Effet de particules sombres en arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.8),transparent_70%)]"></div>
      
      <div className="relative z-10 text-center mb-12">
        <div className="mb-8 opacity-0 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <a 
              href="/leaderboard" 
              className="text-2xl md:text-3xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-dogelica text-shadow-glow"
            >
              🏆 Leaderboard DPM
            </a>
          </div>
        </div>
        <h1 className="text-3xl md:text-7xl font-bold mb-6 text-white opacity-0 animate-fade-in text-shadow-glow font-dogelica">
          Gorki SoloQ Challenge
        </h1>
        <div className="opacity-0 animate-fade-in-delay">
          <span className="inline-block px-4 py-2 bg-yellow-400/20 text-yellow-400 font-bold font-dogelica rounded-lg border border-yellow-400/30 text-lg">
            Du 1 Octobre 20h00 au 8 Janvier
          </span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Carte 1: Leaderboard */}
        <a 
          href="/leaderboard" 
          className="bg-black/60 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-800/50 opacity-0 animate-fade-in-delay-2 shadow-2xl hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300 group cursor-pointer"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
            🏆
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-3 font-dogelica text-shadow-glow group-hover:text-yellow-400 transition-colors duration-300">
            Leaderboard
          </div>
          <div className="text-sm md:text-lg text-gray-500 font-medium font-dogelica group-hover:text-yellow-300 transition-colors duration-300">
            Voir le classement des participants
          </div>
        </a>

        {/* Carte 2: Vidéo YouTube */}
        <a 
          href="https://www.youtube.com/watch?v=BmtVk8R8jHA" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black/60 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-800/50 opacity-0 animate-fade-in-delay-3 shadow-2xl hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300 group cursor-pointer"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
            📺
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-3 font-dogelica text-shadow-glow group-hover:text-red-400 transition-colors duration-300">
            Vidéo
          </div>
          <div className="text-sm md:text-lg text-gray-500 font-medium font-dogelica group-hover:text-red-300 transition-colors duration-300">
            Regarder sur YouTube
          </div>
        </a>

        {/* Carte 3: Prédictions ou Authentification */}
        {session ? (
          <a 
            href="/predictions" 
            className="bg-black/60 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-800/50 opacity-0 animate-fade-in-delay-4 shadow-2xl hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 group cursor-pointer"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🔮
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-3 font-dogelica text-shadow-glow group-hover:text-purple-400 transition-colors duration-300">
              Prédictions
            </div>
            <div className="text-sm md:text-lg text-gray-500 font-medium font-dogelica group-hover:text-purple-300 transition-colors duration-300">
              Participe aux prédictions du challenge
            </div>
          </a>
        ) : (
          <a 
            href="/auth/signin" 
            className="bg-black/60 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-800/50 opacity-0 animate-fade-in-delay-4 shadow-2xl hover:border-[#5865F2]/50 hover:bg-[#5865F2]/10 transition-all duration-300 group cursor-pointer"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🔐
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white mb-3 font-dogelica text-shadow-glow group-hover:text-[#5865F2] transition-colors duration-300">
              Connexion
            </div>
            <div className="text-sm md:text-lg text-gray-500 font-medium font-dogelica group-hover:text-[#5865F2]/80 transition-colors duration-300">
              Connecte-toi avec Discord pour participer
            </div>
          </a>
        )}
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1);
        }
        
        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1.2s ease-out 0.3s forwards;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 1.2s ease-out 0.6s forwards;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 1.2s ease-out 0.9s forwards;
        }
        
        .animate-fade-in-delay-4 {
          animation: fade-in 1.2s ease-out 1.2s forwards;
        }
        
        .animate-fade-in-delay-5 {
          animation: fade-in 1.2s ease-out 1.5s forwards;
        }
        
        .animate-fade-in-delay-6 {
          animation: fade-in 1.2s ease-out 1.8s forwards;
        }
      `}</style>
    </div>
  );
}
