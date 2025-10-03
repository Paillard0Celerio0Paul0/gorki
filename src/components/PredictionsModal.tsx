'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PredictionCard from '@/components/predictions/PredictionCard';
import PredictionsLeaderboard from '@/components/predictions/PredictionsLeaderboard';
import { Prediction, PredictionType } from '@/types/predictions';

interface PredictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PredictionsModal({ isOpen, onClose }: PredictionsModalProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les prédictions quand la modal s'ouvre
  useEffect(() => {
    if (isOpen && session?.user) {
      fetchPredictions();
    }
  }, [isOpen, activeTab, session]);

  const fetchPredictions = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch(`/api/predictions?type=${activeTab === 'daily' ? PredictionType.DAILY : PredictionType.WEEKLY}&active=true`);
      
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

  const handleVoteSuccess = () => {
    // Recharger les prédictions après un vote
    fetchPredictions();
  };

  const handleClose = () => {
    onClose();
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-sm rounded-xl border border-gray-800/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
          <h2 className="text-2xl font-bold text-white font-dogelica">
            🔮 Prédictions du Challenge
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Onglets */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 px-4 py-3 rounded-lg font-dogelica transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'daily'
                  ? 'bg-yellow-600 text-black shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              📅 Journalières
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === 'daily' 
                  ? 'bg-black/20 text-black' 
                  : 'bg-gray-600 text-gray-300'
              }`}>
                1 pt
              </span>
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 px-4 py-3 rounded-lg font-dogelica transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'weekly'
                  ? 'bg-yellow-600 text-black shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              📆 Hebdomadaires
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === 'weekly' 
                  ? 'bg-black/20 text-black' 
                  : 'bg-gray-600 text-gray-300'
              }`}>
                3 pts
              </span>
            </button>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 font-dogelica">{error}</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Chargement des prédictions...</p>
            </div>
          )}

          {/* Affichage des prédictions */}
          {!isLoading && (
            <>
              {(() => {
                // Filtrer les prédictions votables (pas encore votées et votes ouverts)
                const votablePredictions = predictions.filter(prediction => {
                  const isVotingClosed = !prediction.voting_open || 
                    (prediction.voting_closes_at && new Date() > new Date(prediction.voting_closes_at));
                  return !prediction.userVote && !isVotingClosed;
                });

                if (votablePredictions.length === 0) {
                  return (
                    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 text-center">
                      <div className="text-6xl mb-4">🔮</div>
                      <h3 className="text-xl font-bold text-white mb-3 font-dogelica">
                        Aucune prédiction {activeTab === 'daily' ? 'journalière' : 'hebdomadaire'} à voter
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {predictions.length === 0 
                          ? `L'admin n'a pas encore créé de prédiction pour ${activeTab === 'daily' ? 'aujourd\'hui' : 'cette semaine'}.`
                          : 'Tu as déjà voté sur toutes les prédictions disponibles ou les votes sont fermés.'
                        }
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white font-dogelica">
                        Prédictions {activeTab === 'daily' ? 'Journalières' : 'Hebdomadaires'} à Voter
                      </h3>
                      <span className="text-sm text-gray-400">
                        {votablePredictions.length} prédiction{votablePredictions.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {votablePredictions.map((prediction) => (
                      <PredictionCard
                        key={prediction.id}
                        prediction={prediction}
                        onVoteSuccess={handleVoteSuccess}
                      />
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
