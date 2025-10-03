'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Prediction, PredictionType } from '@/types/predictions';
// import { getTimeRemaining } from '@/lib/prediction-utils';

interface PredictionCardProps {
  prediction: Prediction;
  onVoteSuccess: () => void;
}

export default function PredictionCard({ prediction, onVoteSuccess }: PredictionCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState('');

  const handleVote = async (vote: boolean) => {
    setIsVoting(true);
    setError('');

    try {
      const response = await fetch(`/api/predictions/${prediction.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote }),
      });

      const data = await response.json();

      if (response.ok) {
        onVoteSuccess();
      } else {
        setError(data.error || 'Erreur lors du vote');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setIsVoting(false);
    }
  };

  // const timeRemaining = prediction.voting_closes_at 
  //   ? getTimeRemaining(prediction.voting_closes_at)
  //   : null;

  const isVotingClosed = !prediction.voting_open || 
    (prediction.voting_closes_at && new Date() > new Date(prediction.voting_closes_at));

  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-xl p-4 md:p-6 border transition-all duration-300 ${
      prediction.userVote 
        ? 'border-yellow-500/50 bg-yellow-500/5' 
        : 'border-gray-700/50'
    }`}>
      {/* Texte de la prédiction - MISE EN AVANT */}
      <div className="mb-6">
        <p className="text-white text-xl md:text-2xl font-dogelica leading-relaxed mb-4 text-center">
        🔮 {prediction.text}
        </p>
        {/* Utilisateur mentionné */}
        {prediction.mentioned_user && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-1">
              {prediction.mentioned_user.avatar_url ? (
                <img
                  src={prediction.mentioned_user.avatar_url}
                  alt={prediction.mentioned_user.username}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
                  {prediction.mentioned_user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-white font-dogelica text-sm">
                {prediction.mentioned_user.username}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Informations secondaires */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 text-sm text-gray-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            prediction.type === PredictionType.DAILY 
              ? 'bg-gray-600 text-gray-300' 
              : 'bg-gray-600 text-gray-300'
          }`}>
            {prediction.type === PredictionType.DAILY ? '📅 Journalière' : '📆 Hebdomadaire'}
          </span>
          {isVotingClosed && (
            <span className="text-red-400 font-bold">
              🔒 VOTES FERMÉS
            </span>
          )}
        </div>
        
      </div>


      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
          <p className="text-red-400 text-sm font-dogelica">{error}</p>
        </div>
      )}

      {/* Boutons de vote */}
      {!isVotingClosed && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => handleVote(true)}
            disabled={isVoting || !!prediction.userVote}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-dogelica transition-all duration-300 text-sm ${
              prediction.userVote?.vote === true
                ? 'bg-yellow-600 text-black border-2 border-yellow-400 cursor-default'
                : prediction.userVote
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                : isVoting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-yellow-600 hover:text-black border border-gray-600'
            }`}
          >
            {isVoting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Vote...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">✅ OUI</span>
                {prediction.userVote?.vote === true && (
                  <span className="text-xs bg-black/20 text-black px-1 py-0.5 rounded-full font-bold">TON VOTE</span>
                )}
                {prediction.userVote && prediction.userVote.vote !== true && (
                  <span className="text-xs bg-gray-500 px-1 py-0.5 rounded-full">VOTÉ</span>
                )}
              </div>
            )}
          </button>
          
          <button
            onClick={() => handleVote(false)}
            disabled={isVoting || !!prediction.userVote}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-dogelica transition-all duration-300 text-sm ${
              prediction.userVote?.vote === false
                ? 'bg-yellow-600 text-black border-2 border-yellow-400 cursor-default'
                : prediction.userVote
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                : isVoting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-yellow-600 hover:text-black border border-gray-600'
            }`}
          >
            {isVoting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Vote...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">❌ NON</span>
                {prediction.userVote?.vote === false && (
                  <span className="text-xs bg-black/20 text-black px-1 py-0.5 rounded-full font-bold">TON VOTE</span>
                )}
                {prediction.userVote && prediction.userVote.vote !== false && (
                  <span className="text-xs bg-gray-500 px-1 py-0.5 rounded-full">VOTÉ</span>
                )}
              </div>
            )}
          </button>
        </div>
      )}

      {/* Message si votes fermés ou déjà voté */}
      {isVotingClosed && (
        <div className="bg-gray-800/50 rounded-lg p-2 text-center">
          <p className="text-gray-400 font-dogelica text-sm">
            {prediction.userVote 
              ? `Tu as voté "${prediction.userVote.vote ? 'OUI' : 'NON'}" - En attente du résultat`
              : 'Les votes sont fermés - Tu n\'as pas pu voter à temps'
            }
          </p>
        </div>
      )}

      {/* Message si déjà voté mais votes encore ouverts */}
      {!isVotingClosed && prediction.userVote && (
        <div className=" mt-4 bg-blue-500/20 border border-blue-500/50 rounded-lg p-2 text-center">
          <p className="text-blue-400 font-dogelica text-sm">
            ✅ Tu as déjà voté &quot;{prediction.userVote.vote ? 'OUI' : 'NON'}&quot; - Vote définitif
          </p>
        </div>
      )}

      {/* Barre de progression des votes */}
      {prediction.totalVotes && prediction.totalVotes > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>OUI ({prediction.yesVotes})</span>
            <span>NON ({prediction.noVotes})</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{
                background: `linear-gradient(to right, 
                  #10b981 0%, 
                  #10b981 ${(prediction.yesVotes! / prediction.totalVotes) * 100}%, 
                  #ef4444 ${(prediction.yesVotes! / prediction.totalVotes) * 100}%, 
                  #ef4444 100%)`
              }}
            />
          </div>
        </div>
      )}

      {/* Avatars des votants */}
      {prediction.allVotes && Array.isArray(prediction.allVotes) && prediction.allVotes.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-gray-400 mb-2">Votants:</div>
          <div className="flex flex-wrap gap-2">
            {prediction.allVotes.map((vote) => (
              <div
                key={vote.id}
                className="flex items-center gap-1 bg-gray-800/50 rounded-full px-2 py-1"
                title={`${vote.user?.username} a voté ${vote.vote ? 'OUI' : 'NON'}`}
              >
                {vote.user?.avatar_url ? (
                  <Image
                    src={vote.user.avatar_url}
                    alt={vote.user.username || 'Avatar'}
                    width={16}
                    height={16}
                    className="w-4 h-4 rounded-full"
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
                    {vote.user?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <span className={`text-xs font-bold ${vote.vote ? 'text-green-400' : 'text-red-400'}`}>
                  {vote.vote ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
