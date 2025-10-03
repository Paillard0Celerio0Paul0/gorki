'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PredictionForm from '@/components/admin/PredictionForm';
import PredictionsList from '@/components/admin/PredictionsList';
import { PredictionLimits } from '@/types/predictions';

export default function AdminPredictionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [limits, setLimits] = useState<PredictionLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [magicWord, setMagicWord] = useState('');
  const [newMagicWord, setNewMagicWord] = useState('');
  const [isSavingMagicWord, setIsSavingMagicWord] = useState(false);

  // Redirection si pas admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }
    
    if (!(session.user as { is_admin?: boolean }).is_admin) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Charger les limites et le mot magique
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les limites
        const limitsResponse = await fetch('/api/predictions/limits');
        if (limitsResponse.ok) {
          const limitsData = await limitsResponse.json();
          setLimits(limitsData);
        }

        // Charger le mot magique
        const magicWordResponse = await fetch('/api/magic-word');
        if (magicWordResponse.ok) {
          const magicWordData = await magicWordResponse.json();
          setMagicWord(magicWordData.magicWord || '');
          setNewMagicWord(magicWordData.magicWord || '');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if ((session?.user as { is_admin?: boolean })?.is_admin) {
      fetchData();
    }
  }, [session]);

  // Sauvegarder le mot magique
  const handleSaveMagicWord = async () => {
    if (!newMagicWord.trim()) {
      alert('Le mot magique ne peut pas être vide');
      return;
    }

    setIsSavingMagicWord(true);
    try {
      const response = await fetch('/api/magic-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: newMagicWord }),
      });

      if (response.ok) {
        const data = await response.json();
        setMagicWord(data.magicWord);
        alert('Mot magique mis à jour avec succès !');
      } else {
        const error = await response.json();
        alert('Erreur: ' + error.error);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSavingMagicWord(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!(session?.user as { is_admin?: boolean })?.is_admin) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-black text-white pt-14 sm:pt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
        {/* En-tête */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 font-dogelica">
            🎯 Gestion des Prédictions
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Crée et gére les prédictions journalières et hebdomadaires du challenge
          </p>
        </div>

        {/* Statistiques rapides */}
        {limits && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-blue-400 font-dogelica mb-2">
                    📅 Prédictions Journalières
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold text-white font-dogelica">
                    {limits.daily_created_today}/1
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">
                    {limits.can_create_daily ? 'Disponible' : 'Limite atteinte'}
                  </p>
                </div>
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                  limits.can_create_daily ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <span className="text-lg md:text-2xl">
                    {limits.can_create_daily ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-purple-400 font-dogelica mb-2">
                    📆 Prédictions Hebdomadaires
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold text-white font-dogelica">
                    {limits.weekly_created_this_week}/3
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">
                    {limits.can_create_weekly ? 'Disponible' : 'Limite atteinte'}
                  </p>
                </div>
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                  limits.can_create_weekly ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <span className="text-lg md:text-2xl">
                    {limits.can_create_weekly ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Mot Magique */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 font-dogelica flex items-center gap-2">
            🔮 Gestion du Mot Magique
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Définis le mot magique que les utilisateurs devront entrer dans la card &quot;???&quot; sur la page principale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mot magique actuel
              </label>
              <input
                type="text"
                value={magicWord}
                disabled
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none disabled:opacity-50 text-sm"
                placeholder="Aucun mot magique défini"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nouveau mot magique
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMagicWord}
                  onChange={(e) => setNewMagicWord(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors duration-300 text-sm"
                  placeholder="Entrez le nouveau mot magique..."
                />
                <button
                  onClick={handleSaveMagicWord}
                  disabled={isSavingMagicWord || !newMagicWord.trim()}
                  className="px-4 py-2 bg-blue-600 text-white font-bold font-dogelica rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSavingMagicWord ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sauvegarde...</span>
                    </div>
                  ) : (
                    'Sauvegarder'
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-xs">
              💡 <strong>Note:</strong> Le mot sera automatiquement normalisé (espaces supprimés, minuscules). 
              Les utilisateurs pourront l&apos;écrire avec des espaces et majuscules.
            </p>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-3 rounded-lg font-dogelica transition-all duration-300 ${
              activeTab === 'daily'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📅 Journalières
            <span className="ml-2 bg-blue-500 text-xs px-2 py-1 rounded-full">
              1 pt
            </span>
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-3 rounded-lg font-dogelica transition-all duration-300 ${
              activeTab === 'weekly'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📆 Hebdomadaires
            <span className="ml-2 bg-purple-500 text-xs px-2 py-1 rounded-full">
              3 pts
            </span>
          </button>
        </div>

        {/* Formulaire de création */}
        <div className="mb-8 sm:mb-12">
          <PredictionForm 
            type={activeTab}
            canCreate={
              activeTab === 'daily' 
                ? limits?.can_create_daily 
                : limits?.can_create_weekly
            }
            onCreated={() => {
              // Recharger les limites après création
              window.location.reload();
            }}
          />
        </div>

        {/* Liste des prédictions */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 font-dogelica">
            {activeTab === 'daily' ? 'Prédictions Journalières' : 'Prédictions Hebdomadaires'}
          </h2>
          <PredictionsList type={activeTab} />
        </div>

        {/* Bouton retour */}
        <div className="text-center mt-8 sm:mt-12">
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
