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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Gift, Coins } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useTranslations } from "next-intl";

type Benefit = {
  id: string;
  title: string;
  description: string;
  daikinCoins: number;
};

type RedeemedBenefit = {
  id: string;
  benefitTitle: string;
  benefitDescription: string;
  daikinCoins: number;
  redeemedAt: string;
};

export default function UserBenefitsPage() {
  const t = useTranslations("dashboard.userBenefits");
  const router = useRouter();
  const userRole = useUserRole();
  const { userProfile, error: profileError } = useUserProfile();

  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [redeemedBenefits, setRedeemedBenefits] = useState<RedeemedBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Redirect non-user roles
  useEffect(() => {
    if (userRole && userRole !== "USER") {
      router.replace("/dashboard");
    }
  }, [userRole, router]);

  const fetchBenefits = async () => {
    try {
      const response = await fetch("/api/benefits/user/available");
      if (response.ok) {
        const data = await response.json();
        setBenefits(data);
      } else {
        console.error("Failed to fetch benefits");
      }
    } catch (error) {
      console.error("Error fetching benefits:", error);
    }
  };

  const fetchRedeemedBenefits = async () => {
    try {
      const response = await fetch("/api/benefits/user/redeemed");
      if (response.ok) {
        const data = await response.json();
        setRedeemedBenefits(data);
      } else {
        console.error("Failed to fetch redeemed benefits");
      }
    } catch (error) {
      console.error("Error fetching redeemed benefits:", error);
    }
  };

  useEffect(() => {
    if (userRole === "USER") {
      const fetchData = async () => {
        await Promise.all([fetchBenefits(), fetchRedeemedBenefits()]);
        setLoading(false);
      };
      fetchData();
    } else if (userRole) {
      // If we know the role and it's not USER, stop loading
      setLoading(false);
    }
  }, [userRole]);
  
  // Separate effect to stop loading once profile is available for USER role
  useEffect(() => {
    if (userRole === "USER" && userProfile?.userDetails) {
      setLoading(false);
    }
  }, [userRole, userProfile]);

  const handleOpenDialog = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setIsDialogOpen(true);
  };

  const handleRedeemBenefit = async () => {
    if (!selectedBenefit) return;

    setIsRedeeming(true);
    try {
      const response = await fetch("/api/benefits/user/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ benefitId: selectedBenefit.id }),
      });

      if (response.ok) {
        // Refresh data
        await fetchBenefits();
        await fetchRedeemedBenefits();
        // Refresh profile to update daikinCoins
        window.location.reload();
        setIsDialogOpen(false);
        setSelectedBenefit(null);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to redeem benefit");
      }
    } catch (error) {
      console.error("Error redeeming benefit:", error);
      alert("An error occurred while redeeming the benefit");
    } finally {
      setIsRedeeming(false);
    }
  };

  const canAfford = (benefitCost: number) => {
    return userProfile?.userDetails && userProfile.userDetails.daikinCoins >= benefitCost;
  };

  const coinsNeeded = (benefitCost: number) => {
    if (!userProfile?.userDetails) return benefitCost;
    return benefitCost - userProfile.userDetails.daikinCoins;
  };

  if (loading || !userProfile || !userProfile.userDetails) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
        <Loader2 className="h-8 w-8 animate-spin text-[#003D7A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="user-benefits-page">{/* Header with User Coins */}
      <Card className="bg-gradient-to-r from-[#003D7A] to-[#0051A3] text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Coins className="h-6 w-6" />
            {t("greeting", { name: userProfile.name })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            {t("yourCoins", { coins: userProfile.userDetails.daikinCoins })}
          </div>
          <p className="text-white/90">{t("benefitsDescription")}</p>
        </CardContent>
      </Card>

      {/* Redeemed Benefits Section */}
      {redeemedBenefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              {t("redeemedBenefits")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="redeemed-benefits">
                <AccordionTrigger>
                  {t("viewRedeemedBenefits")} ({redeemedBenefits.length})
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("benefitTitle")}</TableHead>
                        <TableHead>{t("description")}</TableHead>
                        <TableHead>{t("daikinCoins")}</TableHead>
                        <TableHead>{t("dateOfRedeem")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {redeemedBenefits.map((benefit) => (
                        <TableRow key={benefit.id}>
                          <TableCell className="font-medium">
                            {benefit.benefitTitle}
                          </TableCell>
                          <TableCell>{benefit.benefitDescription}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F5F8FF] text-[#003D7A] text-sm font-medium">
                              <Coins className="h-3 w-3" />
                              {benefit.daikinCoins}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(benefit.redeemedAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Available Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>{t("availableBenefits")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("benefitTitle")}</TableHead>
                <TableHead>{t("description")}</TableHead>
                <TableHead>{t("daikinCoins")}</TableHead>
                <TableHead className="text-right">{t("action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benefits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    {t("noBenefitsAvailable")}
                  </TableCell>
                </TableRow>
              ) : (
                benefits.map((benefit) => {
                  const affordable = canAfford(benefit.daikinCoins);
                  const needed = coinsNeeded(benefit.daikinCoins);

                  return (
                    <TableRow key={benefit.id} data-testid="benefit-card">
                      <TableCell className="font-medium">{benefit.title}</TableCell>
                      <TableCell>{benefit.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F5F8FF] text-[#003D7A] text-sm font-medium">
                          <Coins className="h-3 w-3" />
                          {benefit.daikinCoins}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          {affordable ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleOpenDialog(benefit)}
                              className="bg-[#003D7A] hover:bg-[#0051A3]"
                              data-testid="redeem-benefit"
                            >
                              {t("redeem")}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="cursor-not-allowed"
                            >
                              {t("needMoreCoins", { coins: needed })}
                            </Button>
                          )}
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

      {/* Redeem Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmRedemption")}</DialogTitle>
            <DialogDescription>
              {selectedBenefit && t("confirmMessage", {
                title: selectedBenefit.title,
                coins: selectedBenefit.daikinCoins
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-[#F5F8FF] p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{t("currentBalance")}:</span>
                <span className="font-bold text-[#003D7A]">
                  {userProfile?.userDetails?.daikinCoins} {t("coins")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{t("cost")}:</span>
                <span className="font-bold text-red-600">
                  -{selectedBenefit?.daikinCoins} {t("coins")}
                </span>
              </div>
              <div className="border-t border-[#003D7A]/20 pt-2 flex justify-between">
                <span className="font-medium">{t("newBalance")}:</span>
                <span className="font-bold text-[#003D7A]">
                  {userProfile?.userDetails && selectedBenefit
                    ? userProfile.userDetails.daikinCoins - selectedBenefit.daikinCoins
                    : 0}{" "}
                  {t("coins")}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedBenefit(null);
              }}
              disabled={isRedeeming}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleRedeemBenefit}
              disabled={isRedeeming}
              className="bg-[#003D7A] hover:bg-[#0051A3]"
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("redeeming")}
                </>
              ) : (
                t("confirmRedeem")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
