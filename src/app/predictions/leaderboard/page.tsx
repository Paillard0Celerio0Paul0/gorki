'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserScore } from '@/types/predictions';

export default function PredictionsLeaderboardPage() {
  const router = useRouter();
  const [scores, setScores] = useState<UserScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'accuracy'>('points');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/predictions/leaderboard');
        
        if (response.ok) {
          const data = await response.json();
          setScores(data);
        } else {
          setError('Erreur lors du chargement du classement');
        }
      } catch (error) {
        setError('Erreur de connexion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const sortedScores = [...scores].sort((a, b) => {
    if (sortBy === 'points') {
      return b.total_points_earned - a.total_points_earned;
    } else {
      return b.accuracy_percentage - a.accuracy_percentage;
    }
  });

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankTitle = (accuracy: number) => {
    if (accuracy >= 90) return 'Prophète';
    if (accuracy >= 80) return 'Oracle';
    if (accuracy >= 70) return 'Prédicteur';
    if (accuracy >= 60) return 'Visionnaire';
    if (accuracy >= 50) return 'Intuitif';
    return 'Apprenti';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du classement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-dogelica">
            🏆 Classement des Prédictions
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Qui sont les meilleurs prédicteurs du challenge ?
          </p>
        </div>

        {/* Contrôles de tri */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-1 md:p-2 border border-gray-800/50 w-full max-w-md">
            <button
              onClick={() => setSortBy('points')}
              className={`w-1/2 px-3 md:px-4 py-2 rounded-lg font-dogelica transition-colors duration-200 text-sm md:text-base ${
                sortBy === 'points'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              🎯 <span className="hidden sm:inline">Par Points</span><span className="sm:hidden">Points</span>
            </button>
            <button
              onClick={() => setSortBy('accuracy')}
              className={`w-1/2 px-3 md:px-4 py-2 rounded-lg font-dogelica transition-colors duration-200 text-sm md:text-base ${
                sortBy === 'accuracy'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              📊 <span className="hidden sm:inline">Par Précision</span><span className="sm:hidden">Précision</span>
            </button>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400 font-dogelica">{error}</p>
          </div>
        )}

        {/* Classement */}
        {sortedScores.length === 0 ? (
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-12 border border-gray-800/50 text-center">
            <div className="text-8xl mb-6">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-4 font-dogelica">
              Aucun score disponible
            </h3>
            <p className="text-gray-400">
              Les joueurs doivent voter sur des prédictions validées pour apparaître ici.
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {/* Podium */}
            {sortedScores.slice(0, 3).map((score, index) => (
              <div
                key={score.user_id}
                className={`bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-yellow-500/50 ${
                  index === 0 ? 'ring-2 ring-yellow-400/50' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-2xl md:text-4xl">{getRankEmoji(index)}</div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white font-dogelica">
                        Joueur #{score.user_id.slice(-4)}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-400">
                        {getRankTitle(score.accuracy_percentage)} • {score.daily_total + score.weekly_total} prédictions
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xl md:text-2xl font-bold text-yellow-400 font-dogelica">
                      {sortBy === 'points' ? score.total_points_earned : Math.round(score.accuracy_percentage)}%
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">
                      {sortBy === 'points' ? 'Points' : 'Précision'}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Reste du classement */}
            {sortedScores.slice(3).map((score, index) => (
              <div
                key={score.user_id}
                className="bg-black/60 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-800/50 hover:border-gray-700/50 transition-colors duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-base md:text-lg text-gray-400">#{index + 4}</div>
                    <div>
                      <h4 className="text-base md:text-lg font-bold text-white font-dogelica">
                        Joueur #{score.user_id.slice(-4)}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-400">
                        {getRankTitle(score.accuracy_percentage)} • {score.daily_total + score.weekly_total} prédictions
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-lg md:text-xl font-bold text-yellow-400 font-dogelica">
                      {sortBy === 'points' ? score.total_points_earned : Math.round(score.accuracy_percentage)}%
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">
                      {sortBy === 'points' ? 'Points' : 'Précision'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistiques globales */}
        {scores.length > 0 && (
          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50 text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 font-dogelica mb-2">
                {scores.length}
              </div>
              <div className="text-sm md:text-base text-gray-400">Joueurs actifs</div>
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50 text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-400 font-dogelica mb-2">
                {scores.reduce((sum, score) => sum + score.daily_total + score.weekly_total, 0)}
              </div>
              <div className="text-sm md:text-base text-gray-400">Votes totaux</div>
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50 text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-400 font-dogelica mb-2">
                {Math.round(scores.reduce((sum, score) => sum + score.accuracy_percentage, 0) / scores.length)}%
              </div>
              <div className="text-sm md:text-base text-gray-400">Précision moyenne</div>
            </div>
          </div>
        )}

        {/* Bouton retour */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/predictions')}
            className="inline-block px-6 py-3 bg-yellow-400/20 text-yellow-400 font-bold font-dogelica rounded-lg border border-yellow-400/30 hover:bg-yellow-400/30 hover:text-yellow-300 transition-all duration-300"
          >
            ← Retour aux Prédictions
          </button>
        </div>
      </div>
    </div>
  );
}
