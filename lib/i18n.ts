import { cookies } from "next/headers";
import { getLabels, type Locale, locales } from "@/lib/i18n-data";

export const defaultLocale: Locale = "ru";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get("locale")?.value;
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}

export async function getServerLabels() {
  return getLabels(await getLocale());
}
