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
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Блокуємо scroll body
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape для закриття
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
    setIsSending(true);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setIsSent(true);
      } else {
        alert(t("errorMessage"));
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert(t("errorMessage"));
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setIsSent(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      interests: [],
      additional: "",
      credit: false,
    });
  };

  return (
    // Overlay
    // Mobile: items-end — bottom sheet
    // md+: items-center — класична модалка
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-[2px]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Panel */}
      <div
        className="
          w-full md:max-w-2xl
          bg-white shadow-2xl
          rounded-t-2xl md:rounded-2xl
          flex flex-col
          max-h-[92dvh] md:max-h-[90vh]
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — тільки мобайл */}
        <div className="flex justify-center pt-3 pb-1 md:hidden" aria-hidden>
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Скролований контент */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4 md:p-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-5">
            <h2 className="text-xl md:text-2xl font-bold leading-tight text-gray-900">
              {isSent ? t("successTitle", { defaultValue: "Wysłano!" }) : t("title")}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="-mr-1 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
              aria-label="Zamknij"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* ── Success screen ── */}
          {isSent && (
            <>
              <div className="flex flex-col items-center gap-4 py-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-center text-gray-800 font-semibold text-[17px]">
                  {t("successMessage")}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  {t("close")}
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={onClose}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  Zamknij
                </Button>
              </div>
            </>
          )}

          {/* ── Form ── */}
          {!isSent && (
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-4 mb-5">

                {/* Name */}
                <Input
                  label={t("name")}
                  placeholder={t("namePlaceholder")}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                {/* Email */}
                <Input
                  label={t("email")}
                  placeholder={t("emailPlaceholder")}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                {/* Phone */}
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
                  inputMode="tel"
                />

                {/* Interests */}
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

                {/* Additional */}
                <Input
                  label={t("message")}
                  placeholder={t("messagePlaceholder")}
                  name="additional"
                  value={form.additional}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </div>

              {/* Credit checkbox */}
              <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    name="credit"
                    checked={form.credit}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  {/* Кастомний чекбокс — більша зона тапу */}
                  <div
                    className="
                      w-5 h-5 rounded border-2 border-gray-300
                      peer-checked:bg-primary peer-checked:border-primary
                      peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30
                      group-hover:border-primary/60
                      transition-colors flex items-center justify-center
                    "
                  >
                    {form.credit && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[14px] leading-snug text-gray-600">
                  {t("credit")}{" "}
                  <a
                    href="https://www.bskobierzyce.pl/daikin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-800 active:opacity-70 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("creditLink")}
                  </a>
                </span>
              </label>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="secondary"
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  {t("close")}
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSending}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  {isSending ? "Wysyłanie…" : t("submit")}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};