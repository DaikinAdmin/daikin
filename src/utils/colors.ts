import { useTranslations } from "next-intl";

export interface ColorItem {
  hex: string;
  label: string;
}

export const useColorLabel = () => {
  const t = useTranslations("colors"); // namespace "colors"

  // Отримуємо всі кольори
  const colors = t.raw("items") as Record<string, ColorItem>;

  // Отримуємо тексти кнопок
  const texts = t.raw("texts") as Record<string, string>;

  const getColorLabel = (hex: string) => {
    const found = Object.values(colors).find(
      (c) => c.hex.toLowerCase() === hex.toLowerCase()
    );
    return found ? found.label : hex; // fallback
  };

  const getHex = (colorKey: string) => {
    const found = colors[colorKey];
    return found ? found.hex : colorKey; // fallback
  };

  return { getColorLabel, getHex, texts };
};
