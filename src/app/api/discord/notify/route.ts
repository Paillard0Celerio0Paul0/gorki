export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bot, { sendAudioMessage, sendSimpleMessage, initializeBot, playAudioInVoiceChannel, playAudioInUserVoiceChannel, resolveVoiceChannelId } from '@/bot';
import '@/lib/bot-init'; // Initialiser le bot automatiquement

// Fonction pour uploader un fichier audio vers un service temporaire (non utilisée)
// async function uploadAudioToTemporaryService(audioBlob: Blob): Promise<string> {
//   const formData = new FormData();
//   formData.append('file', audioBlob, 'audio.mp3');
//   
//   try {
//     // Utiliser 0x0.st (service gratuit d'upload temporaire)
//     const response = await fetch('https://0x0.st', {
//       method: 'POST',
//       body: formData,
//     });
//     
//     if (response.ok) {
//       const url = await response.text();
//       return url.trim();
//     }
//     
//     throw new Error('Upload failed');
//   } catch (error) {
//     console.error('Erreur upload temporaire:', error);
//     throw error;
//   }
// }

// Phrases aléatoires pour les notifications
const RANDOM_PHRASES = [
  "déclenche un puissant sortilège à l'encontre de",
  "agite ses bras en direction de",
  "murmure à l'oreille de",
  "susurre à",
  "pris de folie, crie en direction de",
  "crache en direction de",
  "utilise sa magie sur",
  "essaie de déstabiliser"
];

