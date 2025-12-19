import React, { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  multiline?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  multiline = false,
  rows = 3,
  ...props
}) => {
  const baseClasses = clsx(
    "w-full rounded-full px-4 py-4 text-sm focus:outline-none bg-[#f1fbff] focus:ring-2 focus:ring-primary",
    icon ? "pl-10" : "",
    error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-primary",
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-main-text-mobile md:text-main-text text-amm mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {icon}
          </div>
        )}

        {multiline ? (
          <textarea
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={rows}
            className={clsx(
              baseClasses,
              "resize-none rounded-xl"
            )}
          />
        ) : (
          <input {...props} className={baseClasses} />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
