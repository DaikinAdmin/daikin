import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/uploads';
const BASE_URL = process.env.IMAGE_SERVICE_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folder = searchParams.get('folder') || '';

    const targetDir = folder 
      ? path.join(UPLOAD_DIR, folder)
      : UPLOAD_DIR;

    if (!existsSync(targetDir)) {
      return NextResponse.json({
        images: [],
        folder: folder || 'root',
        count: 0
      });
    }

    // Read directory
    const files = await readdir(targetDir);
    
    // Filter images and get file info
    const images = await Promise.all(
      files
        .filter(file => {
          const ext = file.split('.').pop()?.toLowerCase();
          return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
        })
        .map(async (file) => {
          const filePath = path.join(targetDir, file);
          const stats = await stat(filePath);
          const url = folder 
            ? `${BASE_URL}/api/images/${folder}/${file}`
            : `${BASE_URL}/api/images/general/${file}`;
          
          return {
            filename: file,
            url,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        })
    );

    // Sort by creation date (newest first)
    images.sort((a, b) => b.created.getTime() - a.created.getTime());

    return NextResponse.json({
      images,
      folder: folder || 'root',
      count: images.length
    });

  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    );
  }
}
