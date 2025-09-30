'use client';

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-dogelica">
            🏆 Leaderboard DPM
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Suivez en temps réel le classement du Gorki SoloQ Challenge
          </p>
        </div>

        {/* Iframe du leaderboard */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-gray-800/50 overflow-hidden shadow-2xl">
          <iframe
            src="https://dpm.lol/leaderboards/394c41bf-ee61-48b1-80f3-57fa9be34951"
            width="100%"
            height="800"
            frameBorder="0"
            className="w-full"
            title="Gorki SoloQ Challenge Leaderboard"
            allowFullScreen
          />
        </div>

        {/* Bouton retour */}
        <div className="text-center mt-8">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-yellow-400/20 text-yellow-400 font-bold font-dogelica rounded-lg border border-yellow-400/30 hover:bg-yellow-400/30 hover:text-yellow-300 transition-all duration-300"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
