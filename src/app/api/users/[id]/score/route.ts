import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentification requise' }, 
        { status: 401 }
      );
    }

    const { id: userId } = await params;
    
    // Un utilisateur ne peut voir que son propre score
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Accès non autorisé' }, 
        { status: 403 }
      );
    }

    // Récupérer ou créer le score utilisateur
    let userScore = await prisma.userScore.findUnique({
      where: { user_id: userId }
    });

    // Si pas de score, calculer à partir des votes
    if (!userScore) {
      const userVotes = await prisma.vote.findMany({
        where: {
          user_id: userId,
          prediction: {
            is_validated: true
          }
        },
        include: {
          prediction: true
        }
      });

      let dailyCorrect = 0;
      let dailyTotal = 0;
      let weeklyCorrect = 0;
      let weeklyTotal = 0;
      let totalPointsEarned = 0;
      let totalPointsPossible = 0;

      userVotes.forEach((vote: { prediction: Record<string, unknown>; vote: boolean; }) => {
        const prediction = vote.prediction;
        
        if (prediction.type === 'DAILY') {
          dailyTotal++;
          totalPointsPossible += 1;
          
          if (vote.vote === prediction.correct_answer) {
            dailyCorrect++;
            totalPointsEarned += 1;
          }
        } else if (prediction.type === 'WEEKLY') {
          weeklyTotal++;
          totalPointsPossible += 3;
          
          if (vote.vote === prediction.correct_answer) {
            weeklyCorrect++;
            totalPointsEarned += 3;
          }
        }
      });

      const accuracyPercentage = totalPointsPossible > 0 
        ? (totalPointsEarned / totalPointsPossible) * 100 
        : 0;

      // Créer le score utilisateur
      userScore = await prisma.userScore.create({
        data: {
          user_id: userId,
          daily_correct: dailyCorrect,
          daily_total: dailyTotal,
          weekly_correct: weeklyCorrect,
          weekly_total: weeklyTotal,
          total_points_earned: totalPointsEarned,
          total_points_possible: totalPointsPossible,
          accuracy_percentage: accuracyPercentage
        }
      });
    }

    return NextResponse.json(userScore);

  } catch (error) {
    console.error('Erreur lors de la récupération du score:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}
