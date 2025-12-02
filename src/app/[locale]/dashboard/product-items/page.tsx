"use client";

import { useEffect, useState } from "react";
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
import { Plus, Loader2, Pencil, Trash2, Upload, FileUp } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useTranslations } from "next-intl";
import { ProductItemsTab } from "@/components/dashboard/products/product-items-tab";
import { ProductItem } from "@/types/product-items";

type ProductItemLookup = {
  id: string;
  title: string;
  slug: string;
  img: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lookupItemDetails: {
    locale: string;
    title: string;
    subtitle: string;
    isActive: boolean;
  }[];
};

export default function ProductItemsPage() {
  const t = useTranslations("dashboard.productItems");
  const userRole = useUserRole();

  const [items, setItems] = useState<ProductItemLookup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductItemLookup | null>(null);
  const [deletingItem, setDeletingItem] = useState<ProductItemLookup | null>(null);
  const [formItems, setFormItems] = useState<ProductItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  useEffect(() => {
    if (userRole === "admin") {
      fetchItems();
    }
  }, [userRole]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/product-items-lookup?includeInactive=true");
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      alert("Failed to fetch product items");
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormItems([
      {
        title: "",
        slug: "",
        img: "",
        isActive: true,
        translations: [
          { locale: "en", title: "", subtitle: "", isActive: true },
          { locale: "pl", title: "", subtitle: "", isActive: true },
          { locale: "ua", title: "", subtitle: "", isActive: true },
        ],
      },
    ]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ProductItemLookup) => {
    setEditingItem(item);
    setFormItems([
      {
        id: item.id,
        title: item.title,
        slug: item.slug,
        img: item.img || "",
        isActive: item.isActive,
        translations: item.lookupItemDetails.map((detail) => ({
          locale: detail.locale,
          title: detail.title,
          subtitle: detail.subtitle,
          isActive: detail.isActive,
        })),
      },
    ]);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (item: ProductItemLookup) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const itemData = formItems[0];

      if (!itemData.title || !itemData.slug) {
        alert("Title and slug are required");
        return;
      }

      const payload = {
        title: itemData.title,
        slug: itemData.slug,
        img: itemData.img || null,
        isActive: itemData.isActive,
        translations: itemData.translations,
      };

      const response = await fetch(
        editingItem
          ? `/api/product-items-lookup/${editingItem.id}`
          : "/api/product-items-lookup",
        {
          method: editingItem ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save item");
      }

      console.log(`Product item ${editingItem ? "updated" : "created"} successfully`);

      setIsDialogOpen(false);
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      alert(error instanceof Error ? error.message : "Failed to save item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/product-items-lookup/${deletingItem.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete item");
      }

      console.log("Product item deleted successfully");

      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(error instanceof Error ? error.message : "Failed to delete item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      alert("Please select a JSON file");
      return;
    }

    try {
      setSubmitting(true);
      const fileContent = await bulkFile.text();
      const itemsData = JSON.parse(fileContent);

      if (!Array.isArray(itemsData)) {
        throw new Error("JSON file must contain an array of items");
      }

      const response = await fetch("/api/product-items-lookup/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload items");
      }

      const result = await response.json();

      console.log("Bulk Upload Complete:", result.message);

      setIsBulkDialogOpen(false);
      setBulkFile(null);
      fetchItems();
    } catch (error) {
      console.error("Error bulk uploading items:", error);
      alert(error instanceof Error ? error.message : "Failed to upload items");
    } finally {
      setSubmitting(false);
    }
  };

  if (userRole !== "admin") {
    return (
      <div className="container mx-auto py-8">
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("description")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsBulkDialogOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            {t("bulkUpload")}
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            {t("addItem")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("itemsList")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t("noItems")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("image")}</TableHead>
                  <TableHead>{t("title")}</TableHead>
                  <TableHead>{t("slug")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.isActive ? t("active") : t("inactive")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(item)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? t("editItem") : t("createItem")}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? t("editItemDescription") : t("createItemDescription")}
            </DialogDescription>
          </DialogHeader>
          <ProductItemsTab
            items={formItems}
            onChange={setFormItems}
            t={t}
            disabled={submitting}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={submitting}
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("save")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("bulkUploadTitle")}</DialogTitle>
            <DialogDescription>{t("bulkUploadDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="bulk-file" className="text-sm font-medium">
                {t("selectFile")}
              </label>
              <input
                id="bulk-file"
                type="file"
                accept=".json"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBulkFile(e.target.files?.[0] || null)}
                disabled={submitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsBulkDialogOpen(false);
                setBulkFile(null);
              }}
              disabled={submitting}
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleBulkUpload} disabled={submitting || !bulkFile}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("uploading")}
                </>
              ) : (
                <>
                  <FileUp className="h-4 w-4 mr-2" />
                  {t("upload")}
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
            <DialogTitle>{t("deleteItemTitle")}</DialogTitle>
            <DialogDescription>
              {t("deleteItemDescription")} <strong>{deletingItem?.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingItem(null);
              }}
              disabled={submitting}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                t("delete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
