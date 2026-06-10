"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/inputForm";

const VISIT_SLOTS = [
  { value: "12.06 9:00-14:00", label: "12.06 (piątek) 9:00–14:00" },
  { value: "12.06 14:00-17:00", label: "12.06 (piątek) 14:00–17:00" },
  { value: "13.06 9:00-14:00",  label: "13.06 (sobota) 9:00–14:00" },
];

const TOTAL_STEPS = 3;

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-1.5 mb-5">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          i < current
            ? "bg-primary flex-1"
            : i === current
            ? "bg-primary flex-[2]"
            : "bg-gray-200 flex-1"
        }`}
      />
    ))}
  </div>
);

const SlotCard: React.FC<{ label: string; selected: boolean; onClick: () => void }> = ({
  label,
  selected,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full min-h-[52px] text-left px-4 py-3 rounded-xl border-2 transition-all duration-150
      text-[15px] leading-snug font-medium active:scale-[0.98]
      ${
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50 text-gray-800"
      }`}
  >
    <span className="flex items-center gap-3">
      <span
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-150 ${
          selected ? "border-primary bg-primary" : "border-gray-300"
        }`}
      />
      {label}
    </span>
  </button>
);

const STEP_TITLES = [
  "Twoje dane kontaktowe",
  "Wybierz termin wizyty",
  "Informacje dodatkowe",
];

export const ModalVisitForm: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", info: "", slot: "" });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleReset = () => {
    setStep(0);
    setIsSent(false);
    setForm({ name: "", phone: "", email: "", info: "", slot: "" });
  };

  const handleBack = () => {
    if (step === 0) onClose();
    else setStep((s) => s - 1);
  };

  const canProceedStep0 = form.name.trim() !== "" && form.phone.trim() !== "";
  const canProceedStep1 = form.slot !== "";

  const handleNext = () => setStep((s) => s + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch("/api/visit-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setIsSent(true);
      } else {
        alert("Wystąpił błąd. Spróbuj ponownie.");
      }
    } catch {
      alert("Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setIsSending(false);
    }
  };

  const title = isSent ? "Wysłano!" : STEP_TITLES[step];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-[2px]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full md:max-w-lg bg-white shadow-2xl rounded-t-2xl md:rounded-2xl flex flex-col max-h-[92dvh] md:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 md:hidden" aria-hidden>
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-xl md:text-2xl font-bold leading-tight text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="-mr-1 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
              aria-label="Zamknij"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {!isSent && (
            <StepIndicator current={step} total={TOTAL_STEPS} />
          )}

          {/* ── Step 0: Contact ── */}
          {!isSent && step === 0 && (
            <>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
                Krok 1 z {TOTAL_STEPS}
              </p>
              <div className="flex flex-col gap-3.5 mb-6">
                <Input
                  label="Imię i nazwisko"
                  placeholder="Jan Kowalski"
                  name="name"
                  value={form.name}
                  onChange={set("name")}
                  required
                />
                <Input
                  label="Numer telefonu"
                  placeholder="+48 600 000 000"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  required
                />
                <Input
                  label="E-mail (opcjonalnie)"
                  placeholder="jan@example.com"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  Anuluj
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleNext}
                  disabled={!canProceedStep0}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  Dalej
                </Button>
              </div>
            </>
          )}

          {/* ── Step 1: Time slot ── */}
          {!isSent && step === 1 && (
            <>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
                Krok 2 z {TOTAL_STEPS}
              </p>
              <div className="flex flex-col gap-2.5 mb-6">
                {VISIT_SLOTS.map((s) => (
                  <SlotCard
                    key={s.value}
                    label={s.label}
                    selected={form.slot === s.value}
                    onClick={() => setForm((p) => ({ ...p, slot: s.value }))}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  Wróć
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleNext}
                  disabled={!canProceedStep1}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  Dalej
                </Button>
              </div>
            </>
          )}

          {/* ── Step 2: Notes + Submit ── */}
          {!isSent && step === 2 && (
            <form onSubmit={handleSubmit}>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
                Krok 3 z {TOTAL_STEPS}
              </p>

              {/* Summary */}
              <div className="rounded-xl bg-gray-50 px-4 py-3 mb-5 flex flex-col gap-2">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-400">Imię i nazwisko</span>
                  <span className="font-medium text-gray-700 text-right">{form.name}</span>
                </div>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-400">Telefon</span>
                  <span className="font-medium text-gray-700 text-right">{form.phone}</span>
                </div>
                {form.email && (
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-400">E-mail</span>
                    <span className="font-medium text-gray-700 text-right">{form.email}</span>
                  </div>
                )}
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-gray-400">Termin</span>
                  <span className="font-medium text-gray-700 text-right">{form.slot}</span>
                </div>
              </div>

              <div className="mb-6">
                <Input
                  label="Informacje dodatkowe (opcjonalnie)"
                  placeholder="Napisz nam coś więcej…"
                  name="info"
                  multiline
                  rows={4}
                  value={form.info}
                  onChange={set("info")}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  Wróć
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSending}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  {isSending ? "Wysyłanie…" : "Wyślij"}
                </Button>
              </div>
            </form>
          )}

          {/* ── Success ── */}
          {isSent && (
            <>
              <div className="flex flex-col items-center gap-4 py-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-center text-gray-800 font-semibold text-[17px]">
                  Zgłoszenie zostało wysłane!
                </p>
                <p className="text-center text-sm text-gray-500">
                  Skontaktujemy się z Tobą wkrótce, aby potwierdzić wizytę.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  Wyślij ponownie
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
        </div>
      </div>
    </div>
  );
};
