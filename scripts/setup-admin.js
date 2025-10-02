const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAdmin() {
  console.log('🔧 Configuration de l\'admin...\n');

  // Lister tous les utilisateurs
  const users = await prisma.user.findMany({
    select: {
      id: true,
      discord_id: true,
      username: true,
      is_admin: true,
      created_at: true
    }
  });

  if (users.length === 0) {
    console.log('❌ Aucun utilisateur trouvé dans la base de données.');
    console.log('💡 Connecte-toi d\'abord avec Discord sur l\'application.');
    process.exit(1);
  }

  console.log('📋 Utilisateurs trouvés :');
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.username} (${user.discord_id}) ${user.is_admin ? '👑 ADMIN' : '👤 User'}`);
  });

  console.log('\n🎯 Pour définir un admin, utilise :');
  console.log('node scripts/setup-admin.js --set-admin <discord_id>');
  
  const args = process.argv.slice(2);
  if (args.includes('--set-admin') && args.length > 2) {
    const discordId = args[args.indexOf('--set-admin') + 1];
    
    const user = await prisma.user.findUnique({
      where: { discord_id: discordId }
    });

    if (!user) {
      console.log(`❌ Utilisateur avec Discord ID ${discordId} non trouvé.`);
      process.exit(1);
    }

    await prisma.user.update({
      where: { discord_id: discordId },
      data: { is_admin: true }
    });

    console.log(`✅ ${user.username} est maintenant ADMIN !`);
  }

  await prisma.$disconnect();
}

setupAdmin().catch((error) => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
