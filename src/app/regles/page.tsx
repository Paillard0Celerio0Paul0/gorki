'use client';

export default function ReglesPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-dogelica">
            Règles du Challenge
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez les règles officielles du Gorki SoloQ Challenge. 
          </p>
        </div>

        {/* Règles principales */}
        <div className="space-y-8">
          {/* Durée du challenge */}
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white font-dogelica">Durée du Challenge</h2>
            </div>
            <p className="text-gray-300 text-lg">
              Le challenge se déroule du <span className="text-yellow-400 font-bold">1er Octobre 20h00</span> au <span className="text-yellow-400 font-bold">8 Janvier</span>.
            </p>
          </div>

          {/* Limite de parties */}
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white font-dogelica">Limite de Parties</h2>
            </div>
            <p className="text-gray-300 text-lg">
              Maximum <span className="text-blue-400 font-bold">10 parties normales</span> et <span className="text-blue-400 font-bold">150 parties ranked</span> au total.
            </p>
          </div>

          {/* SoloQ uniquement */}
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white font-dogelica">SoloQ Uniquement</h2>
            </div>
            <p className="text-gray-300 text-lg">
              Toutes les parties ranked doivent être jouées en <span className="text-green-400 font-bold">SoloQ</span>. Aucune partie en duo ou en équipe n&apos;est autorisée.
            </p>
          </div>

          {/* Compte frais */}
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white font-dogelica">Compte Frais</h2>
            </div>
            <p className="text-gray-300 text-lg">
              Chaque participant recevra un <span className="text-purple-400 font-bold">compte frais</span> créé spécialement pour le challenge.
            </p>
          </div>
        </div>

        {/* Section importante */}
        <div className="mt-16 bg-red-900/20 border border-red-500/30 rounded-xl p-8">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold text-red-400 font-dogelica">Important</h3>
          </div>
          <p className="text-gray-300">
            Thomus mange mon vié
          </p>
        </div>
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
        
        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
