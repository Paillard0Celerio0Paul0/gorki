import { NextResponse } from 'next/server';
import { initializeBot } from '@/bot';

// POST - Démarrer le bot Discord
export async function POST() {
  try {
    const result = await initializeBot();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur lors du démarrage du bot:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}

// GET - Vérifier l'état du bot
export async function GET() {
  try {
    const { getBotStatus } = await import('@/bot');
    const status = getBotStatus();
    
    return NextResponse.json({ 
      success: true, 
      status 
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du bot:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur serveur' 
    }, { status: 500 });
  }
}
