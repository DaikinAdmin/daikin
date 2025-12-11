"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import DaikinIcon from "./daikin-icon";

interface IconPickerProps {
  value: string | null;
  onChange: (iconPath: string) => void;
  disabled?: boolean;
}

interface IconItem {
  name: string;
  src: string;
}

export default function IconPicker({
  value,
  onChange,
  disabled = false,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "full">("preview");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Закриваємо по кліку поза вікном
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
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

  // HANDLE INSERT FOR ICONS
  const previewIcons: IconItem[] = [
    { name: "icon1", src: "hugeicons:arrow-up-03" },
    { name: "icon2", src: "hugeicons:location-star-02" },
    { name: "icon3", src: "hugeicons:nuclear-power" },
    { name: "icon4", src: "hugeicons:temperature" },
    { name: "icon5", src: "hugeicons:award-05" },
    { name: "icon6", src: "hugeicons:energy" },
    { name: "icon7", src: "hugeicons:volume-off" },
    { name: "icon8", src: "hugeicons:home-04" },
    { name: "icon9", src: "hugeicons:droplet" },
    { name: "icon10", src: "hugeicons:3d-move" },
    { name: "icon11", src: "hugeicons:arrow-reload-horizontal" },
    { name: "icon12", src: "hugeicons:thermometer-warm" },
    { name: "icon13", src: "hugeicons:approximately-equal" },
    { name: "icon14", src: "hugeicons:user-arrow-left-right" },
    { name: "icon15", src: "hugeicons:filter-vertical" },
    { name: "icon17", src: "hugeicons:3-d-view" },
    { name: "icon18", src: "hugeicons:tailwindcss" },
  ];

  const fullIcons: IconItem[] = [
    { name: "3d", src: "3d" },
    { name: "air_filter", src: "air_filter" },
    { name: "Coanda effect_heating", src: "Coanda effect_heating" },
    { name: "coanda_effect_cooling", src: "coanda_effect_cooling" },
    { name: "comfort_mode", src: "comfort_mode" },
    { name: "draught_prevention", src: "draught_prevention" },
    { name: "dry_programme", src: "dry_programme" },
    { name: "floor_warming", src: "floor_warming" },
    { name: "grid_eye_sensor", src: "grid_eye_sensor" },
    { name: "heat_boost", src: "heat_boost" },
    { name: "heat_plus", src: "heat_plus" },
    { name: "home_leave _operation", src: "home_leave _operation" },
    { name: "horizontal_auto_swing", src: "horizontal_auto_swing" },
    { name: "hugeicons_chatting-01-1", src: "hugeicons_chatting-01-1" },
    { name: "hugeicons_chatting-01-2", src: "hugeicons_chatting-01-2" },
    { name: "hugeicons_chatting-01-3", src: "hugeicons_chatting-01-3" },
    { name: "hugeicons_chatting-01", src: "hugeicons_chatting-01" },
    { name: "hugeicons_temperature", src: "hugeicons_temperature" },
    { name: "impossible_to_hear", src: "impossible_to_hear" },
    {
      name: "indoor_unit_silent_operation",
      src: "indoor_unit_silent_operation",
    },
    { name: "Integrated_cooling", src: "Integrated_cooling" },
    { name: "multi_model", src: "multi_model" },
    { name: "multi_zoning", src: "multi_zoning" },
    { name: "online_controller_picto", src: "online_controller_picto" },
    { name: "powerful_mode", src: "powerful_mode" },
    { name: "self-cleaning_filter_groen", src: "self-cleaning_filter_groen" },
    { name: "Silver_filter", src: "Silver_filter" },
    { name: "streamer", src: "streamer" },
    { name: "stylish", src: "stylish" },
    { name: "super_multi_plus", src: "super_multi_plus" },
    { name: "ururu_humidification", src: "ururu_humidification" },
  ];

  const icons = activeTab === "preview" ? previewIcons : fullIcons;

  return (
    <div className="relative inline-block" ref={pickerRef}>
      {/* BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 border rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {value ? (
          <img src={value} alt="icon" className="w-5 h-5" />
        ) : (
          "Виберіть іконку"
        )}
      </button>

      {/* POPUP */}
      {open && (
        <div className="absolute mt-1 w-80 bg-white border rounded-md shadow-lg z-[1000] p-4">
          {/* TABS */}
          <div className="flex mb-2 border-b">
            <button
              type="button"
              className={`flex-1 py-1 ${
                activeTab === "preview"
                  ? "border-b-2 border-blue-500 font-semibold"
                  : ""
              }`}
              onClick={() => setActiveTab("preview")}
            >
              Preview
            </button>
            <button
              type="button"
              className={`flex-1 py-1 ${
                activeTab === "full"
                  ? "border-b-2 border-blue-500 font-semibold"
                  : ""
              }`}
              onClick={() => setActiveTab("full")}
            >
              Full Size
            </button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {icons.map((icon) => (
              <button
                type="button"
                key={icon.name}
                onClick={() => {
                  onChange(icon.src);
                  setOpen(false);
                }}
                className="p-2 border rounded hover:bg-gray-100 flex items-center justify-center"
              >
                {activeTab === "preview" ? (
                  <Icon icon={icon.src} className="w-10 h-10" />
                ) : (
                  <DaikinIcon name={icon.name} className="w-10 h-10" />
                )}
              </button>
            ))}
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 w-full py-2 border rounded-md hover:bg-gray-50"
          >
            Закрити
          </button>
        </div>
      )}
    </div>
  );
}
