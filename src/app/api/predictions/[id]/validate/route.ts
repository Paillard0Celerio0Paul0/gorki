import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !(session as { user?: { is_admin?: boolean } }).user?.is_admin) {
      return NextResponse.json(
        { error: 'Accès non autorisé. Admin requis.' }, 
        { status: 403 }
      );
    }

    const { correct_answer } = await request.json();
    const { id: predictionId } = await params;

    if (typeof correct_answer !== 'boolean') {
      return NextResponse.json(
        { error: 'correct_answer doit être true ou false' }, 
        { status: 400 }
      );
    }

    // Vérifier que la prédiction existe
    const prediction = await prisma.prediction.findUnique({
      where: { id: predictionId }
    });

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prédiction non trouvée' }, 
        { status: 404 }
      );
    }

    if (prediction.is_validated) {
      return NextResponse.json(
        { error: 'Cette prédiction a déjà été validée' }, 
        { status: 400 }
      );
    }

    // Fermer les votes et valider la prédiction
    const updatedPrediction = await prisma.prediction.update({
      where: { id: predictionId },
      data: {
        is_validated: true,
        correct_answer: correct_answer,
        validated_at: new Date(),
        validated_by: (session as { user?: { id: string } }).user?.id || '',
        voting_open: false
      },
      include: {
        creator: {
          select: {
            username: true
          }
        }
      }
    });

    // Recalculer les scores de tous les utilisateurs qui ont voté
    const votes = await prisma.vote.findMany({
      where: { prediction_id: predictionId },
      include: {
        user: {
          select: { id: true }
        }
      }
    });

    // Mettre à jour les scores pour chaque utilisateur
    for (const vote of votes) {
      const userId = vote.user.id;
      const isCorrect = vote.vote === correct_answer;
      const points = prediction.points;

      // Récupérer le score actuel
      const currentScore = await prisma.userScore.findUnique({
        where: { user_id: userId }
      });

      if (currentScore) {
        // Mettre à jour le score existant
        // Déterminer les champs à mettre à jour selon le type de prédiction
        const isDaily = prediction.type === 'DAILY';
        await prisma.userScore.update({
          where: { user_id: userId },
          data: {
            daily_total: isDaily ? currentScore.daily_total + 1 : currentScore.daily_total,
            daily_correct: isDaily ? currentScore.daily_correct + (isCorrect ? 1 : 0) : currentScore.daily_correct,
            weekly_total: isDaily ? currentScore.weekly_total : currentScore.weekly_total + 1,
            weekly_correct: isDaily ? currentScore.weekly_correct : currentScore.weekly_correct + (isCorrect ? 1 : 0),
            total_points_possible: currentScore.total_points_possible + points,
            total_points_earned: currentScore.total_points_earned + (isCorrect ? points : 0),
            accuracy_percentage: ((currentScore.total_points_earned + (isCorrect ? points : 0)) / (currentScore.total_points_possible + points)) * 100,
            last_updated: new Date()
          }
        });
      } else {
        // Créer un nouveau score
        // Créer un nouveau score avec les bons champs
        const isDaily = prediction.type === 'DAILY';
        await prisma.userScore.create({
          data: {
            user_id: userId,
            daily_total: isDaily ? 1 : 0,
            daily_correct: isDaily && isCorrect ? 1 : 0,
            weekly_total: isDaily ? 0 : 1,
            weekly_correct: !isDaily && isCorrect ? 1 : 0,
            total_points_possible: points,
            total_points_earned: isCorrect ? points : 0,
            accuracy_percentage: isCorrect ? 100 : 0,
            last_updated: new Date()
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      prediction: updatedPrediction,
      message: `Prédiction validée comme ${correct_answer ? 'VRAIE' : 'FAUSSE'}`
    });

  } catch (error) {
    console.error('Erreur lors de la validation de la prédiction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}
