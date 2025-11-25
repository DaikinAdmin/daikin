import { useTranslations } from "next-intl";

interface ColorItem {
  hex: string;
  label: string;
}

export const useColorLabel = () => {
  const t = useTranslations();

  const getColorLabel = (hex: string) => {

    const colors = t.raw("colors") as Record<string, ColorItem>;

    const found = Object.values(colors).find(
      (c) => c.hex.toLowerCase() === hex.toLowerCase()
    );

    return found ? found.label : hex; // fallback
  };

  const getHex = (colorKey: string) => {
    const colors = t.raw("colors") as Record<string, ColorItem>;
    const found = colors[colorKey];
    return found ? found.hex : colorKey;
  };

  return { getColorLabel, getHex };
};
