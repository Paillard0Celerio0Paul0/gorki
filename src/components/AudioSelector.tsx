'use client';

import { useState } from 'react';
import AudioRecorder from './AudioRecorder';

interface AudioSelectorProps {
  onAudioSelected: (audioType: 'file' | 'url', audioData: string | Blob) => void;
  onCancel: () => void;
}

// Fichiers audio prédéfinis disponibles
const PREDEFINED_AUDIOS = [
  {
    id: 'ilehilehileh',
    name: 'ilehilehileh',
    url: '/audio/ilehilehileh.mp3',
    emoji: '🎵'
  },
  {
    id: 'shambalewa', 
    name: 'shambalewa',
    url: '/audio/shambalewa.mp3',
    emoji: '🎶'
  }
];

export default function AudioSelector({ onAudioSelected, onCancel }: AudioSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<'predefined' | 'record' | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePredefinedAudio = (audioUrl: string) => {
    onAudioSelected('url', audioUrl);
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsUploading(true);
    
    try {
      // Créer un FormData pour uploader le fichier
      const formData = new FormData();
      const audioFile = new File([audioBlob], 'recording.mp3', { type: 'audio/mp3' });
      formData.append('audio', audioFile);

      // Uploader le fichier
      const response = await fetch('/api/audio/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onAudioSelected('url', data.url);
      } else {
        console.error('Erreur lors de l\'upload:', data.error);
        alert('Erreur lors de l\'upload du fichier audio');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload du fichier audio');
    } finally {
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <h3 className="text-xl font-bold text-white mb-4 font-dogelica">
          Upload en cours...
        </h3>
        <p className="text-gray-300">
          Traitement de votre enregistrement audio...
        </p>
      </div>
    );
  }

  if (selectedMode === 'record') {
    return (
      <AudioRecorder
        onRecordingComplete={handleRecordingComplete}
        onCancel={() => setSelectedMode(null)}
      />
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-white mb-6 font-dogelica text-center">
        🎵 Sélectionner un Audio
      </h3>

      <div className="space-y-4 mb-6">
        {/* Boutons de mode */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedMode('predefined')}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              selectedMode === 'predefined'
                ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-yellow-400/50'
            }`}
          >
            <div className="text-2xl mb-2">📁</div>
            <div className="font-bold font-dogelica">Audio prédéfini</div>
            <div className="text-sm opacity-75">Choisir parmi les fichiers disponibles</div>
          </button>

          <button
            onClick={() => setSelectedMode('record')}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              (selectedMode as string) === 'record'
                ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-yellow-400/50'
            }`}
          >
            <div className="text-2xl mb-2">🎤</div>
            <div className="font-bold font-dogelica">Enregistrer</div>
            <div className="text-sm opacity-75">Créer un enregistrement personnalisé</div>
          </button>
        </div>

        {/* Liste des audios prédéfinis */}
        {selectedMode === 'predefined' && (
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white font-dogelica">
              Fichiers audio disponibles :
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {PREDEFINED_AUDIOS.map((audio) => (
                <button
                  key={audio.id}
                  onClick={() => handlePredefinedAudio(audio.url)}
                  className="p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{audio.emoji}</span>
                    <div>
                      <div className="font-bold text-white font-dogelica">{audio.name}</div>
                      <div className="text-sm text-gray-400">Audio prédéfini</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white font-bold font-dogelica rounded-lg hover:bg-gray-500 transition-colors duration-300"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
