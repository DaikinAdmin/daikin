"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalQuizForm } from "@/components/modal-quiz-form";

const STEPS = ["Metraż", "Instalacja", "Rok budowy"] as const;

export function QuizSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-gradient-to-br from-primary/5 via-white to-primary/8 border-y border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">

          {/* Left: text */}
          <div className="flex-1">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Dobór pompy ciepła
            </span>

            <h2 className="text-h2-mobile md:text-h2 text-gray-900 mb-3">
              Odpowiedz na 3 pytania
            </h2>
            <p className="text-main-text-mobile md:text-main-text text-gray-500 max-w-md mb-6">
              i dowiedz się, który model pompy ciepła Daikin jest idealnie dopasowany do metrażu, instalacji i roku budowy Twojego domu.
            </p>

            {/* Step indicators */}
            <div className="flex items-center gap-2 flex-wrap">
              {STEPS.map((label, i) => (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-600">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <span className="text-gray-300 mx-1">›</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex-shrink-0 flex flex-col items-stretch md:items-end gap-3">
            <Button
              type="button"
              onClick={() => setOpen(true)}
              className="group relative overflow-hidden px-8 py-5 rounded-full text-base font-medium transition-all duration-200 w-full md:w-auto"
            >
              <span className="relative flex items-center gap-2.5">
                Dobierz swoją pompę
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Button>
            <p className="text-[12px] text-gray-400 text-center md:text-right">
              Bezpłatne doradztwo · Zajmuje ~1 minutę
            </p>
          </div>

        </div>
      </div>

      <ModalQuizForm open={open} onClose={() => setOpen(false)} />
    </section>
  );
}