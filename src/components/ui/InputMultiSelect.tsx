import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import React, { useRef, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface Group {
  group: string;
  options: Option[];
}

interface InputMultiSelectProps {
  label: string;
  placeholder?: string;
  value: string[];
  groups: Group[];
  onChange: (value: string[]) => void;
  required?: boolean;
}

export const InputMultiSelect: React.FC<InputMultiSelectProps> = ({
  label,
  placeholder,
  value,
  groups,
  onChange,
  required,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleToggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectedLabels = groups
    .flatMap((g) => g.options)
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-main-text-mobile md:text-main-text text-amm mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <button
        type="button"
        className="w-full rounded-full px-4 py-4 text-sm focus:outline-none bg-[#f1fbff] focus:ring-2 focus:ring-primary text-left flex justify-between items-center"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={selectedLabels.length > 0 ? "" : "text-gray-400"}>
          {selectedLabels.length > 0
            ? selectedLabels.join(", ")
            : placeholder || "Оберіть..."}
        </span>

        <ChevronDown 
          className={clsx(
            "ml-2 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0"
          )}
        >
          
        </ChevronDown>
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1 z-10 rounded-md border bg-white shadow-lg max-h-60 overflow-auto">
          {groups.map((group) => (
            <div
              key={group.group}
              className="px-3 py-2 border-b last:border-b-0"
            >
              <div className="mb-1 text-main-text-mobile md:text-main-text text-amm">
                {group.group}
              </div>
              {group.options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 py-1 cursor-pointer text-main-text-mobile md:text-main-text text-amm"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(opt.value)}
                    onChange={() => handleToggle(opt.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