// POST - Envoyer une notification Discord
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Gérer les deux types de requêtes : JSON et FormData
    let targetUserId: string;
    let audioType: 'file' | 'url';
    let audioFile: Blob | undefined;
    let audioUrl: string | undefined;
    let voiceChannelMode: 'current' | 'list' | 'custom' | undefined;
    let voiceChannelId: string | undefined;
    let voiceChannelInput: string | undefined;

    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // Requête FormData (pour les fichiers)
      const formData = await request.formData();
      targetUserId = formData.get('targetUserId') as string;
      audioType = formData.get('audioType') as 'file' | 'url';
      audioFile = formData.get('audioFile') as Blob;
      const rawMode = formData.get('voiceChannelMode');
      voiceChannelMode = (rawMode === 'current' || rawMode === 'list' || rawMode === 'custom')
        ? rawMode
        : undefined;
      voiceChannelId = (formData.get('voiceChannelId') as string) || undefined;
      voiceChannelInput = (formData.get('voiceChannelInput') as string) || undefined;
    } else {
      // Requête JSON (pour les URLs)
      const jsonData = await request.json();
      targetUserId = jsonData.targetUserId;
      audioType = jsonData.audioType;
      audioUrl = jsonData.audioUrl;
      voiceChannelMode = jsonData.voiceChannelMode;
      voiceChannelId = jsonData.voiceChannelId;
      voiceChannelInput = jsonData.voiceChannelInput;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Utilisateur cible requis' }, { status: 400 });
    }

    // Récupérer les informations des utilisateurs
    const [currentUser, targetUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true, avatar_url: true }
      }),
      prisma.user.findUnique({
        where: { id: targetUserId },
        select: { username: true, avatar_url: true, discord_id: true }
      })
    ]);

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Sélectionner une phrase aléatoire
    const randomPhrase = RANDOM_PHRASES[Math.floor(Math.random() * RANDOM_PHRASES.length)];

    // Construire le message Discord avec mention
    const message = `${currentUser.username} ${randomPhrase} <@${targetUser.discord_id}>`;

    // Récupérer l'ID du channel Discord depuis les variables d'environnement
    const channelId = process.env.DISCORD_CHANNEL_ID;
    
    if (!channelId) {
      return NextResponse.json({ error: 'Channel Discord non configuré' }, { status: 500 });
    }

    // Initialiser le bot Discord si nécessaire
    await initializeBot();

    // Gérer l'envoi selon le type d'audio (message Discord texte + upload fichier)
    if (audioType === 'file' && audioFile) {
      try {
        // Vérifier que audioFile est bien un Blob
        if (!(audioFile instanceof Blob)) {
          throw new Error('Format de fichier audio invalide');
        }
        
        // Convertir le Blob en Buffer pour le bot Discord
        const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
        
        // Vérifier la taille du fichier (max 8MB pour Discord)
        if (audioBuffer.length > 8 * 1024 * 1024) {
          throw new Error('Fichier audio trop volumineux (max 8MB)');
        }
        
        console.log(`📦 Buffer audio créé: ${audioBuffer.length} bytes`);
        
        // Envoyer le message textuel (inchangé)
        const result = await sendAudioMessage(channelId, message, audioBuffer, 'sortilege.mp3');
        
        if (!result.success) {
          throw new Error('Erreur lors de l\'envoi du message audio');
        }
        
        // Déléguer la lecture vocale au serveur bot externe (BOT_SERVER_URL)
        const botUrl = process.env.BOT_SERVER_URL;
        const botToken = process.env.BOT_TOKEN;
        const guildId = process.env.DISCORD_GUILD_ID;
        if (!botUrl || !botToken || !guildId) {
          console.warn('Lecture vocale non déclenchée: BOT_SERVER_URL, BOT_TOKEN ou DISCORD_GUILD_ID manquants');
        } else {
          try {
            const body: any = {
              mode: voiceChannelMode,
              guildId,
              userDiscordId: targetUser.discord_id,
              voiceChannelId,
              voiceChannelInput,
              audioBase64: audioBuffer.toString('base64'),
              fileName: 'sortilege.mp3'
            };
            await fetch(`${botUrl}/play`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${botToken}`
              },
              body: JSON.stringify(body)
            });
          } catch (e) {
            console.error('Erreur appel BOT_SERVER_URL/play:', e);
          }
        }

      } catch (error) {
        console.error('Erreur envoi audio via bot:', error);
        // Fallback: envoyer un message simple
        await sendSimpleMessage(channelId, `${message}\n🎵 [Audio non disponible]`);
      }
    } else if (audioType === 'url' && audioUrl) {
      try {
        // Construire l'URL complète si c'est une URL relative
        const fullUrl = audioUrl.startsWith('http') 
          ? audioUrl 
          : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${audioUrl}`;
        
        console.log(`📥 Téléchargement depuis: ${fullUrl}`);
        
        // Télécharger le fichier audio depuis l'URL
        const audioResponse = await fetch(fullUrl);
        if (!audioResponse.ok) {
          throw new Error(`Impossible de télécharger le fichier audio: ${audioResponse.status}`);
        }
        
        const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
        
        // Vérifier la taille du fichier
        if (audioBuffer.length > 8 * 1024 * 1024) {
          throw new Error('Fichier audio trop volumineux (max 8MB)');
        }
        
        console.log(`📦 Fichier téléchargé: ${audioBuffer.length} bytes`);
        
        // Envoyer le message avec le fichier audio
        const result = await sendAudioMessage(channelId, message, audioBuffer, 'sortilege.mp3');
        
        if (!result.success) {
          throw new Error('Erreur lors de l\'envoi du message audio');
        }

        // Déléguer la lecture vocale au serveur bot
        const botUrl2 = process.env.BOT_SERVER_URL;
        const botToken2 = process.env.BOT_TOKEN;
        const guildId2 = process.env.DISCORD_GUILD_ID;
        if (!botUrl2 || !botToken2 || !guildId2) {
          console.warn('Lecture vocale non déclenchée: BOT_SERVER_URL, BOT_TOKEN ou DISCORD_GUILD_ID manquants');
        } else {
          try {
            const body: any = {
              mode: voiceChannelMode,
              guildId: guildId2,
              userDiscordId: targetUser.discord_id,
              voiceChannelId,
              voiceChannelInput,
              audioBase64: audioBuffer.toString('base64'),
              fileName: 'sortilege.mp3'
            };
            await fetch(`${botUrl2}/play`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${botToken2}`
              },
              body: JSON.stringify(body)
            });
          } catch (e) {
            console.error('Erreur appel BOT_SERVER_URL/play:', e);
          }
        }
        
      } catch (error) {
        console.error('Erreur envoi audio depuis URL:', error);
        // Fallback: envoyer un message simple avec le lien
        const fullUrl = audioUrl.startsWith('http') 
          ? audioUrl 
          : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${audioUrl}`;
        const messageWithAudio = `${message}\n🎵 [Écouter le sortilège](${fullUrl})`;
        await sendSimpleMessage(channelId, messageWithAudio);
      }
    } else {
      // Pas d'audio, envoyer juste le message
      await sendSimpleMessage(channelId, message);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Notification envoyée avec succès !' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
