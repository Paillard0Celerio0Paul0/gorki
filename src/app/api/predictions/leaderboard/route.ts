import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Récupérer tous les scores utilisateur qui ont voté avec les infos utilisateur
    const scores = await prisma.userScore.findMany({
      where: {
        OR: [
          { daily_total: { gt: 0 } },
          { weekly_total: { gt: 0 } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar_url: true
          }
        }
      },
      orderBy: [
        { total_points_earned: 'desc' },
        { accuracy_percentage: 'desc' }
      ]
    });

    return NextResponse.json(scores);

  } catch (error) {
    console.error('Erreur lors de la récupération du leaderboard:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}
