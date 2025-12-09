import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/uploads';
const BASE_URL = process.env.IMAGE_SERVICE_URL;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Create filename with timestamp to avoid duplicates
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    const extension = file.name.split('.').pop();
    const filename = `${originalName}-${timestamp}.${extension}`;

    // Create folder path
    const folderPath = path.join(UPLOAD_DIR, folder);
    
    // Ensure directory exists
    if (!existsSync(folderPath)) {
      await mkdir(folderPath, { recursive: true });
    }

    // Save file
    const filePath = path.join(folderPath, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate URL
    const imageUrl = `${BASE_URL}/api/images/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename,
      folder,
      size: file.size,
      type: file.type
    }, { status: 201 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Get upload configuration
export async function GET() {
  return NextResponse.json({
    uploadDir: UPLOAD_DIR,
    baseUrl: BASE_URL,
    maxFileSize: '10MB',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  });
}
