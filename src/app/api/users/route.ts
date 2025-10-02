import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Vérifier que l'utilisateur est connecté et admin
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as { user?: { is_admin?: boolean } }).user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    if (!(session as { user?: { is_admin?: boolean } }).user?.is_admin) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        discord_id: true,
        username: true,
        avatar_url: true,
        created_at: true,
      },
      orderBy: {
        username: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
