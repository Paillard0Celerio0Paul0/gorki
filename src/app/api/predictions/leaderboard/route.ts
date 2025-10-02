import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Récupérer tous les scores utilisateur qui ont voté
    const scores = await prisma.userScore.findMany({
      where: {
        OR: [
          { daily_total: { gt: 0 } },
          { weekly_total: { gt: 0 } }
        ]
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
