"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/inputForm";
import {
  type ProductKey,
  type QuizAnswers,
  QUESTIONS,
  ANSWER_KEYS,
  PRODUCTS,
  getResultKeys,
  isAnswersFilled,
} from "../resources/quizData";

// ─── StepIndicator ────────────────────────────────────────────────────────────

const StepIndicator: React.FC<{ current: number; total: number }> = ({
  current,
  total,
}) => (
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

// ─── OptionCard ───────────────────────────────────────────────────────────────
// min-h-[52px] — достатньо для комфортного тапу пальцем (рекомендація Apple/Google: ≥44px)

const OptionCard: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, selected, onClick }) => (
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

// ─── ResultCard ───────────────────────────────────────────────────────────────

const ResultCard: React.FC<{ productKey: ProductKey }> = ({ productKey }) => {
  const product = PRODUCTS[productKey];
  const hasLinks = product.links.length > 0;

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
        {productKey}
      </p>
      <p className="text-[15px] font-semibold text-gray-800 mb-3">
        {product.name}
      </p>
      {hasLinks ? (
        <ul className="flex flex-col gap-1.5">
          {product.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline underline-offset-2 active:opacity-70 transition-opacity"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 italic">Oferta wkrótce dostępna</p>
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export const ModalQuizForm: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    area: null,
    installation: null,
    year: null,
  });
  const [isContact, setIsContact] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });

  // Блокуємо scroll body коли модалка відкрита
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const currentKey = ANSWER_KEYS[step];
  const currentQuestion = QUESTIONS[step];
  const currentAnswer = answers[currentKey];

  const isLastQuestion = step === QUESTIONS.length - 1;
  const isResult = step === QUESTIONS.length;

  const handleSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentKey]: value }));
  };

  const handleNext = () => setStep((s) => s + 1);

  const handleBack = () => {
    if (step === 0) onClose();
    else setStep((s) => s - 1);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({ area: null, installation: null, year: null });
    setIsContact(false);
    setIsSent(false);
    setContact({ name: "", email: "", phone: "" });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch("/api/quiz-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, answers, resultKeys }),
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

  const resultKeys =
    isResult && isAnswersFilled(answers) ? getResultKeys(answers) : [];

  const title = isSent
    ? "Wysłano!"
    : isContact
    ? "Twoje dane kontaktowe"
    : isResult
    ? "Twój dobór pompy ciepła"
    : "Dobierz pompę ciepła";

  return (
    // Overlay
    // На мобайлі: items-end — панель виїжджає знизу (bottom sheet)
    // На md+: items-center — класична центрована модалка
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-[2px]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Panel */}
      {/* На мобайлі: повна ширина, заокруглення тільки зверху, max-h 92dvh зі скролом */}
      {/* На md+: max-w-lg, заокруглення з усіх боків */}
      <div
        className={`
          w-full md:max-w-lg
          bg-white shadow-2xl
          rounded-t-2xl md:rounded-2xl
          flex flex-col
          max-h-[92dvh] md:max-h-[90vh]
          overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — тільки на мобайлі */}
        <div className="flex justify-center pt-3 pb-1 md:hidden" aria-hidden>
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Скролований контент */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-xl md:text-2xl font-bold leading-tight text-gray-900">
              {title}
            </h2>
            {/* Збільшена зона тапу для close: p-2 = 44px+ */}
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

          {/* Progress */}
          <StepIndicator
            current={isResult ? QUESTIONS.length : step}
            total={QUESTIONS.length}
          />

          {/* ── Question screen ── */}
          {!isResult && (
            <>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                Pytanie {step + 1} z {QUESTIONS.length}
              </p>
              <p className="text-[17px] md:text-lg font-semibold text-gray-900 mb-1 leading-snug">
                {currentQuestion.question}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {currentQuestion.hint}
              </p>

              <div className="flex flex-col gap-2.5 mb-6">
                {currentQuestion.options.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={currentAnswer === opt.value}
                    onClick={() => handleSelect(opt.value)}
                  />
                ))}
              </div>

              {/* Кнопки — min-h-[48px] для зручного тапу */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  {step === 0 ? "Anuluj" : "Wróć"}
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleNext}
                  disabled={currentAnswer === null}
                  className="flex-1 min-h-[48px] rounded-full text-[15px]"
                >
                  {isLastQuestion ? "Zobacz wynik" : "Dalej"}
                </Button>
              </div>
            </>
          )}

          {/* ── Result screen ── */}
          {isResult && (
            <>
              {/* Result view */}
              {!isContact && !isSent && (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    Na podstawie Twoich odpowiedzi rekomendujemy:
                  </p>

                  {resultKeys.length > 0 ? (
                    <div className="flex flex-col gap-3 mb-5">
                      {resultKeys.map((key) => (
                        <ResultCard key={key} productKey={key} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic mb-5">
                      Nie znaleziono dopasowania. Skontaktuj się z nami.
                    </p>
                  )}

                  {/* Summary */}
                  <div className="rounded-xl bg-gray-50 px-4 py-3 mb-6 flex flex-col gap-2">
                    {QUESTIONS.map((q, i) => {
                      const key = ANSWER_KEYS[i];
                      const val = answers[key];
                      const label =
                        val !== null
                          ? q.options.find((o) => o.value === val)?.label
                          : "—";
                      return (
                        <div
                          key={q.id}
                          className="flex justify-between gap-3 text-sm"
                        >
                          <span className="text-gray-400 leading-snug">
                            {q.question}
                          </span>
                          <span className="font-medium text-gray-700 text-right leading-snug">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleReset}
                      className="flex-1 min-h-[48px] rounded-full text-[15px]"
                    >
                      Od nowa
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => setIsContact(true)}
                      className="flex-1 min-h-[48px] rounded-full text-[15px]"
                    >
                      Wyślij zapytanie
                    </Button>
                  </div>
                </>
              )}

              {/* Contact form */}
              {isContact && !isSent && (
                <form onSubmit={handleContactSubmit}>
                  <p className="text-sm text-gray-500 mb-5">
                    Podaj swoje dane, a nasz doradca skontaktuje się z Tobą
                    i prześle szczegółową ofertę.
                  </p>
                  <div className="flex flex-col gap-3.5 mb-6">
                    <Input
                      label="Imię i nazwisko"
                      placeholder="Jan Kowalski"
                      name="name"
                      value={contact.name}
                      onChange={(e) =>
                        setContact((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                    />
                    <Input
                      label="Adres e-mail"
                      placeholder="jan@example.com"
                      name="email"
                      type="email"
                      value={contact.email}
                      onChange={(e) =>
                        setContact((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                    />
                    <Input
                      label="Numer telefonu"
                      placeholder="+48 600 000 000"
                      name="phone"
                      type="tel"
                      value={contact.phone}
                      onChange={(e) =>
                        setContact((p) => ({ ...p, phone: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsContact(false)}
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

              {/* Success */}
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
                      Twoje zapytanie zostało wysłane!
                    </p>
                    <p className="text-center text-sm text-gray-500">
                      Skontaktujemy się z Tobą wkrótce.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleReset}
                      className="flex-1 min-h-[48px] rounded-full text-[15px]"
                    >
                      Zacznij od nowa
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};