import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTodayStart, getTodayEnd, getWeekStart, getWeekEnd } from "@/lib/prediction-utils";
import { PredictionType } from "@/types/predictions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.is_admin) {
      return NextResponse.json(
        { error: 'Accès non autorisé. Admin requis.' }, 
        { status: 403 }
      );
    }

    const body = await request.json();
    const { text, type, mentioned_user_id } = body;

    if (!text || !type) {
      return NextResponse.json(
        { error: 'Texte et type requis' }, 
        { status: 400 }
      );
    }

    if (!Object.values(PredictionType).includes(type)) {
      return NextResponse.json(
        { error: 'Type de prédiction invalide' }, 
        { status: 400 }
      );
    }

    const today = new Date();
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();
    const weekStart = getWeekStart(today);
    const weekEnd = getWeekEnd(today);

    // Vérifier les limites selon le type
    if (type === PredictionType.DAILY) {
      const dailyCount = await prisma.prediction.count({
        where: {
          type: 'DAILY',
          day: {
            gte: todayStart,
            lte: todayEnd
          }
        }
      });

      if (dailyCount >= 1) {
        return NextResponse.json(
          { error: 'Limite atteinte: 1 prédiction journalière maximum par jour' }, 
          { status: 400 }
        );
      }
    } else if (type === PredictionType.WEEKLY) {
      // Pour les prédictions hebdomadaires, on compte celles créées cette semaine
      const weeklyCount = await prisma.prediction.count({
        where: {
          type: 'WEEKLY',
          created_at: {
            gte: weekStart,
            lte: weekEnd
          }
        }
      });

      console.log(`[DEBUG] Vérification limite hebdomadaire:`, {
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        weeklyCount,
        limit: 3
      });

      if (weeklyCount >= 3) {
        return NextResponse.json(
          { error: 'Limite atteinte: 3 prédictions hebdomadaires maximum par semaine' }, 
          { status: 400 }
        );
      }
    }

    // Déterminer les points selon le type
    const points = type === PredictionType.DAILY ? 1 : 3;

    // Créer la prédiction
    const prediction = await prisma.prediction.create({
      data: {
        text,
        type,
        points,
        created_by: session.user.id,
        mentioned_user_id: mentioned_user_id || null,
        // Pour les prédictions journalières
        ...(type === PredictionType.DAILY && {
          day: todayStart,
          voting_closes_at: todayEnd
        }),
        // Pour les prédictions hebdomadaires
        ...(type === PredictionType.WEEKLY && {
          week_start: weekStart,
          week_end: weekEnd,
          voting_closes_at: weekEnd
        })
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatar_url: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      prediction,
      message: `Prédiction ${type === PredictionType.DAILY ? 'journalière' : 'hebdomadaire'} créée avec succès`
    });

  } catch (error) {
    console.error('Erreur lors de la création de la prédiction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' }, 
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const active = searchParams.get('active');

    const whereClause: Record<string, unknown> = {};

    // Filtrer par type si spécifié
    if (type && Object.values(PredictionType).includes(type as PredictionType)) {
      whereClause.type = type;
    }

    // Filtrer les prédictions actives (votes ouverts)
    if (active === 'true') {
      whereClause.voting_open = true;
      whereClause.voting_closes_at = {
        gt: new Date()
      };
    }

    const predictions = await prisma.prediction.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatar_url: true
          }
        },
        mentioned_user: {
          select: {
            id: true,
            username: true,
            avatar_url: true
          }
        },
        votes: {
          where: {
            user_id: session.user.id
          },
          select: {
            vote: true,
            created_at: true,
            updated_at: true
          }
        },
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Enrichir avec les statistiques de vote
    const predictionsWithStats = await Promise.all(
      predictions.map(async (prediction: { id: string; votes: Record<string, unknown>[]; }) => {
        const [yesVotes, noVotes] = await Promise.all([
          prisma.vote.count({
            where: { prediction_id: prediction.id, vote: true }
          }),
          prisma.vote.count({
            where: { prediction_id: prediction.id, vote: false }
          })
        ]);

        return {
          ...prediction,
          userVote: prediction.votes[0] || null,
          totalVotes: yesVotes + noVotes,
          yesVotes,
          noVotes
        };
      })
    );

    return NextResponse.json(predictionsWithStats);

  } catch (error) {
    console.error('Erreur lors de la récupération des prédictions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}
