// server.ts
import express from 'express';
import cors from 'cors';
import { initializeBot, playAudioInVoiceChannel, playAudioInUserVoiceChannel, resolveVoiceChannelId } from './src/bot/index';

const app = express();
app.use(cors());
app.use(express.json({ limit: '12mb' }));

// Auth simple par jeton
function assertAuthorized(req: express.Request) {
  const auth = req.headers.authorization || '';
  const expected = process.env.BOT_TOKEN ? `Bearer ${process.env.BOT_TOKEN}` : '';
  if (!expected || auth !== expected) {
    const err: any = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
}

app.get('/health', (_req: any, res: { json: (arg0: { ok: boolean; }) => any; }) => res.json({ ok: true }));

app.post('/play', async (req: any, res: any) => {
  try {
    assertAuthorized(req);

    const {
      mode,                // 'current' | 'list' | 'custom'
      guildId,             // string (obligatoire)
      userDiscordId,       // si mode === 'current'
      voiceChannelId,      // si mode === 'list'
      voiceChannelInput,   // si mode === 'custom' (ID/mention/nom)
      audioBase64,         // audio encodé en base64 (mp3)
      fileName = 'sortilege.mp3'
    } = req.body as {
      mode: 'current' | 'list' | 'custom',
      guildId: string,
      userDiscordId?: string,
      voiceChannelId?: string,
      voiceChannelInput?: string,
      audioBase64: string,
      fileName?: string
    };

    if (!guildId || !mode || !audioBase64) {
      return res.status(400).json({ error: 'guildId, mode et audioBase64 sont requis' });
    }

    await initializeBot();

    const audioBuffer = Buffer.from(audioBase64, 'base64');

    if (mode === 'current') {
      if (!userDiscordId) return res.status(400).json({ error: 'userDiscordId requis pour mode current' });
      await playAudioInUserVoiceChannel(guildId, userDiscordId, audioBuffer, fileName);
    } else if (mode === 'list') {
      if (!voiceChannelId) return res.status(400).json({ error: 'voiceChannelId requis pour mode list' });
      await playAudioInVoiceChannel(voiceChannelId, audioBuffer, fileName);
    } else if (mode === 'custom') {
      if (!voiceChannelInput) return res.status(400).json({ error: 'voiceChannelInput requis pour mode custom' });
      const resolvedId = await resolveVoiceChannelId(guildId, voiceChannelInput);
      await playAudioInVoiceChannel(resolvedId, audioBuffer, fileName);
    }

    res.json({ success: true });
  } catch (e: any) {
    console.error('play error:', e);
    res.status(e?.status || 500).json({ error: e?.message || 'play failed' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Bot server listening on :${port}`));