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

  // Redirection si pas admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }
    
    if (!session.user.is_admin) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Charger les limites
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const response = await fetch('/api/predictions/limits');
        if (response.ok) {
          const data = await response.json();
          setLimits(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des limites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.is_admin) {
      fetchLimits();
    }
  }, [session]);

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

  if (!session?.user?.is_admin) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-dogelica">
            🎯 Gestion des Prédictions
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Crée et gére les prédictions journalières et hebdomadaires du challenge
          </p>
        </div>

        {/* Statistiques rapides */}
        {limits && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
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

        {/* Onglets */}
        <div className="flex space-x-4 mb-8">
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
        <div className="mb-12">
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
          <h2 className="text-2xl font-bold text-white mb-6 font-dogelica">
            {activeTab === 'daily' ? 'Prédictions Journalières' : 'Prédictions Hebdomadaires'}
          </h2>
          <PredictionsList type={activeTab} />
        </div>

        {/* Bouton retour */}
        <div className="text-center mt-12">
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
