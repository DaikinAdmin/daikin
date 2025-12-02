import { NextRequest, NextResponse } from 'next/server';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/uploads';

// List all folders
export async function GET() {
  try {
    if (!existsSync(UPLOAD_DIR)) {
      return NextResponse.json({
        folders: [],
        count: 0
      });
    }

    const items = await readdir(UPLOAD_DIR, { withFileTypes: true });
    const folders = items
      .filter(item => item.isDirectory())
      .map(item => item.name);

    return NextResponse.json({
      folders,
      count: folders.length
    });

  } catch (error) {
    console.error('Error listing folders:', error);
    return NextResponse.json(
      { error: 'Failed to list folders' },
      { status: 500 }
    );
  }
}

// Create new folder
export async function POST(request: NextRequest) {
  try {
    const { folder } = await request.json();

    if (!folder || typeof folder !== 'string') {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    // Sanitize folder name
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '-');
    const folderPath = path.join(UPLOAD_DIR, sanitizedFolder);

    if (existsSync(folderPath)) {
      return NextResponse.json(
        { error: 'Folder already exists' },
        { status: 409 }
      );
    }

    await mkdir(folderPath, { recursive: true });

    return NextResponse.json({
      success: true,
      folder: sanitizedFolder,
      path: folderPath
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}
