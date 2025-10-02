'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserScore } from '@/types/predictions';

export default function UserScoreCard() {
  const { data: session } = useSession();
  const [score, setScore] = useState<UserScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      if (!(session as { user?: { id: string } }).user?.id) return;

      try {
        const response = await fetch(`/api/users/${(session as { user?: { id: string } }).user?.id}/score`);
        if (response.ok) {
          const data = await response.json();
          setScore(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du score:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScore();
  }, [session]);

  if (!session?.user || isLoading) {
    return (
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 text-center">
        <div className="text-4xl mb-2">🎯</div>
        <h3 className="text-lg font-bold text-white mb-2 font-dogelica">
          Ton Score
        </h3>
        <p className="text-gray-400 text-sm">
          Vote sur tes premières prédictions pour voir ton score !
        </p>
      </div>
    );
  }

  const totalPredictions = score.daily_total + score.weekly_total;
  const accuracyPercentage = totalPredictions > 0 
    ? Math.round((score.total_points_earned / score.total_points_possible) * 100)
    : 0;

  const getRankEmoji = (accuracy: number) => {
    if (accuracy >= 90) return '🏆';
    if (accuracy >= 80) return '🥇';
    if (accuracy >= 70) return '🥈';
    if (accuracy >= 60) return '🥉';
    if (accuracy >= 50) return '🎯';
    return '📈';
  };

  const getRankTitle = (accuracy: number) => {
    if (accuracy >= 90) return 'Prophète';
    if (accuracy >= 80) return 'Oracle';
    if (accuracy >= 70) return 'Prédicteur';
    if (accuracy >= 60) return 'Visionnaire';
    if (accuracy >= 50) return 'Intuitif';
    return 'Apprenti';
  };

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-white font-dogelica">
          📊 Ton Score Personnel
        </h3>
        <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
          <div className="text-xl sm:text-2xl">{getRankEmoji(accuracyPercentage)}</div>
          <div className="text-xs sm:text-sm text-gray-400">{getRankTitle(accuracyPercentage)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {/* Points totaux */}
        <div className="text-center p-3 md:p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <div className="text-lg md:text-2xl font-bold text-yellow-400 font-dogelica">
            {score.total_points_earned}
          </div>
          <div className="text-xs text-gray-400">Points gagnés</div>
        </div>

        {/* Précision */}
        <div className="text-center p-3 md:p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div className="text-lg md:text-2xl font-bold text-blue-400 font-dogelica">
            {accuracyPercentage}%
          </div>
          <div className="text-xs text-gray-400">Précision</div>
        </div>

        {/* Prédictions correctes */}
        <div className="text-center p-3 md:p-4 bg-green-500/10 rounded-lg border border-green-500/30">
          <div className="text-lg md:text-2xl font-bold text-green-400 font-dogelica">
            {score.daily_correct + score.weekly_correct}
          </div>
          <div className="text-xs text-gray-400">Correctes</div>
        </div>

        {/* Total prédictions */}
        <div className="text-center p-3 md:p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <div className="text-lg md:text-2xl font-bold text-purple-400 font-dogelica">
            {score.daily_total + score.weekly_total}
          </div>
          <div className="text-xs text-gray-400">Total votes</div>
        </div>
      </div>

      {/* Détail par type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-blue-500/10 rounded-lg p-3 md:p-4 border border-blue-500/30">
          <h4 className="text-blue-400 font-bold mb-2 font-dogelica text-sm md:text-base">📅 Journalières</h4>
          <div className="text-xs md:text-sm text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Correctes:</span>
              <span className="text-white">{score.daily_correct}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="text-white">{score.daily_total}</span>
            </div>
            <div className="flex justify-between">
              <span>Points:</span>
              <span className="text-yellow-400">{score.daily_correct * 1}</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-500/10 rounded-lg p-3 md:p-4 border border-purple-500/30">
          <h4 className="text-purple-400 font-bold mb-2 font-dogelica text-sm md:text-base">📆 Hebdomadaires</h4>
          <div className="text-xs md:text-sm text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Correctes:</span>
              <span className="text-white">{score.weekly_correct}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="text-white">{score.weekly_total}</span>
            </div>
            <div className="flex justify-between">
              <span>Points:</span>
              <span className="text-yellow-400">{score.weekly_correct * 3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progression */}
      {score.total_points_possible > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progression</span>
            <span>{score.total_points_earned}/{score.total_points_possible} points</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(score.total_points_earned / score.total_points_possible) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
