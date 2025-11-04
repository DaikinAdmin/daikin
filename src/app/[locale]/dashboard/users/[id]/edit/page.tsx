"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save } from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  userDetails?: {
    id: string;
    dateOfBirth: string | null;
    street: string | null;
    apartmentNumber: string | null;
    city: string | null;
    postalCode: string | null;
    daikinCoins: number;
  };
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    emailVerified: false,
    twoFactorEnabled: false,
  });
  const [userDetails, setUserDetails] = useState({
    dateOfBirth: "",
    street: "",
    apartmentNumber: "",
    city: "",
    postalCode: "",
    daikinCoins: 0,
  });

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setFormData({
          role: data.role,
          email: data.email,
          emailVerified: data.emailVerified,
          twoFactorEnabled: data.twoFactorEnabled,
        });
        if (data.userDetails) {
          setUserDetails({
            dateOfBirth: data.userDetails.dateOfBirth
              ? new Date(data.userDetails.dateOfBirth).toISOString().split("T")[0]
              : "",
            street: data.userDetails.street || "",
            apartmentNumber: data.userDetails.apartmentNumber || "",
            city: data.userDetails.city || "",
            postalCode: data.userDetails.postalCode || "",
            daikinCoins: data.userDetails.daikinCoins || 0,
          });
        }
      } else {
        alert("Failed to fetch user");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("Failed to fetch user");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userDetails: {
            ...userDetails,
            dateOfBirth: userDetails.dateOfBirth || null,
          },
        }),
      });

      if (response.ok) {
        alert("User updated successfully");
        router.push("/dashboard/users");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!confirm("Are you sure you want to reset this user's password to 'P@ssw0rd'?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetPassword: true }),
      });

      if (response.ok) {
        alert("Password reset successfully");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password");
    }
  };

  const handleAddCoins = () => {
    const amount = prompt("Enter amount of Daikin Coins to add:");
    if (amount) {
      const coinsToAdd = parseInt(amount);
      if (!isNaN(coinsToAdd)) {
        setUserDetails({
          ...userDetails,
          daikinCoins: userDetails.daikinCoins + coinsToAdd,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit User: {user.name}</h1>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="emailVerified">Email Verified</Label>
            <Switch
              id="emailVerified"
              checked={formData.emailVerified}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, emailVerified: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="twoFactorEnabled">Two Factor Enabled</Label>
            <Switch
              id="twoFactorEnabled"
              checked={formData.twoFactorEnabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, twoFactorEnabled: checked })
              }
            />
          </div>

          <div className="pt-4">
            <Button variant="outline" onClick={handleResetPassword}>
              Reset Password to Default
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Details */}
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={userDetails.dateOfBirth}
              onChange={(e) =>
                setUserDetails({ ...userDetails, dateOfBirth: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              value={userDetails.street}
              onChange={(e) =>
                setUserDetails({ ...userDetails, street: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="apartmentNumber">Apartment Number</Label>
            <Input
              id="apartmentNumber"
              value={userDetails.apartmentNumber}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  apartmentNumber: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={userDetails.city}
              onChange={(e) =>
                setUserDetails({ ...userDetails, city: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              value={userDetails.postalCode}
              onChange={(e) =>
                setUserDetails({ ...userDetails, postalCode: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Daikin Coins */}
      <Card>
        <CardHeader>
          <CardTitle>Daikin Coins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="grid gap-2 flex-1">
              <Label htmlFor="daikinCoins">Current Balance</Label>
              <Input
                id="daikinCoins"
                type="number"
                value={userDetails.daikinCoins}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    daikinCoins: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <Button variant="outline" onClick={handleAddCoins} className="mt-8">
              Add Coins
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
