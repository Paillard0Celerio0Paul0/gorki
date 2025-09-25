interface PlayerCardProps {
  name: string;
  catchphrase: string;
  peakElo: string;
  objective: string;
  // dpmLink: string;
}

export default function PlayerCard({ 
  name, 
  catchphrase, 
  peakElo, 
  objective, 
  // dpmLink 
}: PlayerCardProps) {
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-2xl hover:border-gray-700/70 transition-all duration-300 hover:shadow-3xl h-full flex flex-col">
      <div className="text-center flex flex-col h-full">
        {/* Nom du joueur */}
        <h3 className="text-2xl font-bold text-white mb-2 font-dogelica">
          {name}
        </h3>
        
        {/* Phrase d'accroche */}
        <p className="text-gray-400 italic mb-4 text-sm min-h-[2.5rem] flex items-center justify-center">
          "{catchphrase}"
        </p>
        
        {/* Peak Elo */}
        <div className="mb-4">
          <span className="text-gray-500 text-sm font-medium">Peak Elo:</span>
          <div className="text-xl font-bold text-yellow-400 font-dogelica mt-1 min-h-[1.5rem] flex items-center justify-center">
            {peakElo}
          </div>
        </div>
        
        {/* Objectif */}
        <div className="mb-6 flex-grow">
          <span className="text-gray-500 text-sm font-medium">Objectif:</span>
          <div className="text-white font-medium mt-1 min-h-[2rem] flex items-center justify-center">
            {objective}
          </div>
        </div>
        
        {/* Lien DPM.lol */}
        <button
          disabled
          className="inline-flex items-center px-4 py-2 bg-gray-800/30 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed border border-gray-700/30 mt-auto"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Voir sur DPM.lol
        </button>
      </div>
    </div>
  );
}
