'use client';

import { useState } from 'react';
import { PredictionType } from '@/types/predictions';
import UserSelector from './UserSelector';

interface PredictionFormProps {
  type: 'daily' | 'weekly';
  canCreate?: boolean;
  onCreated: () => void;
}

export default function PredictionForm({ type, canCreate, onCreated }: PredictionFormProps) {
  const [text, setText] = useState('');
  const [mentionedUserId, setMentionedUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Le texte de la prédiction est requis');
      return;
    }

    if (!canCreate) {
      setError(`Limite atteinte pour les prédictions ${type === 'daily' ? 'journalières' : 'hebdomadaires'}`);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          type: type === 'daily' ? PredictionType.DAILY : PredictionType.WEEKLY,
          mentioned_user_id: mentionedUserId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setText('');
        setMentionedUserId(null);
        onCreated();
      } else {
        setError(data.error || 'Erreur lors de la création');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-bold text-white font-dogelica">
          Créer une prédiction {type === 'daily' ? 'journalière' : 'hebdomadaire'}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
          type === 'daily' 
            ? 'bg-blue-500 text-white' 
            : 'bg-purple-500 text-white'
        }`}>
          {type === 'daily' ? '1 point' : '3 points'}
        </span>
        {!canCreate && (
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-500 text-white">
            LIMITE ATTEINTE
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prediction-text" className="block text-sm font-medium text-gray-300 mb-2 font-dogelica">
            Texte de la prédiction
          </label>
          <textarea
            id="prediction-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Ex: "Le joueur X atteindra le rang Y aujourd'hui"`}
            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors duration-200 font-dogelica"
            rows={4}
            disabled={!canCreate || isSubmitting}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Maximum 500 caractères
            </p>
            <p className="text-xs text-gray-500">
              {text.length}/500
            </p>
          </div>
        </div>

        {/* Sélecteur d'utilisateur mentionné */}
        <UserSelector
          selectedUserId={mentionedUserId || undefined}
          onUserSelect={setMentionedUserId}
        />

        {/* Exemples de prédictions */}
        <div className="bg-gray-900/50 rounded-lg p-4">
          <h4 className="text-sm font-bold text-gray-300 mb-2 font-dogelica">
            💡 Exemples de prédictions :
          </h4>
          <ul className="text-sm text-gray-400 space-y-1">
            {type === 'daily' ? (
              <>
                <li>• "Le joueur X gagnera plus de 3 parties aujourd'hui"</li>
                <li>• "Au moins 2 joueurs atteindront un nouveau rang"</li>
                <li>• "Le joueur Y aura un taux de victoire supérieur à 60%"</li>
              </>
            ) : (
              <>
                <li>• "Le joueur X montera de 2 divisions cette semaine"</li>
                <li>• "Au moins 5 joueurs atteindront un nouveau rang"</li>
                <li>• "Le joueur Y aura le meilleur score de la semaine"</li>
              </>
            )}
          </ul>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 font-dogelica">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-400 font-dogelica">{success}</p>
          </div>
        )}

        {/* Bouton de soumission */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canCreate || isSubmitting || !text.trim()}
            className={`px-8 py-3 rounded-lg font-bold font-dogelica transition-all duration-300 ${
              canCreate && text.trim() && !isSubmitting
                ? type === 'daily'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Création...
              </div>
            ) : (
              `Créer la prédiction ${type === 'daily' ? 'journalière' : 'hebdomadaire'}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
