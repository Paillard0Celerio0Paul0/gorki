'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserScore } from '@/types/predictions';

export default function PredictionsLeaderboard() {
  const { data: session } = useSession();
  const [scores, setScores] = useState<UserScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/predictions/leaderboard');
        
        if (response.ok) {
          const data = await response.json();
          setScores(data.slice(0, 5)); // Top 5 seulement
        }
      } catch (error) {
        console.error('Erreur lors du chargement du leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  if (isLoading) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
        <div className="text-4xl mb-3">🏆</div>
        <h3 className="text-lg font-bold text-white mb-2 font-dogelica">
          Classement des Prédictions
        </h3>
        <p className="text-gray-400 text-sm">
          Vote sur tes premières prédictions pour apparaître ici !
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white font-dogelica">
          Classement du plus grand sorcier
        </h3>
        <span className="text-xs text-gray-400">
          {scores.length} joueur{scores.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {scores.map((score, index) => {
          const isCurrentUser = (session as { user?: { id: string } }).user?.id === score.user_id;
          return (
            <div
              key={score.user_id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                isCurrentUser 
                  ? 'bg-yellow-500/10 border border-yellow-500/30' 
                  : 'bg-gray-800/30 hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-lg">{getRankEmoji(index)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-dogelica">
                      {isCurrentUser ? 'Toi' : `Joueur #${score.user_id.slice(-4)}`}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {score.daily_total + score.weekly_total} prédiction{(score.daily_total + score.weekly_total) > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400 font-dogelica">
                  {score.total_points_earned}
                </div>
                <div className="text-xs text-gray-400">pts</div>
              </div>
            </div>
          );
        })}
      </div>

      {scores.length >= 3 && (
        <div className="mt-4 pt-3 border-t border-gray-700/50 text-center">
          <a
            href="/predictions/leaderboard"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            Voir le classement complet →
          </a>
        </div>
      )}
    </div>
  );
}
