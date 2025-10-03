import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer la liste des utilisateurs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer tous les utilisateurs avec leurs informations Discord
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatar_url: true,
        discord_id: true,
      },
      orderBy: {
        username: 'asc'
      }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}