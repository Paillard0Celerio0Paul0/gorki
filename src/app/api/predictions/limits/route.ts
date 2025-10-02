import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTodayStart, getTodayEnd, getWeekStart, getWeekEnd } from "@/lib/prediction-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.is_admin) {
      return NextResponse.json(
        { error: 'Accès non autorisé. Admin requis.' }, 
        { status: 403 }
      );
    }

    const today = new Date();
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();
    const weekStart = getWeekStart(today);
    const weekEnd = getWeekEnd(today);

    // Compter les prédictions journalières d'aujourd'hui
    const dailyCount = await prisma.prediction.count({
      where: {
        type: 'DAILY',
        day: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    });

    // Compter les prédictions hebdomadaires créées cette semaine
    const weeklyCount = await prisma.prediction.count({
      where: {
        type: 'WEEKLY',
        created_at: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    });

    return NextResponse.json({
      daily_created_today: dailyCount,
      weekly_created_this_week: weeklyCount,
      max_daily_per_day: 1,
      max_weekly_per_week: 3,
      can_create_daily: dailyCount < 1,
      can_create_weekly: weeklyCount < 3,
      dates: {
        today_start: todayStart,
        today_end: todayEnd,
        week_start: weekStart,
        week_end: weekEnd
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des limites:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    );
  }
}
