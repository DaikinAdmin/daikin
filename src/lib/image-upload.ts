/**
 * Image Upload Service Helper
 * 
 * This service provides utilities for uploading images to the image service
 * and managing image URLs for use in the application.
 */

const IMAGE_SERVICE_URL = process.env.IMAGE_SERVICE_URL;

export interface UploadImageOptions {
  folder?: string;
}

export interface UploadImageResult {
  success: boolean;
  url: string;
  filename: string;
  folder: string;
  size: number;
  type: string;
}

export interface ImageUploadError {
  error: string;
}

/**
 * Upload a single image to the image service
 * 
 * @param file - The file to upload
 * @param options - Upload options including folder name
 * @returns Promise with upload result or error
 */
export async function uploadImage(
  file: File,
  options: UploadImageOptions = {}
): Promise<UploadImageResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  const response = await fetch(`${IMAGE_SERVICE_URL}/api/images/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  return response.json();
}

/**
 * Upload multiple images to the image service
 * 
 * @param files - Array of files to upload
 * @param options - Upload options including folder name
 * @returns Promise with array of upload results
 */
export async function uploadImages(
  files: File[],
  options: UploadImageOptions = {}
): Promise<UploadImageResult[]> {
  const uploadPromises = files.map(file => uploadImage(file, options));
  return Promise.all(uploadPromises);
}

/**
 * Delete an image from the image service
 * 
 * @param url - Full URL of the image to delete
 * @returns Promise indicating success
 */
export async function deleteImage(url: string): Promise<boolean> {
  // Extract folder and filename from URL
  const urlParts = url.split('/api/images/');
  if (urlParts.length !== 2) {
    throw new Error('Invalid image URL');
  }

  const [folder, filename] = urlParts[1].split('/');
  
  const response = await fetch(
    `${IMAGE_SERVICE_URL}/api/images/${folder}/${filename}`,
    { method: 'DELETE' }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete image');
  }

  return true;
}

/**
 * List all images in a specific folder
 * 
 * @param folder - Folder name to list images from
 * @returns Promise with list of images
 */
export async function listImages(folder?: string) {
  const url = folder 
    ? `${IMAGE_SERVICE_URL}/api/images/list?folder=${folder}`
    : `${IMAGE_SERVICE_URL}/api/images/list`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to list images');
  }

  return response.json();
}

/**
 * Create a new folder in the image service
 * 
 * @param folder - Folder name to create
 * @returns Promise indicating success
 */
export async function createFolder(folder: string): Promise<boolean> {
  const response = await fetch(`${IMAGE_SERVICE_URL}/api/images/folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ folder }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create folder');
  }

  return true;
}

/**
 * Common folder names for organizing images
 */
export const IMAGE_FOLDERS = {
  PRODUCTS: 'products',
  FEATURES: 'features',
  CATEGORIES: 'categories',
  SERVICES: 'services',
  BENEFITS: 'benefits',
  BANNERS: 'banners',
  ICONS: 'icons',
  GENERAL: 'general',
} as const;

/**
 * Validate if a file is an image
 * 
 * @param file - File to validate
 * @returns boolean indicating if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Validate image file size (default max 10MB)
 * 
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default 10)
 * @returns boolean indicating if file size is valid
 */
export function validateImageSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Extract image URLs from various data structures
 * Helper for bulk operations
 */
export function extractImageUrls(data: any): string[] {
  const urls: string[] = [];
  
  if (typeof data === 'string' && data.startsWith('http')) {
    urls.push(data);
  } else if (Array.isArray(data)) {
    data.forEach(item => {
      urls.push(...extractImageUrls(item));
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.values(data).forEach(value => {
      urls.push(...extractImageUrls(value));
    });
  }
  
  return urls;
}
