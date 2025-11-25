"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordSchema } from "@/helpers/zod/signup-schema";
import { FormSuccess } from "@/components/form-success";
import FormError from "@/components/form-error";
import { useAuthState } from "@/hooks/use-auth-state";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { Calendar, Lock } from "lucide-react";

const postalCodeRegex = /^\d{2}-\d{3}$/;
const phoneNumberRegex = /^[1-9]\d{8}$/;

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().optional(),
  street: z.string().optional(),
  apartmentNumber: z.string().optional(),
  city: z.string().optional(),
  postalCode: z
    .string()
    .regex(postalCodeRegex, "Postal code must be in format XX-XXX")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(
      phoneNumberRegex,
      "Phone number must be 9 digits and cannot start with 0"
    )
    .optional()
    .or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const t = useTranslations("dashboard.profile");
  const { data: session } = useSession();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    error: twoFactorError,
    success: twoFactorSuccess,
    loading: twoFactorLoading,
    setLoading: setTwoFactorLoading,
    setSuccess: setTwoFactorSuccess,
    setError: setTwoFactorError,
    resetState,
  } = useAuthState();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      street: "",
      apartmentNumber: "",
      city: "",
      postalCode: "",
      phoneNumber: "",
    },
  });

  const twoFactorForm = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();

        // Extract data from userDetails if it exists
        const userDetails = data.userDetails || {};

        profileForm.reset({
          name: data.name || "",
          dateOfBirth: userDetails.dateOfBirth
            ? new Date(userDetails.dateOfBirth).toISOString().split("T")[0]
            : "",
          street: userDetails.street || "",
          apartmentNumber: userDetails.apartmentNumber || "",
          city: userDetails.city || "",
          postalCode: userDetails.postalCode || "",
          phoneNumber: userDetails.phoneNumber || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(t("errorMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  const onProfileSubmit = async (values: ProfileFormData) => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSuccess(t("successMessage"));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t("errorMessage"));
      }
    } catch (err) {
      setError(t("errorMessage"));
    }
  };

  const onTwoFactorSubmit = async (values: z.infer<typeof PasswordSchema>) => {
    if (session?.user.twoFactorEnabled === false) {
      await authClient.twoFactor.enable(
        {
          password: values.password,
        },
        {
          onResponse: () => {
            setTwoFactorLoading(false);
          },
          onRequest: () => {
            resetState();
            setTwoFactorLoading(true);
          },
          onSuccess: () => {
            setTwoFactorSuccess("Enabled two-factor authentication");
            setTimeout(() => {
              setTwoFactorDialogOpen(false);
              resetState();
              twoFactorForm.reset();
            }, 1000);
          },
          onError: (ctx) => {
            setTwoFactorError(ctx.error.message);
          },
        }
      );
    }
    if (session?.user.twoFactorEnabled === true) {
      await authClient.twoFactor.disable(
        {
          password: values.password,
        },
        {
          onResponse: () => {
            setTwoFactorLoading(false);
          },
          onRequest: () => {
            resetState();
            setTwoFactorLoading(true);
          },
          onSuccess: () => {
            setTwoFactorSuccess("Disabled two-factor authentication");
            setTimeout(() => {
              setTwoFactorDialogOpen(false);
              resetState();
              twoFactorForm.reset();
            }, 1000);
          },
          onError: (ctx) => {
            setTwoFactorError(ctx.error.message);
          },
        }
      );
    }
  };

  if (!session?.user) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            {t("subtitle")}
          </p>
        </div>
        <div className="text-center py-12">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
      <div>
        <h1 className="text-h1-mobile md:text-h1">{t("title")}</h1>
        <p className="mt-2 text-subtitle-mobile md:text-subtitle text-amm">
          {t("subtitle")}
        </p>
      </div>

      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                {t("personalInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {t("name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          className="text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel className="text-sm sm:text-base">
                    {t("email")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      value={session.user.email}
                      disabled
                      className="bg-gray-50 text-sm sm:text-base"
                    />
                  </FormControl>
                </FormItem>
              </div>

              <FormField
                control={profileForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm sm:text-base">
                      <Calendar className="h-4 w-4" />
                      {t("dateOfBirth")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                {t("address")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={profileForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      {t("phoneNumber")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("phoneNumberPlaceholder")}
                        {...field}
                        className="text-sm sm:text-base"
                        maxLength={9}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {t("street")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="text-sm sm:text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="apartmentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {t("apartmentNumber")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="text-sm sm:text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={profileForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {t("city")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="text-sm sm:text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {t("postalCode")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("postalCodePlaceholder")}
                          {...field}
                          className="text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                {t("security")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 2FA Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
                <div className="flex-1">
                  <h3 className="font-medium text-sm sm:text-base">
                    {t("twoFactor")}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {t("twoFactorDescription")}
                  </p>
                </div>
                <Switch
                  checked={session.user.twoFactorEnabled || false}
                  onCheckedChange={() => setTwoFactorDialogOpen(true)}
                />
              </div>

              {/* Change Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3 sm:gap-0">
                <div className="flex-1">
                  <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                    <Lock className="h-4 w-4" />
                    {t("changePassword")}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {t("changePasswordDescription")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/reset-password")}
                  className="w-full sm:w-auto text-sm"
                >
                  {t("changePasswordButton")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Messages */}
          {success && <FormSuccess message={success} />}
          {error && <FormError message={error} />}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="px-4 py-2 mt-3 rounded-full w-full transition-colors font-medium"
            variant={"default"}
          >
            {profileForm.formState.isSubmitting
              ? t("saving")
              : t("saveChanges")}
          </Button>
        </form>
      </Form>

      {/* 2FA Dialog */}
      <Dialog open={twoFactorDialogOpen} onOpenChange={setTwoFactorDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Confirm selection
            </DialogTitle>
            <DialogDescription className="text-sm">
              Please enter your password to confirm selection
            </DialogDescription>
            <Form {...twoFactorForm}>
              <form
                onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)}
                className="space-y-4 pt-4"
              >
                <FormField
                  control={twoFactorForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={twoFactorLoading}
                          type="password"
                          placeholder="********"
                          {...field}
                          className="text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormSuccess message={twoFactorSuccess} />
                <FormError message={twoFactorError} />
                <Button
                  type="submit"
                  className="w-full mt-4 text-sm sm:text-base"
                  disabled={twoFactorLoading}
                >
                  Submit
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
