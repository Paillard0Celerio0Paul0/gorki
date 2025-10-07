import { Client, GatewayIntentBits, ChannelType, AttachmentBuilder, VoiceChannel } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState, StreamType } from '@discordjs/voice';
import { Readable } from 'stream';
import { FFmpeg } from 'prism-media';

// Configuration du bot Discord
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// État du bot
let isReady = false;

// Événement de connexion
bot.on('ready', () => {
  console.log(`🤖 Bot Discord connecté: ${bot.user?.tag}`);
  console.log(`📊 Servant ${bot.guilds.cache.size} serveurs`);
  isReady = true;
});

// Événement d'erreur
bot.on('error', (error) => {
  console.error('❌ Erreur du bot Discord:', error);
});

// Fonction pour envoyer un message avec audio
export async function sendAudioMessage(
  channelId: string, 
  message: string, 
  audioBuffer: Buffer, 
  fileName: string = 'sortilege.mp3'
) {
  try {
    if (!isReady) {
      throw new Error('Bot Discord non connecté');
    }

    const channel = await bot.channels.fetch(channelId);
    
    if (!channel || channel.type !== ChannelType.GuildText) {
      throw new Error('Channel invalide ou non textuel');
    }

    // Log pour debug
    console.log(`📤 Envoi fichier audio: ${fileName}, taille: ${audioBuffer.length} bytes`);
    
    // Créer un AttachmentBuilder pour le fichier audio
    const audioAttachment = new AttachmentBuilder(audioBuffer, {
      name: fileName
    });
    
    // Envoyer le message avec le fichier audio
    const sentMessage = await channel.send({
      content: message,
      files: [audioAttachment]
    });
    
    console.log(`✅ Message envoyé avec succès: ${sentMessage.id}`);

    return {
      success: true,
      messageId: sentMessage.id,
      url: sentMessage.url
    };

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message audio:', error);
    throw error;
  }
}

// Fonction pour envoyer un message simple
export async function sendSimpleMessage(channelId: string, message: string) {
  try {
    if (!isReady) {
      throw new Error('Bot Discord non connecté');
    }

    const channel = await bot.channels.fetch(channelId);
    
    if (!channel || channel.type !== ChannelType.GuildText) {
      throw new Error('Channel invalide ou non textuel');
    }

    const sentMessage = await channel.send(message);
    
    return {
      success: true,
      messageId: sentMessage.id,
      url: sentMessage.url
    };

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
}

// Fonction pour rejoindre un channel vocal
export async function connectToVoiceChannel(voiceChannelId: string) {
  try {
    if (!isReady) {
      throw new Error('Bot Discord non connecté');
    }

    const voiceChannel = await bot.channels.fetch(voiceChannelId);
    
    if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
      throw new Error('Channel vocal invalide');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: voiceChannel.guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    // Attendre que la connexion soit prête
    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    
    console.log(`🎤 Bot connecté au channel vocal: ${voiceChannel.name}`);
    
    return {
      success: true,
      connection,
      channelName: voiceChannel.name
    };

  } catch (error) {
    console.error('Erreur lors de la connexion au channel vocal:', error);
    throw error;
  }
}

// Fonction pour jouer un fichier audio dans un channel vocal
export async function playAudioInVoiceChannel(
  voiceChannelId: string, 
  audioBuffer: Buffer, 
  fileName: string = 'sortilege.mp3'
) {
  try {
    if (!isReady) {
      throw new Error('Bot Discord non connecté');
    }

    // Rejoindre le channel vocal
    const { connection } = await connectToVoiceChannel(voiceChannelId);
    
    // Créer un player audio (logs d'état)
    const player = createAudioPlayer();
    player.on('stateChange', (oldState, newState) => {
      console.log(`🎚️ Player state: ${oldState.status} -> ${newState.status}`);
    });

    // Transcoder le MP3 en Ogg Opus 48kHz (format attendu par Discord)
    const inputStream = Readable.from(audioBuffer);
    const ffmpeg = new FFmpeg({
      args: [
        '-hide_banner',
        '-loglevel','warning',
        '-analyzeduration','0',
        '-vn',
        '-i','pipe:0',
        '-ar','48000',
        '-ac','2',
        '-c:a','libopus',
        '-b:a','128k',
        '-vbr','on',
        '-f','ogg',
        'pipe:1'
      ]
    });
    ffmpeg.on('error', (err) => {
      console.error('FFmpeg error:', err);
    });
    ffmpeg.on('close', (code: number) => {
      console.log('FFmpeg closed with code:', code);
    });
    const pcmStream = inputStream.pipe(ffmpeg);

    // Créer la ressource audio en Ogg Opus
    const resource = createAudioResource(pcmStream, {
      inputType: StreamType.OggOpus,
      inlineVolume: true
    });
    if (resource.volume) {
      resource.volume.setVolume(1.0);
    }

    // Connecter le player à la connexion vocale et lancer la lecture
    connection.subscribe(player);
    
    // Surveillance de la connexion pour éviter les déconnexions précoces
    connection.on('stateChange', async (oldState, newState) => {
      console.log(`🔌 Voice state: ${oldState.status} -> ${newState.status}`);
      if (newState.status === VoiceConnectionStatus.Disconnected) {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
          console.log('🔁 Reconnexion tentative réussie');
        } catch {
          console.warn('❌ Reconnexion échouée, destruction de la connexion');
          connection.destroy();
        }
      }
    });

    player.play(resource);

    console.log(`🔊 Lecture de l'audio: ${fileName}`);

    // Ne pas bloquer l'appel: écouter les événements en tâche de fond
    player.on(AudioPlayerStatus.Idle, () => {
      console.log('✅ Lecture audio terminée');
      connection.destroy();
    });

    player.on('error', (error: Error) => {
      console.error('❌ Erreur lors de la lecture audio:', error);
      connection.destroy();
    });

    // Retourner immédiatement pour ne pas bloquer l'API
    return {
      success: true,
      message: 'Lecture démarrée'
    };

  } catch (error) {
    console.error('Erreur lors de la lecture audio:', error);
    throw error;
  }
}

