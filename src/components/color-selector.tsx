"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

export interface ColorItem {
  hex: string;
  label: string;
}

export type ColorsMap = Record<string, ColorItem>;

interface ColorPickerButtonProps {
  value: string | null;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export default function ColorPickerButton({
  value,
  onChange,
  disabled = false,
}: ColorPickerButtonProps) {
  const t = useTranslations("colors");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const colors = t.raw("items") as ColorsMap;
  const texts = t.raw("texts") as Record<string, string>;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 border rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {value && colors[value] ? (
          <>
            <span
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: colors[value].hex }}
            />
            {colors[value].label}
          </>
        ) : (
          texts.select
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute mt-1 w-56 bg-white border rounded-md shadow-lg z-[1000] max-h-60 overflow-y-auto">
          <div className="p-2 space-y-1">
            {Object.entries(colors).map(([key, col]) => (
              <button
                key={key}
                onClick={() => {
                  onChange(col.hex); 
                  setOpen(false);
                }}
                className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-md text-left"
              >
                <span
                  className="w-5 h-5 rounded-full border"
                  style={{ backgroundColor: col.hex }}
                />
                <span>{col.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-full py-2 border-t text-center hover:bg-gray-50"
          >
            {texts.close}
          </button>
        </div>
      )}
    </div>
  );
}
