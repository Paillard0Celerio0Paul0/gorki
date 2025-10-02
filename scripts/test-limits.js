const { PrismaClient } = require('@prisma/client');
const { getWeekStart, getWeekEnd } = require('../src/lib/prediction-utils');

const prisma = new PrismaClient();

async function testLimits() {
  console.log('🧪 Test des limites de prédictions...\n');

  const today = new Date();
  const weekStart = getWeekStart(today);
  const weekEnd = getWeekEnd(today);

  console.log('📅 Dates de référence:');
  console.log(`  Aujourd'hui: ${today.toISOString()}`);
  console.log(`  Début semaine: ${weekStart.toISOString()}`);
  console.log(`  Fin semaine: ${weekEnd.toISOString()}\n`);

  // Compter les prédictions hebdomadaires
  const weeklyCount = await prisma.prediction.count({
    where: {
      type: 'WEEKLY',
      created_at: {
        gte: weekStart,
        lte: weekEnd
      }
    }
  });

  console.log(`📊 Prédictions hebdomadaires créées cette semaine: ${weeklyCount}/3`);

  if (weeklyCount >= 3) {
    console.log('❌ LIMITE ATTEINTE - Impossible de créer plus de prédictions hebdomadaires');
  } else {
    console.log(`✅ Il reste ${3 - weeklyCount} prédiction(s) hebdomadaire(s) à créer`);
  }

  // Lister toutes les prédictions hebdomadaires
  const weeklyPredictions = await prisma.prediction.findMany({
    where: {
      type: 'WEEKLY',
      created_at: {
        gte: weekStart,
        lte: weekEnd
      }
    },
    select: {
      id: true,
      text: true,
      created_at: true,
      week_start: true,
      week_end: true
    },
    orderBy: {
      created_at: 'asc'
    }
  });

  console.log('\n📋 Prédictions hebdomadaires de cette semaine:');
  if (weeklyPredictions.length === 0) {
    console.log('  Aucune prédiction hebdomadaire créée cette semaine');
  } else {
    weeklyPredictions.forEach((pred, index) => {
      console.log(`  ${index + 1}. ${pred.text.substring(0, 50)}...`);
      console.log(`     Créée: ${pred.created_at.toISOString()}`);
      console.log(`     Semaine: ${pred.week_start?.toISOString()} → ${pred.week_end?.toISOString()}`);
    });
  }

  await prisma.$disconnect();
}

testLimits().catch((error) => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
