import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// POST - Upload d'un fichier audio
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

    // Vérifier la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (audioFile.size > maxSize) {
      return NextResponse.json({ error: 'Le fichier est trop volumineux (max 10MB)' }, { status: 400 });
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'audio');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = audioFile.name.split('.').pop() || 'mp3';
    const fileName = `audio_${timestamp}_${randomId}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Convertir le fichier en buffer et l'écrire
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Retourner l'URL publique du fichier
    const publicUrl = `/uploads/audio/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier audio:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
