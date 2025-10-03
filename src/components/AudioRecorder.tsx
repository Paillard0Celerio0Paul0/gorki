'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export default function AudioRecorder({ onRecordingComplete, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Demander la permission d'accès au microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setHasPermission(true);
      })
      .catch((err) => {
        console.error('Erreur d\'accès au microphone:', err);
        setHasPermission(false);
        setError('Accès au microphone refusé. Veuillez autoriser l\'accès au microphone.');
      });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        onRecordingComplete(audioBlob);
        
        // Arrêter tous les tracks du stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);

      // Démarrer le timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', err);
      setError('Erreur lors du démarrage de l\'enregistrement');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === false) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-400 text-6xl mb-4">🎤</div>
        <h3 className="text-xl font-bold text-white mb-4 font-dogelica">
          Accès au microphone refusé
        </h3>
        <p className="text-gray-300 mb-6">
          {error || 'Veuillez autoriser l&apos;accès au microphone pour enregistrer un message audio.'}
        </p>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 text-white font-bold font-dogelica rounded-lg hover:bg-gray-500 transition-colors duration-300"
        >
          Fermer
        </button>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-gray-300">Demande d&apos;accès au microphone...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <div className="text-6xl mb-4">🎤</div>
      
      <h3 className="text-xl font-bold text-white mb-4 font-dogelica">
        Enregistrement Audio
      </h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6">
        {isRecording ? (
          <div className="space-y-4">
            <div className="text-3xl font-bold text-red-400 font-dogelica">
              {formatTime(recordingTime)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-medium">Enregistrement en cours...</span>
            </div>
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-600 text-white font-bold font-dogelica rounded-lg hover:bg-red-500 transition-colors duration-300"
            >
              Arrêter l&apos;enregistrement
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300">
              Cliquez sur le bouton pour commencer l&apos;enregistrement de votre message audio.
            </p>
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-green-600 text-white font-bold font-dogelica rounded-lg hover:bg-green-500 transition-colors duration-300"
            >
              Commencer l&apos;enregistrement
            </button>
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
