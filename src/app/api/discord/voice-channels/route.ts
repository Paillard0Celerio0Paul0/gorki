export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bot from '@/bot';
import { initializeBot } from '@/bot';
import { ChannelType } from 'discord.js';

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await initializeBot();

    // Pour l’instant, on suppose un seul serveur (le premier en cache)
    const firstGuild = bot.guilds.cache.first();
    if (!firstGuild) {
      return NextResponse.json({ channels: [] });
    }

    // Assurer que le cache des salons est rempli
    await firstGuild.channels.fetch();

    const channels = firstGuild.channels.cache
      .filter((ch) => ch.type === ChannelType.GuildVoice || ch.type === ChannelType.GuildStageVoice)
      .map((ch) => ({ id: ch.id, name: ch.name }));

    return NextResponse.json({ channels });
  } catch (error) {
    console.error('Erreur liste salons vocaux:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


