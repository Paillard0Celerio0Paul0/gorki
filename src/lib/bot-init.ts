import { initializeBot } from '@/bot';

// Initialiser le bot au démarrage de l'application
let botInitialized = false;

export async function ensureBotReady() {
  if (botInitialized) {
    return;
  }

  try {
    console.log('🤖 Initialisation du bot Discord...');
    const result = await initializeBot();
    
    if (result.success) {
      console.log('✅ Bot Discord initialisé avec succès');
      botInitialized = true;
    } else {
      console.error('❌ Erreur lors de l\'initialisation du bot:', result.error);
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation du bot:', error);
  }
}

// Initialiser automatiquement le bot
if (typeof window === 'undefined') {
  // Seulement côté serveur
  ensureBotReady();
}
