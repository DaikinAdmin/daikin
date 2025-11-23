import { useState, useCallback } from 'react';
import { uploadImage, uploadImages, deleteImage, type UploadImageOptions, type UploadImageResult } from '@/lib/image-upload';

interface UseImageUploadOptions extends UploadImageOptions {
  onSuccess?: (result: UploadImageResult | UploadImageResult[]) => void;
  onError?: (error: Error) => void;
  maxSizeMB?: number;
}

interface UseImageUploadReturn {
  upload: (file: File) => Promise<UploadImageResult | null>;
  uploadMultiple: (files: File[]) => Promise<UploadImageResult[]>;
  remove: (url: string) => Promise<boolean>;
  uploading: boolean;
  progress: { current: number; total: number };
  error: string | null;
  uploadedUrls: string[];
}

/**
 * React hook for image uploads with progress tracking and error handling
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { upload, uploading, uploadedUrls } = useImageUpload({
 *     folder: 'products',
 *     onSuccess: (result) => console.log('Uploaded:', result),
 *   });
 * 
 *   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const file = e.target.files?.[0];
 *     if (file) await upload(file);
 *   };
 * 
 *   return (
 *     <div>
 *       <input type="file" onChange={handleFileChange} disabled={uploading} />
 *       {uploadedUrls.map(url => <img key={url} src={url} alt="" />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const { onSuccess, onError, maxSizeMB = 10, ...uploadOptions } = options;

  const validateFile = useCallback((file: File): boolean => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Image must be less than ${maxSizeMB}MB`);
      return false;
    }

    return true;
  }, [maxSizeMB]);

  const upload = useCallback(async (file: File): Promise<UploadImageResult | null> => {
    if (!validateFile(file)) {
      return null;
    }

    setUploading(true);
    setError(null);
    setProgress({ current: 0, total: 1 });

    try {
      const result = await uploadImage(file, uploadOptions);
      
      setUploadedUrls(prev => [...prev, result.url]);
      setProgress({ current: 1, total: 1 });
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error.message);
      
      if (onError) {
        onError(error);
      }
      
      return null;
    } finally {
      setUploading(false);
    }
  }, [validateFile, uploadOptions, onSuccess, onError]);

  const uploadMultiple = useCallback(async (files: File[]): Promise<UploadImageResult[]> => {
    const validFiles = files.filter(validateFile);
    
    if (validFiles.length === 0) {
      return [];
    }

    setUploading(true);
    setError(null);
    setProgress({ current: 0, total: validFiles.length });

    const results: UploadImageResult[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const result = await uploadImage(validFiles[i], uploadOptions);
        results.push(result);
        setUploadedUrls(prev => [...prev, result.url]);
        setProgress({ current: i + 1, total: validFiles.length });
      }

      if (onSuccess) {
        onSuccess(results);
      }

      return results;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error.message);
      
      if (onError) {
        onError(error);
      }
      
      return results;
    } finally {
      setUploading(false);
      setProgress({ current: 0, total: 0 });
    }
  }, [validateFile, uploadOptions, onSuccess, onError]);

  const remove = useCallback(async (url: string): Promise<boolean> => {
    try {
      await deleteImage(url);
      setUploadedUrls(prev => prev.filter(u => u !== url));
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Delete failed');
      setError(error.message);
      
      if (onError) {
        onError(error);
      }
      
      return false;
    }
  }, [onError]);

  return {
    upload,
    uploadMultiple,
    remove,
    uploading,
    progress,
    error,
    uploadedUrls,
  };
}

/**
 * Simpler hook for single image upload
 * 
 * @example
 * ```tsx
 * function Avatar() {
 *   const { imageUrl, upload, uploading } = useSingleImageUpload({ folder: 'avatars' });
 * 
 *   return (
 *     <div>
 *       {imageUrl && <img src={imageUrl} alt="Avatar" />}
 *       <input type="file" onChange={(e) => {
 *         const file = e.target.files?.[0];
 *         if (file) upload(file);
 *       }} disabled={uploading} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useSingleImageUpload(options: UseImageUploadOptions = {}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { upload: uploadFn, uploading, error, remove: removeFn } = useImageUpload(options);

  const upload = useCallback(async (file: File) => {
    const result = await uploadFn(file);
    if (result) {
      setImageUrl(result.url);
    }
    return result;
  }, [uploadFn]);

  const remove = useCallback(async () => {
    if (imageUrl) {
      const success = await removeFn(imageUrl);
      if (success) {
        setImageUrl(null);
      }
      return success;
    }
    return false;
  }, [imageUrl, removeFn]);

  const reset = useCallback(() => {
    setImageUrl(null);
  }, []);

  return {
    imageUrl,
    upload,
    remove,
    reset,
    uploading,
    error,
  };
}

/**
 * Hook for managing multiple image uploads with preview
 * 
 * @example
 * ```tsx
 * function ProductImages() {
 *   const { images, addImages, removeImage, uploading } = useMultipleImageUpload({
 *     folder: 'products',
 *     maxImages: 5,
 *   });
 * 
 *   return (
 *     <div>
 *       <input
 *         type="file"
 *         multiple
 *         onChange={(e) => e.target.files && addImages(Array.from(e.target.files))}
 *         disabled={uploading}
 *       />
 *       <div>
 *         {images.map(img => (
 *           <div key={img.url}>
 *             <img src={img.url} alt="" />
 *             <button onClick={() => removeImage(img.url)}>Remove</button>
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMultipleImageUpload(
  options: UseImageUploadOptions & { maxImages?: number } = {}
) {
  const { maxImages = 10, ...uploadOptions } = options;
  const [images, setImages] = useState<UploadImageResult[]>([]);
  const { uploadMultiple: uploadFn, remove: removeFn, uploading, error, progress } = useImageUpload(uploadOptions);

  const addImages = useCallback(async (files: File[]) => {
    const remainingSlots = maxImages - images.length;
    const filesToUpload = files.slice(0, remainingSlots);
    
    if (filesToUpload.length < files.length) {
      console.warn(`Only uploading ${filesToUpload.length} files. Maximum ${maxImages} images allowed.`);
    }

    const results = await uploadFn(filesToUpload);
    if (results.length > 0) {
      setImages(prev => [...prev, ...results]);
    }
    return results;
  }, [images.length, maxImages, uploadFn]);

  const removeImage = useCallback(async (url: string) => {
    const success = await removeFn(url);
    if (success) {
      setImages(prev => prev.filter(img => img.url !== url));
    }
    return success;
  }, [removeFn]);

  const clear = useCallback(() => {
    setImages([]);
  }, []);

  const imageUrls = images.map(img => img.url);

  return {
    images,
    imageUrls,
    addImages,
    removeImage,
    clear,
    uploading,
    error,
    progress,
    canAddMore: images.length < maxImages,
    remainingSlots: maxImages - images.length,
  };
}
