import { Client, GatewayIntentBits, ChannelType, AttachmentBuilder } from 'discord.js';

// Configuration du bot Discord
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
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