// Fonction combinée pour envoyer un message ET jouer l'audio dans un channel vocal
export async function sendMessageAndPlayAudio(
  textChannelId: string,
  voiceChannelId: string,
  message: string,
  audioBuffer: Buffer,
  fileName: string = 'sortilege.mp3'
) {
  try {
    if (!isReady) {
      throw new Error('Bot Discord non connecté');
    }

    // Envoyer le message dans le channel textuel
    const messageResult = await sendSimpleMessage(textChannelId, message);
    
    // Jouer l'audio dans le channel vocal
    const audioResult = await playAudioInVoiceChannel(voiceChannelId, audioBuffer, fileName);
    
    return {
      success: true,
      message: messageResult,
      audio: audioResult
    };

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message et de la lecture audio:', error);
    throw error;
  }
}

// Résoudre un salon vocal à partir d'une entrée (ID, mention <#id> ou nom)
export async function resolveVoiceChannelId(
  guildId: string,
  input: string
): Promise<string> {
  if (!isReady) {
    throw new Error('Bot Discord non connecté');
  }

  // ID direct ou mention <#id>
  const mentionMatch = input.match(/^<#(\d+)>$/);
  const maybeId = mentionMatch ? mentionMatch[1] : input;

  // Si c'est un ID numérique
  if (/^\d+$/.test(maybeId)) {
    const guild = await bot.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(maybeId).catch(() => null);
    if (channel && (channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice)) {
      return channel.id;
    }
  }

  // Sinon, recherche par nom (insensible à la casse)
  const guild = await bot.guilds.fetch(guildId);
  const lower = input.toLowerCase();
  const found = guild.channels.cache.find((ch) =>
    (ch.type === ChannelType.GuildVoice || ch.type === ChannelType.GuildStageVoice) &&
    ch.name.toLowerCase() === lower
  );

  if (!found) {
    throw new Error(`Salon vocal introuvable pour: ${input}`);
  }

  return found.id;
}

// Jouer l'audio dans le salon vocal où se trouve actuellement un utilisateur
export async function playAudioInUserVoiceChannel(
  guildId: string,
  userId: string,
  audioBuffer: Buffer,
  fileName: string = 'sortilege.mp3'
) {
  if (!isReady) {
    throw new Error('Bot Discord non connecté');
  }

  const guild = await bot.guilds.fetch(guildId);
  const member = await guild.members.fetch(userId);
  const voiceChannelId = member.voice?.channelId;

  if (!voiceChannelId) {
    throw new Error("L'utilisateur n'est pas connecté à un salon vocal");
  }

  return await playAudioInVoiceChannel(voiceChannelId, audioBuffer, fileName);
}

// Fonction pour initialiser le bot
export async function initializeBot() {
  if (isReady) {
    return { success: true, message: 'Bot déjà connecté' };
  }

  try {
    const token = process.env.DISCORD_BOT_TOKEN;
    
    if (!token) {
      throw new Error('DISCORD_BOT_TOKEN manquant dans les variables d\'environnement');
    }

    // Démarrer la connexion
    bot.login(token);
    
    // Attendre que le bot soit prêt (max 10 secondes)
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout de connexion du bot'));
      }, 10000);

      if (isReady) {
        clearTimeout(timeout);
        resolve(true);
        return;
      }

      bot.once('ready', () => {
        clearTimeout(timeout);
        resolve(true);
      });

      bot.once('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
    
    return { success: true, message: 'Bot connecté avec succès' };
  } catch (error) {
    console.error('Erreur lors de la connexion du bot:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

// Fonction pour vérifier l'état du bot
export function getBotStatus() {
  return {
    isReady,
    user: bot.user?.tag || null,
    guilds: bot.guilds.cache.size
  };
}

// Export du bot pour utilisation externe
export default bot;
