"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getLabels, type Locale, locales } from "@/lib/i18n-data";

type I18nContextValue = { locale: Locale; labels: ReturnType<typeof getLabels>; setLocale: (locale: Locale) => void };
const I18nContext = createContext<I18nContextValue | null>(null);

function readLocale(): Locale {
  const value = document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith("locale="))?.split("=")[1];
  return locales.includes(value as Locale) ? (value as Locale) : "ru";
}

export default function I18nProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  useEffect(() => setLocaleState(readLocale()), []);
  const setLocale = useCallback((nextLocale: Locale) => {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    setLocaleState(nextLocale);
    router.refresh();
  }, [router]);
  const value = useMemo(() => ({ locale, labels: getLabels(locale), setLocale }), [locale, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}

export function useLocaleData() {
  const { labels } = useI18n();
  return { ru: labels };
}
