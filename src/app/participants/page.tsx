'use client';

import PlayerCard from '@/components/PlayerCard';

// Données des participants
const participants = [
  {
    name: "Rhaaamen",
    catchphrase: "Annihiliation",
    peakElo: "Master 70 LP",
    objective: "Master",
    dpmLink: "https://dpm.lol/player/gorki"
  },
  {
    name: "Ebzi",
    catchphrase: "",
    peakElo: "Master 180 LP",
    objective: "Master",
    dpmLink: "https://dpm.lol/player/shadowstrike"
  },
  {
    name: "Taouil",
    catchphrase: "Canapé gaming",
    peakElo: "Platinum 2",
    objective: "Emeraude 2",
    dpmLink: "https://dpm.lol/player/lightningbolt"
  },
  {
    name: "Tiz",
    catchphrase: "Meilleur garen du serveur",
    peakElo: "Platinum 4",
    objective: "High Gold",
    dpmLink: "https://dpm.lol/player/icequeen"
  },
  {
    name: "Francis",
    catchphrase: "Undeserved diamond",
    peakElo: "Diamant 1 BO Master",
    objective: "Diamant 4",
    dpmLink: "https://dpm.lol/player/thunderfist"
  },
  {
    name: "Ronron",
    catchphrase: "PiouPiou Ratatatata",
    peakElo: "Je compte pas le pick émeraude 4 donc mon pick c'est plat 3 max je crois",
    objective: "Platinum 4",
    dpmLink: "https://dpm.lol/player/windwalker"
  },
  {
    name: "Goyonx",
    catchphrase: "Better than Housmi",
    peakElo: "Gold 1",
    objective: "Platinum 4",
    dpmLink: "https://dpm.lol/player/firespirit"
  },
  {
    name: "Mehdi",
    catchphrase: "je suis la pour etre devant les personne qui normalise le racisme et qui ne voit aucun mal a etre amis avec eux",
    peakElo: "Emeraude 3",
    objective: "Emeraude 4",
    dpmLink: "https://dpm.lol/player/stormcaller"
  } , {
    name: "Thomus",
    catchphrase: " la fraude - cc moi c’est la fraude, je suis la pour démontrer que plusieurs personnes dans ce Discord sont des fraudes et qu’ils ne méritent pas leur elo de boosted",
    peakElo: "Diamant 4",
    objective: "Gold 4",
    dpmLink: "https://dpm.lol/player/firespirit"
  }, {
    name: "Javier",
    catchphrase: "VNOLLS WHERE ARE YOU ",
    peakElo: "?",
    objective: "Bronze 1",
    dpmLink: "https://dpm.lol/player/firespirit"
  }, {
    name: "Housmi",
    catchphrase: "I WILL TRADE",
    peakElo: "Emeraude 3",
    objective: "Top 5 du challenge",
    dpmLink: "https://dpm.lol/player/firespirit"
  }, {
    name: "Ivyshade",
    catchphrase: "macacos fuegos - je flame pas, je bruuule",
    peakElo: "Gold",
    objective: "Platinum",
    dpmLink: "https://dpm.lol/player/firespirit"
  }, {
    name: "Kryzen",
    catchphrase: "la chienneté en lacoste ",
    peakElo: "Emeraude 1",
    objective: "Emeraude 3",
    dpmLink: "https://dpm.lol/player/firespirit"
  }, {
    name: "Reis",
    catchphrase: "Mes chaînes brisent les hauts gradés , l’émeraude n’est qu’une formalité",
    peakElo: "Platinum 2",
    objective: "Emeraude",
    dpmLink: "https://dpm.lol/player/firespirit"
  }, {
    name: "Kiro",
    catchphrase: "Road to Iron 4",
    peakElo: "Platinum 3",
    objective: "Gold 2",
    dpmLink: "https://dpm.lol/player/firespirit"
  },{
    name: "Very Angry Cat",
    catchphrase: "77% chat 33% sel grind 110% excrémentiel",
    peakElo: "Diamant 3",
    objective: "Platinum",
    dpmLink: "https://dpm.lol/player/firespirit"
  },{
    name: "Naos",
    catchphrase: "mounirmoons#keelb",
    peakElo: "Platinum 4",
    objective: "Emeraude",
    dpmLink: "https://dpm.lol/player/firespirit"
  },{
    name: "Dayen",
    catchphrase: "",
    peakElo: "",
    objective: "",
    dpmLink: "https://dpm.lol/player/firespirit"
  },{
    name: "Wazaks",
    catchphrase: "Id0ntgankbot",
    peakElo: "Emeraude 3",
    objective: "Platinum 4",
    dpmLink: "https://dpm.lol/player/firespirit"
  },{
    name: "Lastells",
    catchphrase: "rhamen la pas ou jte dose",
    peakElo: "Platinum 4",
    objective: "Platinum 4",
    dpmLink: "https://dpm.lol/player/firespirit"
  },{
    name: "Scar",
    catchphrase: "",
    peakElo: "Diamant 4",
    objective: "Emeraude 4",
    dpmLink: "https://dpm.lol/player/firespirit"
  },{
    name: "Jessim",
    catchphrase: "ZAcOnly",
    peakElo: "Platinum 2",
    objective: "Emeraude 1 - Diamant 4",
    dpmLink: "https://dpm.lol/player/firespirit"
  },
];

export default function ParticipantsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-dogelica">
            Participants
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Découvrez les joueurs qui participeront au Gorki SoloQ Challenge. 
          </p>
        </div>

        {/* Grille des participants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {participants.map((participant, index) => (
            <div 
              key={participant.name}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PlayerCard
                name={participant.name}
                catchphrase={participant.catchphrase}
                peakElo={participant.peakElo}
                objective={participant.objective}
                // dpmLink={participant.dpmLink}
              />
            </div>
          ))}
        </div>

        {/* Statistiques */}
        {/* <div className="mt-16 text-center">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 font-dogelica">
              Statistiques du Challenge
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-yellow-400 font-dogelica mb-2">
                  {participants.length}
                </div>
                <div className="text-gray-400">Participants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 font-dogelica mb-2">
                  3
                </div>
                <div className="text-gray-400">Challengers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 font-dogelica mb-2">
                  5
                </div>
                <div className="text-gray-400">Grandmasters</div>
              </div>
            </div>
          </div>
        </div> */}
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
