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
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentification requise' }, 
        { status: 401 }
      );
    }

    const { vote } = await request.json();
    const { id: predictionId } = await params;

    if (typeof vote !== 'boolean') {
      return NextResponse.json(
        { error: 'Vote doit être true ou false' }, 
        { status: 400 }
      );
    }

    // Vérifier que la prédiction existe et que les votes sont ouverts
    const prediction = await prisma.prediction.findUnique({
      where: { id: predictionId }
    });

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prédiction non trouvée' }, 
        { status: 404 }
      );
    }

    if (!prediction.voting_open) {
      return NextResponse.json(
        { error: 'Les votes sont fermés pour cette prédiction' }, 
        { status: 400 }
      );
    }

    if (prediction.voting_closes_at && new Date() > prediction.voting_closes_at) {
      return NextResponse.json(
        { error: 'La période de vote est terminée' }, 
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a déjà voté
    const existingVote = await prisma.vote.findUnique({
      where: {
        prediction_id_user_id: {
          prediction_id: predictionId,
          user_id: session.user.id
        }
      }
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'Tu as déjà voté sur cette prédiction. Un vote ne peut pas être modifié.' }, 
        { status: 400 }
      );
    }

    // Créer le vote (pas de mise à jour possible)
    const userVote = await prisma.vote.create({
      data: {
        prediction_id: predictionId,
        user_id: session.user.id,
        vote: vote
      }
    });

    // Récupérer les nouvelles statistiques
    const [yesVotes, noVotes] = await Promise.all([
      prisma.vote.count({
        where: { prediction_id: predictionId, vote: true }
      }),
      prisma.vote.count({
        where: { prediction_id: predictionId, vote: false }
      })
    ]);

    return NextResponse.json({
      success: true,
      vote: userVote,
      stats: {
        yesVotes,
        noVotes,
        totalVotes: yesVotes + noVotes
      },
      message: 'Vote enregistré avec succès'
    });

  } catch (error) {
    console.error('Erreur lors du vote:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}

// Vote en batch (plusieurs prédictions d'un coup)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentification requise' }, 
        { status: 401 }
      );
    }

    const { votes } = await request.json(); // [{ predictionId, vote }, ...]

    if (!Array.isArray(votes) || votes.length === 0) {
      return NextResponse.json(
        { error: 'Format de votes invalide' }, 
        { status: 400 }
      );
    }

    // Vérifier que toutes les prédictions existent et sont ouvertes
    const predictionIds = votes.map(v => v.predictionId);
    const predictions = await prisma.prediction.findMany({
      where: {
        id: { in: predictionIds },
        voting_open: true,
        voting_closes_at: { gt: new Date() }
      }
    });

    if (predictions.length !== predictionIds.length) {
      return NextResponse.json(
        { error: 'Certaines prédictions ne sont pas disponibles pour le vote' }, 
        { status: 400 }
      );
    }

    // Vérifier les votes existants en batch
    const existingVotes = await prisma.vote.findMany({
      where: {
        user_id: session.user.id,
        prediction_id: { in: predictionIds }
      },
      select: {
        prediction_id: true
      }
    });

    const existingPredictionIds = existingVotes.map((v: { prediction_id: string; }) => v.prediction_id);
    const newVotes = votes.filter(v => !existingPredictionIds.includes(v.predictionId));

    if (newVotes.length === 0) {
      return NextResponse.json(
        { error: 'Tu as déjà voté sur toutes ces prédictions. Un vote ne peut pas être modifié.' }, 
        { status: 400 }
      );
    }

    if (newVotes.length < votes.length) {
      const alreadyVotedCount = votes.length - newVotes.length;
      return NextResponse.json(
        { error: `Tu as déjà voté sur ${alreadyVotedCount} prédiction${alreadyVotedCount > 1 ? 's' : ''}. Seules les nouvelles prédictions seront enregistrées.` }, 
        { status: 400 }
      );
    }

    // Créer uniquement les nouveaux votes
    const voteOperations = newVotes.map(({ predictionId, vote }) =>
      prisma.vote.create({
        data: {
          prediction_id: predictionId,
          user_id: session.user.id,
          vote: vote
        }
      })
    );

    const results = await Promise.all(voteOperations);

    return NextResponse.json({
      success: true,
      votes: results,
      message: `${results.length} votes enregistrés avec succès`
    });

  } catch (error) {
    console.error('Erreur lors du vote en batch:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}
