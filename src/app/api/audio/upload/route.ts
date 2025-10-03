import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// POST - Upload d'un fichier audio (retourne directement le Blob)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'Fichier audio requis' }, { status: 400 });
    }

    // Vérifier le type de fichier
    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Le fichier doit être un fichier audio' }, { status: 400 });
    }

    // Vérifier la taille (max 8MB pour Discord)
    const maxSize = 8 * 1024 * 1024; // 8MB
    if (audioFile.size > maxSize) {
      return NextResponse.json({ error: 'Le fichier est trop volumineux (max 8MB)' }, { status: 400 });
    }

    // Convertir le fichier en buffer
    const audioBuffer = await audioFile.arrayBuffer();
    
    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = audioFile.name.split('.').pop() || 'mp3';
    const fileName = `audio_${timestamp}_${randomId}.${fileExtension}`;

    // Retourner le fichier audio directement
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': audioFile.type,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'X-File-Name': fileName,
        'X-Success': 'true'
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier audio:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
