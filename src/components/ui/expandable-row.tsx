"use client";

import React from "react";
import { Icon } from "@iconify-icon/react";

type ExpandableRowProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function ExpandableRow({ title, isOpen, onToggle, icon, className, children }: ExpandableRowProps) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex items-center gap-4 w-full text-left select-none"
      >
        {icon ? (
          <div className="rounded-full border flex items-center justify-center shrink-0" style={{ width: 70, height: 70 }}>
            {icon}
          </div>
        ) : null}
        <span className={`flex items-center leading-none text-h3-mobile md:text-h3 ${isOpen ? 'text-primary' : ''}`}>
          {title}
        </span>
        <span className="ml-auto flex items-center justify-center">
          <Icon
            icon="hugeicons:arrow-up-01"
            className={`transition-transform text-subtitle rotate-180 duration-300 ${isOpen ? 'rotate-0 text-primary' : ''}`}
          />
        </span>
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}
