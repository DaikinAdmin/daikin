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
import { Switch } from "@/components/ui/switch";
import { ButtonGroup } from "@/components/ui/button-group";
import { Plus, Loader2, Pencil, Trash2, Search } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useTranslations } from "next-intl";

type Benefit = {
  id: string;
  title: string;
  description: string;
  daikinCoins: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function BenefitsManagementPage() {
  const t = useTranslations("dashboard.benefits");
  const router = useRouter();
  const userRole = useUserRole();
  
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    daikinCoins: 0,
    isActive: true,
  });

  // Redirect non-admin users
  useEffect(() => {
    if (userRole && userRole !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [userRole, router]);

  const fetchBenefits = async (search = "") => {
    try {
      const url = search 
        ? `/api/benefits?search=${encodeURIComponent(search)}`
        : "/api/benefits";
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBenefits(data);
      } else {
        console.error("Failed to fetch benefits");
      }
    } catch (error) {
      console.error("Error fetching benefits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "ADMIN") {
      fetchBenefits();
    }
  }, [userRole]);

  const handleSearch = () => {
    setLoading(true);
    fetchBenefits(searchQuery);
  };

  const handleToggleActive = async (benefit: Benefit) => {
    try {
      const response = await fetch(`/api/benefits/${benefit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...benefit,
          isActive: !benefit.isActive,
        }),
      });

      if (response.ok) {
        await fetchBenefits(searchQuery);
      } else {
        alert("Failed to update benefit");
      }
    } catch (error) {
      console.error("Error updating benefit:", error);
      alert("Failed to update benefit");
    }
  };

  const handleOpenDialog = (benefit?: Benefit) => {
    if (benefit) {
      setEditingBenefit(benefit);
      setFormData({
        title: benefit.title,
        description: benefit.description,
        daikinCoins: benefit.daikinCoins,
        isActive: benefit.isActive,
      });
    } else {
      setEditingBenefit(null);
      setFormData({
        title: "",
        description: "",
        daikinCoins: 0,
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBenefit(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingBenefit 
        ? `/api/benefits/${editingBenefit.id}` 
        : "/api/benefits";
      
      const method = editingBenefit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseDialog();
        await fetchBenefits(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save benefit");
      }
    } catch (error) {
      console.error("Error saving benefit:", error);
      alert("Failed to save benefit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBenefit) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/benefits/${selectedBenefit.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setSelectedBenefit(null);
        await fetchBenefits(searchQuery);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete benefit");
      }
    } catch (error) {
      console.error("Error deleting benefit:", error);
      alert("Failed to delete benefit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userRole !== "ADMIN") {
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
        <Button data-testid="create-benefit" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addNewBenefit")}
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              {t("search")}
            </Button>
            {searchQuery && (
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setLoading(true);
                  fetchBenefits("");
                }}
                variant="outline"
              >
                {t("clear")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Benefits Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("allBenefits")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("benefitTitle")}</TableHead>
                <TableHead>{t("daikinCoins")}</TableHead>
                <TableHead>{t("createdAt")}</TableHead>
                <TableHead>{t("isActive")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benefits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("noBenefitsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                benefits.map((benefit) => (
                  <TableRow key={benefit.id}>
                    <TableCell className="font-medium">{benefit.title}</TableCell>
                    <TableCell>{benefit.daikinCoins}</TableCell>
                    <TableCell>
                      {new Date(benefit.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={benefit.isActive}
                        onCheckedChange={() => handleToggleActive(benefit)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(benefit)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedBenefit(benefit);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </ButtonGroup>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBenefit ? t("editBenefit") : t("createNewBenefit")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("benefitTitle")}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daikinCoins">{t("daikinCoins")}</Label>
                <Input
                  id="daikinCoins"
                  type="number"
                  min="0"
                  value={formData.daikinCoins}
                  onChange={(e) => setFormData({ ...formData, daikinCoins: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">{t("isActive")}</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (editingBenefit ? t("saving") : t("creating"))
                  : (editingBenefit ? t("save") : t("createBenefit"))
                }
              </Button>
            </DialogFooter>
          </form>
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
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("deleting") : t("deleteBenefit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
