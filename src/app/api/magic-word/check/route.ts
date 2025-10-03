import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Vérifier le mot magique
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { word } = await request.json();

    if (!word || typeof word !== 'string') {
      return NextResponse.json({ error: 'Le mot est requis' }, { status: 400 });
    }

    // Normaliser le mot saisi (supprimer espaces et mettre en minuscules)
    const normalizedInput = word.trim().toLowerCase();

    // Récupérer le mot magique actuel
    const magicWord = await prisma.magicWord.findFirst({
      orderBy: { created_at: 'desc' }
    });

    if (!magicWord) {
      return NextResponse.json({ 
        success: false, 
        message: 'Aucun mot magique défini' 
      });
    }

    // Vérifier si le mot correspond
    const isCorrect = normalizedInput === magicWord.word;

    return NextResponse.json({ 
      success: isCorrect,
      message: isCorrect ? 'Mot magique correct !' : 'Mot incorrect'
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du mot magique:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
