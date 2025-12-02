/**
 * Generates a URL-friendly slug from a given string
 * @param name - The input string to convert to a slug
 * @returns A lowercase, hyphenated slug suitable for URLs
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
