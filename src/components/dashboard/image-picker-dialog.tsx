"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Check, Loader2, Search, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageData = {
  filename: string;
  url: string;
  size: number;
  created: string;
  modified: string;
};

interface ImagePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the URL of the picked image. */
  onSelect: (url: string) => void;
  /** Currently selected image URL, highlighted in the grid. */
  value?: string | null;
  /** Folder preselected in the folder filter and used for uploads. */
  defaultFolder?: string;
  title?: string;
  description?: string;
}

/**
 * Reusable modal that browses the images already uploaded to the image service
 * and lets an admin pick one (or upload a new one and pick it right away).
 */
export function ImagePickerDialog({
  open,
  onOpenChange,
  onSelect,
  value,
  defaultFolder = "",
  title = "Wybierz obraz",
  description = "Wybierz przesłany obraz lub prześlij nowy.",
}: ImagePickerDialogProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(defaultFolder);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(value ?? null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchImages = useCallback(async (folder: string) => {
    setLoading(true);
    try {
      const url = folder
        ? `/api/images/list?folder=${encodeURIComponent(folder)}`
        : "/api/images/list";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    setSelectedUrl(value ?? null);

    const fetchFolders = async () => {
      try {
        const response = await fetch("/api/images/folders");
        if (response.ok) {
          const data = await response.json();
          setFolders(data.folders || []);
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
    fetchImages(selectedFolder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("folder", selectedFolder || defaultFolder || "general");

      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadFile(null);
        setSelectedFolder(data.folder);
        setSelectedUrl(data.url);
        await fetchImages(data.folder);
      } else {
        const error = await response.json();
        alert(error.error || "Nie udało się przesłać obrazu");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Nie udało się przesłać obrazu");
    } finally {
      setIsUploading(false);
    }
  };

  const filteredImages = searchQuery
    ? images.filter((img) =>
        img.filename.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : images;

  const handleConfirm = () => {
    if (!selectedUrl) return;
    onSelect(selectedUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj po nazwie pliku..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <NativeSelect
              value={selectedFolder}
              onChange={(e) => {
                setSelectedFolder(e.target.value);
                fetchImages(e.target.value);
              }}
              className="w-full sm:w-[200px]"
            >
              <option value="">Wszystkie foldery</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </NativeSelect>
          </div>

          {/* Image grid */}
          <div className="h-[320px] overflow-y-auto rounded-md border p-2">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Nie znaleziono obrazów
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {filteredImages.map((image) => {
                  const isSelected = selectedUrl === image.url;
                  return (
                    <button
                      key={image.url}
                      type="button"
                      onClick={() => setSelectedUrl(image.url)}
                      onDoubleClick={() => {
                        onSelect(image.url);
                        onOpenChange(false);
                      }}
                      className={cn(
                        "relative overflow-hidden rounded-md border-2 text-left transition-colors",
                        isSelected
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/40"
                      )}
                      title={image.filename}
                    >
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="h-24 w-full object-cover"
                      />
                      {isSelected && (
                        <span className="absolute right-1 top-1 rounded-full bg-primary p-1 text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      <span className="block truncate px-1 py-1 text-xs text-muted-foreground">
                        {image.filename}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Inline upload */}
          <div className="space-y-2 rounded-md border p-3">
            <Label htmlFor="image-picker-upload">
              Prześlij nowy obraz{" "}
              <span className="text-muted-foreground">
                (folder: {selectedFolder || defaultFolder || "general"})
              </span>
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="image-picker-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                disabled={isUploading}
              />
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!uploadFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Przesyłanie...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Prześlij
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedUrl}>
            Wybierz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
