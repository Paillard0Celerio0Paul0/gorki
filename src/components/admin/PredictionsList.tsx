'use client';

import { useState, useEffect } from 'react';
import { Prediction, PredictionType } from '@/types/predictions';

interface PredictionsListProps {
  type: 'daily' | 'weekly';
}

export default function PredictionsList({ type }: PredictionsListProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/predictions?type=${type === 'daily' ? PredictionType.DAILY : PredictionType.WEEKLY}`);
        
        if (response.ok) {
          const data = await response.json();
          setPredictions(data);
        } else {
          setError('Erreur lors du chargement des prédictions');
        }
      } catch {
        setError('Erreur de connexion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [type]);

  const handleValidate = async (predictionId: string, correctAnswer: boolean) => {
    try {
      const response = await fetch(`/api/predictions/${predictionId}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correct_answer: correctAnswer }),
      });

      if (response.ok) {
        // Recharger la liste
        window.location.reload();
      } else {
        const data = await response.json();
        alert(`Erreur: ${data.error}`);
      }
    } catch {
      alert('Erreur lors de la validation');
    }
  };

  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const getTimeRemaining = (endDate: string | Date) => {
    try {
      const now = new Date();
      const end = new Date(endDate);
      
      if (isNaN(end.getTime())) return 'Date invalide';
      
      const diff = end.getTime() - now.getTime();
      
      if (diff <= 0) return 'Fermé';
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days}j ${hours % 24}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    } catch {
      return 'Erreur';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des prédictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
        <p className="text-red-400 font-dogelica">{error}</p>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-white mb-2 font-dogelica">
          Aucune prédiction {type === 'daily' ? 'journalière' : 'hebdomadaire'}
        </h3>
        <p className="text-gray-400">
          Crée ta première prédiction avec le formulaire ci-dessus
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {predictions.map((prediction) => (
        <div
          key={prediction.id}
          className={`bg-black/60 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
            prediction.is_validated
              ? 'border-green-500/50 bg-green-500/5'
              : prediction.voting_open
              ? 'border-yellow-500/50 bg-yellow-500/5'
              : 'border-gray-800/50'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  prediction.type === PredictionType.DAILY 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-purple-500 text-white'
                }`}>
                  {prediction.type === PredictionType.DAILY ? '📅 Journalière' : '📆 Hebdomadaire'}
                </span>
                <span className="text-yellow-400 font-bold text-sm">
                  {prediction.points} pt{prediction.points > 1 ? 's' : ''}
                </span>
                {prediction.is_validated && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    prediction.correct_answer 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {prediction.correct_answer ? '✅ VRAIE' : '❌ FAUSSE'}
                  </span>
                )}
              </div>
              
              <p className="text-white text-lg font-dogelica mb-3">
                {prediction.text}
              </p>
              
              {/* Utilisateur mentionné */}
              {prediction.mentioned_user && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm">Mentionné:</span>
                  <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-2 py-1">
                    {prediction.mentioned_user.avatar_url ? (
                      <img
                        src={prediction.mentioned_user.avatar_url}
                        alt={prediction.mentioned_user.username}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
                        {prediction.mentioned_user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-white font-dogelica text-sm">
                      {prediction.mentioned_user.username}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-400 space-y-1">
                <p>Créée le {formatDate(prediction.created_at)}</p>
                {prediction.voting_closes_at && (
                  <p>
                    Votes se ferment dans: {getTimeRemaining(prediction.voting_closes_at)}
                  </p>
                )}
                <p>Total votes: {prediction.totalVotes || 0} | OUI: {prediction.yesVotes || 0} | NON: {prediction.noVotes || 0}</p>
                
                {/* Avatars des votants */}
                {prediction.allVotes && Array.isArray(prediction.allVotes) && prediction.allVotes.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1">Votants:</div>
                    <div className="flex flex-wrap gap-1">
                      {prediction.allVotes.map((vote: any) => (
                        <div
                          key={vote.id}
                          className="flex items-center gap-1 bg-gray-800/50 rounded-full px-2 py-1"
                          title={`${vote.user?.username} a voté ${vote.vote ? 'OUI' : 'NON'}`}
                        >
                          {vote.user?.avatar_url ? (
                            <img
                              src={vote.user.avatar_url}
                              alt={vote.user.username}
                              className="w-3 h-3 rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/default-avatar.png';
                              }}
                            />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">
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
            </div>
          </div>

          {/* Actions admin */}
          {!prediction.is_validated && prediction.voting_open && (
            <div className="flex gap-3 pt-4 border-t border-gray-700/50">
              <button
                onClick={() => handleValidate(prediction.id, true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-dogelica"
              >
                ✅ Valider comme VRAIE
              </button>
              <button
                onClick={() => handleValidate(prediction.id, false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-dogelica"
              >
                ❌ Valider comme FAUSSE
              </button>
            </div>
          )}

          {prediction.is_validated && (
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-sm text-gray-400">
                ✅ Validée le {formatDate(prediction.validated_at!)} - 
                Résultat: {prediction.correct_answer ? 'VRAIE' : 'FAUSSE'}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
