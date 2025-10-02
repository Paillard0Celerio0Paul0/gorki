'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PredictionCard from '@/components/predictions/PredictionCard';
import PredictionsLeaderboard from '@/components/predictions/PredictionsLeaderboard';
import { Prediction, PredictionType } from '@/types/predictions';

export default function PredictionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Messages constants pour éviter les problèmes d'échappement
  const noDailyPrediction = "L'admin n'a pas encore créé de prédiction pour aujourd'hui.";
  const noWeeklyPrediction = "L'admin n'a pas encore créé de prédiction pour cette semaine.";

  // Redirection si pas connecté
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  // Charger les prédictions
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
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

    if (session?.user) {
      fetchPredictions();
    }
  }, [activeTab, session]);

  const handleVoteSuccess = () => {
    // Recharger les prédictions après un vote
    window.location.reload();
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des prédictions...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-dogelica">
            🔮 Prédictions du Challenge
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Vote sur les prédictions et gagne des points !
          </p>
        </div>

        {/* Mini-Leaderboard des Prédictions */}
        <div className="mb-8">
          <PredictionsLeaderboard />
        </div>

        {/* Onglets avec indicateurs de points */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 md:mb-8">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-lg font-dogelica transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'daily'
                ? 'bg-yellow-600 text-black shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📅 <span className="hidden sm:inline">Prédictions Journalières</span><span className="sm:hidden">Quotidien</span>
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
            className={`flex-1 px-4 sm:px-6 py-3 rounded-lg font-dogelica transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'weekly'
                ? 'bg-yellow-600 text-black shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📆 <span className="hidden sm:inline">Prédictions Hebdomadaires</span><span className="sm:hidden">Hebdo</span>
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

        {/* Affichage des prédictions */}
        {predictions.length === 0 ? (
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-12 border border-gray-800/50 text-center">
            <div className="text-8xl mb-6">🔮</div>
            <h3 className="text-2xl font-bold text-white mb-4 font-dogelica">
              Aucune prédiction {activeTab === 'daily' ? 'journalière' : 'hebdomadaire'} active
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'daily' 
                ? noDailyPrediction
                : noWeeklyPrediction
              }
            </p>
            <p className="text-sm text-gray-500">
              Reviens plus tard ou vérifie les prédictions {activeTab === 'daily' ? 'hebdomadaires' : 'journalières'} !
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white font-dogelica">
                <span className="hidden sm:inline">
                  {activeTab === 'daily' ? 'Prédictions Journalières' : 'Prédictions Hebdomadaires'} Actives
                </span>
                <span className="sm:hidden">
                  {activeTab === 'daily' ? 'Journalières' : 'Hebdomadaires'}
                </span>
              </h2>
              <span className="text-sm text-gray-400">
                {predictions.length} prédiction{predictions.length > 1 ? 's' : ''}
              </span>
            </div>
            
            {predictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                prediction={prediction}
                onVoteSuccess={handleVoteSuccess}
              />
            ))}
          </div>
        )}

        {/* Informations sur le système de points */}
        <div className="mt-8 md:mt-12 bg-black/40 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-700/50">
          <h3 className="text-base md:text-lg font-bold text-white mb-4 font-dogelica">
            💡 Comment ça marche ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm text-gray-400">
            <div>
              <h4 className="text-yellow-400 font-bold mb-2 text-sm md:text-base">📅 Prédictions Journalières (1 point)</h4>
              <ul className="space-y-1 text-xs md:text-sm">
                <li>• Vote ouvert jusqu&apos;à 23h59</li>
                <li>• Résultat validé le lendemain</li>
                <li>• 1 point si tu as raison</li>
                <li>• ⚠️ Un seul vote par prédiction</li>
              </ul>
            </div>
            <div>
              <h4 className="text-yellow-400 font-bold mb-2 text-sm md:text-base">📆 Prédictions Hebdomadaires (3 points)</h4>
              <ul className="space-y-1 text-xs md:text-sm">
                <li>• Vote ouvert toute la semaine</li>
                <li>• Résultat validé le dimanche</li>
                <li>• 3 points si tu as raison</li>
                <li>• ⚠️ Un seul vote par prédiction</li>
              </ul>
            </div>
          </div>
          
          {/* Règle importante */}
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-yellow-400 text-base md:text-lg">⚠️</span>
              <h4 className="text-yellow-400 font-bold font-dogelica text-sm md:text-base">Règle Importante</h4>
            </div>
            <p className="text-yellow-300 text-xs md:text-sm leading-relaxed">
              <strong>Un vote est définitif !</strong> Une fois que tu as voté sur une prédiction, 
              tu ne peux plus changer ton choix. Réfléchis bien avant de voter !
            </p>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="inline-block px-6 py-3 bg-yellow-400/20 text-yellow-400 font-bold font-dogelica rounded-lg border border-yellow-400/30 hover:bg-yellow-400/30 hover:text-yellow-300 transition-all duration-300"
          >
            ← Retour à l&apos;accueil
          </button>
        </div>
      </div>
    </div>
  );
}
