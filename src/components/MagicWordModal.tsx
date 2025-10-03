'use client';

import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react'; // Non utilisé pour l'instant
import AudioSelector from './AudioSelector';

interface User {
  id: string;
  username: string;
  avatar_url: string | null;
  discord_id: string;
}

interface MagicWordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MagicWordModal({ isOpen, onClose }: MagicWordModalProps) {
  // const { data: session } = useSession(); // Non utilisé pour l'instant
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<{ type: 'file' | 'url', data: string | Blob } | null>(null);
  const [showAudioSelector, setShowAudioSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Charger la liste des utilisateurs
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!selectedUser || !selectedAudio) {
      setError('Veuillez sélectionner un utilisateur et un audio');
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      let response: Response;

      if (selectedAudio.type === 'url') {
        // Pour les URLs, utiliser JSON
        const payload = {
          targetUserId: selectedUser,
          audioType: 'url' as const,
          audioUrl: selectedAudio.data as string,
        };

        response = await fetch('/api/discord/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Pour les fichiers, utiliser FormData
        const formData = new FormData();
        formData.append('targetUserId', selectedUser);
        formData.append('audioType', 'file');
        formData.append('audioFile', selectedAudio.data as Blob, 'audio.mp3');

        response = await fetch('/api/discord/notify', {
          method: 'POST',
          body: formData,
        });
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess('Notification envoyée avec succès !');
        // Reset form
        setSelectedUser(null);
        setSelectedAudio(null);
        setShowAudioSelector(false);
      } else {
        setError(data.error || 'Erreur lors de l\'envoi de la notification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de l\'envoi de la notification');
    } finally {
      setIsSending(false);
    }
  };

  const handleAudioSelected = (audioType: 'file' | 'url', audioData: string | Blob) => {
    setSelectedAudio({ type: audioType, data: audioData });
    setShowAudioSelector(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-sm rounded-xl border border-yellow-400/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-yellow-400/30">
          <h2 className="text-2xl font-bold text-yellow-400 font-dogelica flex items-center gap-2">
            ✨ Bravo sorcier - Utilise un sortilège
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {showAudioSelector ? (
            <AudioSelector
              onAudioSelected={handleAudioSelected}
              onCancel={() => setShowAudioSelector(false)}
            />
          ) : (
            <>
              {/* Messages d'état */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                  <p className="text-green-300">{success}</p>
                </div>
              )}

              {/* Sélection de l'utilisateur */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 font-dogelica">
                  👤 Sélectionner un utilisateur
                </h3>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-gray-300">Chargement des utilisateurs...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => setSelectedUser(user.id)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                          selectedUser === user.id
                            ? 'border-yellow-400 bg-yellow-400/10'
                            : 'border-gray-600 bg-gray-800/50 hover:border-yellow-400/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar_url || '/default-avatar.png'}
                            alt={user.username}
                            className="w-10 h-10 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-avatar.png';
                            }}
                          />
                          <div>
                            <div className="font-bold text-white font-dogelica">{user.username}</div>
                            <div className="text-sm text-gray-400">Discord ID: {user.discord_id}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sélection de l'audio */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 font-dogelica">
                  🎵 Sélectionner un audio
                </h3>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAudioSelector(true)}
                    className="px-6 py-3 bg-blue-600/20 text-blue-400 font-bold font-dogelica rounded-lg border border-blue-400/30 hover:bg-blue-600/30 hover:text-blue-300 transition-all duration-300"
                  >
                    {selectedAudio ? 'Modifier l\'audio' : 'Choisir un audio'}
                  </button>
                  
                  {selectedAudio && (
                    <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <span className="text-green-400 font-medium">
                        ✅ Audio sélectionné ({selectedAudio.type === 'url' ? 'URL' : 'Fichier'})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-600 text-white font-bold font-dogelica rounded-lg hover:bg-gray-500 transition-colors duration-300"
                >
                  Annuler
                </button>
                
                <button
                  onClick={handleSendNotification}
                  disabled={!selectedUser || !selectedAudio || isSending}
                  className="px-8 py-3 bg-yellow-600 text-black font-bold font-dogelica rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      <span>Envoi...</span>
                    </div>
                  ) : (
                    'Envoyer la notification'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
