import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer le mot magique (admin seulement)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !session.user.is_admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const magicWord = await prisma.magicWord.findFirst({
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ 
      magicWord: magicWord?.word || '' 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du mot magique:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer ou mettre à jour le mot magique (admin seulement)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !session.user.is_admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { word } = await request.json();

    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      return NextResponse.json({ error: 'Le mot magique est requis' }, { status: 400 });
    }

    // Normaliser le mot (supprimer espaces et mettre en minuscules)
    const normalizedWord = word.trim().toLowerCase();

    // Supprimer l'ancien mot magique s'il existe
    await prisma.magicWord.deleteMany({});

    // Créer le nouveau mot magique
    const magicWord = await prisma.magicWord.create({
      data: {
        word: normalizedWord
      }
    });

    return NextResponse.json({ 
      success: true, 
      magicWord: magicWord.word 
    });
  } catch (error) {
    console.error('Erreur lors de la création du mot magique:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
