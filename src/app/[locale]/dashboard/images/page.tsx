"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ButtonGroup } from "@/components/ui/button-group";
import { Plus, Loader2, Trash2, Search, Upload, Image as ImageIcon, FolderPlus } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useTranslations } from "next-intl";
import { NativeSelect } from "@/components/ui/native-select";

type ImageData = {
  filename: string;
  url: string;
  size: number;
  created: string;
  modified: string;
};

type FolderData = {
  name: string;
};

export default function ImagesManagementPage() {
  const t = useTranslations("dashboard.images");
  const router = useRouter();
  const userRole = useUserRole();
  
  const [images, setImages] = useState<ImageData[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFolder, setUploadFolder] = useState<string>("general");
  const [newFolderName, setNewFolderName] = useState("");

  // Redirect non-admin users
  useEffect(() => {
    if (userRole && userRole !== "admin") {
      router.replace("/dashboard");
    }
  }, [userRole, router]);

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

  const fetchImages = async (folder = "", search = "") => {
    try {
      let url = "/api/images/list";
      const params = new URLSearchParams();
      if (folder) params.append("folder", folder);
      if (search) params.append("search", search);
      
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      } else {
        console.error("Failed to fetch images");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "admin") {
      fetchFolders();
      fetchImages();
    }
  }, [userRole]);

  const handleSearch = () => {
    setLoading(true);
    fetchImages(selectedFolder, searchQuery);
  };

  const handleUploadFile = async () => {
    if (!uploadFile) {
      alert(t("noFileSelected"));
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("folder", uploadFolder);

      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsUploadDialogOpen(false);
        setUploadFile(null);
        setUploadFolder("general");
        await fetchImages(selectedFolder, searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert(t("folderNameRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/images/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: newFolderName }),
      });

      if (response.ok) {
        setIsCreateFolderDialogOpen(false);
        setNewFolderName("");
        await fetchFolders();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create folder");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!selectedImage) return;
    setIsSubmitting(true);

    try {
      // Extract folder and filename from URL
      const urlParts = selectedImage.url.split('/');
      const filename = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];

      const response = await fetch(`/api/images/${folder}/${filename}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setSelectedImage(null);
        await fetchImages(selectedFolder, searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredImages = images.filter(img => {
    if (!searchQuery) return true;
    return img.filename.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  if (userRole !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCreateFolderDialogOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            {t("createFolder")}
          </Button>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            {t("uploadImage")}
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <NativeSelect
              value={selectedFolder}
              onChange={(e) => {
                setSelectedFolder(e.target.value);
                setLoading(true);
                fetchImages(e.target.value, searchQuery);
              }}
              className="w-full sm:w-[200px]"
            >
              <option value="">{t("allFolders")}</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </NativeSelect>
            <Button onClick={handleSearch} variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              {t("search")}
            </Button>
            {(searchQuery || selectedFolder) && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFolder("");
                  setLoading(true);
                  fetchImages("", "");
                }}
                variant="outline"
              >
                {t("clear")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("allImages")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("preview")}</TableHead>
                <TableHead>{t("filename")}</TableHead>
                <TableHead>{t("folder")}</TableHead>
                <TableHead>{t("size")}</TableHead>
                <TableHead>{t("created")}</TableHead>
                <TableHead>{t("url")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredImages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {t("noImagesFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredImages.map((image) => {
                  const urlParts = image.url.split('/');
                  const folder = urlParts[urlParts.length - 2];
                  
                  return (
                    <TableRow key={image.url}>
                      <TableCell>
                        <div className="w-16 h-16 relative rounded overflow-hidden border">
                          <img
                            src={image.url}
                            alt={image.filename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{image.filename}</TableCell>
                      <TableCell className="text-muted-foreground">{folder}</TableCell>
                      <TableCell>{formatFileSize(image.size)}</TableCell>
                      <TableCell className="text-sm">{formatDate(image.created)}</TableCell>
                      <TableCell>
                        <a 
                          href={image.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate block max-w-[200px]"
                        >
                          {image.url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <ButtonGroup>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(image.url);
                                alert(t("urlCopied"));
                              }}
                            >
                              {t("copy")}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedImage(image);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </ButtonGroup>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("uploadImageTitle")}</DialogTitle>
            <DialogDescription>
              {t("uploadImageDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder-select">{t("selectFolder")}</Label>
              <NativeSelect
                id="folder-select"
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value)}
              >
                <option value="general">general</option>
                {folders.map((folder) => (
                  <option key={folder} value={folder}>
                    {folder}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">{t("selectFile")}</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                disabled={isSubmitting}
              />
              {uploadFile && (
                <p className="text-sm text-muted-foreground">
                  {t("selected")}: {uploadFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadDialogOpen(false);
                setUploadFile(null);
              }}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleUploadFile}
              disabled={!uploadFile || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("uploading")}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("upload")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createFolderTitle")}</DialogTitle>
            <DialogDescription>
              {t("createFolderDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">{t("folderName")}</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder={t("folderNamePlaceholder")}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateFolderDialogOpen(false);
                setNewFolderName("");
              }}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("creating")}
                </>
              ) : (
                <>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  {t("create")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("areYouSure")}</DialogTitle>
            <DialogDescription>
              {t("deleteConfirmation")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteImage}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
