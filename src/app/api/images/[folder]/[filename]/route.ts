import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/uploads';

type Params = Promise<{
  folder: string;
  filename: string;
}>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { folder, filename } = await params;
    
    // Sanitize inputs to prevent path traversal
    const sanitizedFolder = folder.replace(/\.\./g, '').replace(/\\/g, '/');
    const sanitizedFilename = filename.replace(/\.\./g, '').replace(/\\/g, '/');
    
    const filePath = path.join(UPLOAD_DIR, sanitizedFolder, sanitizedFilename);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on extension
    const extension = sanitizedFilename.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml'
    };
    
    const contentType = contentTypeMap[extension || ''] || 'application/octet-stream';

    // Return image with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

// Delete image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { folder, filename } = await params;
    const { unlink } = await import('fs/promises');
    
    // Sanitize inputs
    const sanitizedFolder = folder.replace(/\.\./g, '').replace(/\\/g, '/');
    const sanitizedFilename = filename.replace(/\.\./g, '').replace(/\\/g, '/');
    
    const filePath = path.join(UPLOAD_DIR, sanitizedFolder, sanitizedFilename);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
