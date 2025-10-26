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
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useTranslations } from "next-intl";

type RedeemedBenefit = {
  id: string;
  userId: string;
  redeemedAt: string;
  comment: string | null;
  benefitDescription: {
    id: string;
    title: string;
    daikinCoins: number;
  };
};

export default function BenefitsRedeemedPage() {
  const t = useTranslations("dashboard.benefitsRedeemed");
  const router = useRouter();
  const userRole = useUserRole();
  
  const [redeemedBenefits, setRedeemedBenefits] = useState<RedeemedBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect non-admin users
  useEffect(() => {
    if (userRole && userRole !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [userRole, router]);

  const fetchRedeemedBenefits = async (search = "") => {
    try {
      const url = search 
        ? `/api/benefits-redeemed?search=${encodeURIComponent(search)}`
        : "/api/benefits-redeemed";
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRedeemedBenefits(data);
      } else {
        console.error("Failed to fetch redeemed benefits");
      }
    } catch (error) {
      console.error("Error fetching redeemed benefits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === "ADMIN") {
      fetchRedeemedBenefits();
    }
  }, [userRole]);

  const handleSearch = () => {
    setLoading(true);
    fetchRedeemedBenefits(searchQuery);
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
                  fetchRedeemedBenefits("");
                }}
                variant="outline"
              >
                {t("clear")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Redeemed Benefits Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("allRedeemed")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("benefitTitle")}</TableHead>
                <TableHead>{t("userEmail")}</TableHead>
                <TableHead>{t("daikinCoins")}</TableHead>
                <TableHead>{t("redeemedAt")}</TableHead>
                <TableHead>{t("comment")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redeemedBenefits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("noRedeemedFound")}
                  </TableCell>
                </TableRow>
              ) : (
                redeemedBenefits.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.benefitDescription.title}
                    </TableCell>
                    <TableCell>{item.userId}</TableCell>
                    <TableCell>{item.benefitDescription.daikinCoins}</TableCell>
                    <TableCell>
                      {new Date(item.redeemedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.comment || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
