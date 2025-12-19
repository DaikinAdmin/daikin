"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input } from "./ui/inputForm";
import { InputMultiSelect } from "./ui/InputMultiSelect";
import { Button } from "./ui/button";

interface InquiryFormValues {
  name: string;
  email: string;
  phone: string;
  interests: string[];
  additional: string;
  credit: boolean;
}

export const ModalInquiryForm: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const t = useTranslations("getQuoteModal");
  // Localized option labels from messages via `t`
  const PRODUCTS = [
    { label: t("interests.options.ac"), value: "ac" },
    { label: t("interests.options.hp"), value: "heatpump" },
    { label: t("interests.options.ap"), value: "airpurifier" },
  ];
  const SERVICES = [
    { label: t("interests.services.installation"), value: "installation" },
    { label: t("interests.services.maintenance"), value: "maintenance" },
  ];
  const INTERESTS = [
    { group: t("interests.groups.products"), options: PRODUCTS },
    { group: t("interests.groups.services"), options: SERVICES },
  ];
  const [form, setForm] = useState<InquiryFormValues>({
    name: "",
    email: "",
    phone: "",
    interests: [],
    additional: "",
    credit: false,
  });

  // Close on Escape key when modal is open
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert(
          t("successMessage")
        );
        onClose();
        // Очищаємо форму
        setForm({
          name: "",
          email: "",
          phone: "",
          interests: [],
          additional: "",
          credit: false,
        });
      } else {
        alert(t("errorMessage"));
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert(t("errorMessage"));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/20 px-4 py-6 overflow-y-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-h2-mobile md:text-h2">{t("title")}</h2>

        {/* Name */}
        <div className="mb-4">
          <Input
            label={t("name")}
            placeholder={t("namePlaceholder")}
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <Input
            label={t("email")}
            placeholder={t("emailPlaceholder")}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <Input
            label={t("phone")}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onFocus={() => {
              if (!form.phone || form.phone.trim() === "") {
                setForm((prev) => ({ ...prev, phone: "+48 " }));
              }
            }}
            required
            placeholder="+48 123 456 789"
            pattern="\+48 [0-9]{3} [0-9]{3} [0-9]{3}"
          />
        </div>

        {/* Interests */}
        <div className="mb-4">
          <InputMultiSelect
            label={t("product")}
            placeholder={t("productPlaceholder")}
            value={form.interests}
            groups={INTERESTS}
            onChange={(vals) =>
              setForm((prev) => ({ ...prev, interests: vals }))
            }
            required
          />
        </div>

        {/* Additional */}
        <div className="mb-4">
          <Input
            label={t("message")}
            placeholder={t("messagePlaceholder")}
            name="additional"
            value={form.additional}
            onChange={handleChange}
            multiline
            rows={5}
          />
        </div>

        {/* Credit */}
        <div className="mb-6">
          <label className="flex items-center text-main-text-mobile md:text-main-text gap-1">
            <input
              type="checkbox"
              name="credit"
              checked={form.credit}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            />
            <span>
              {t("credit")}{" "}
              <a
                href="https://www.bskobierzyce.pl/daikin/"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                {t("creditLink")}
              </a>
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full transition-colors flex-1 bg-amm"
            variant={"secondary"}
          >
            {t("close")}
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 rounded-full transition-colors flex-1 bg-primary text-white"
            variant={"default"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};
