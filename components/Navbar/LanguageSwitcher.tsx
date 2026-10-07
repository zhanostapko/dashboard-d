"use client";

import { useI18n } from "@/components/General/I18nProvider";
import type { Locale } from "@/lib/i18n-data";

export default function LanguageSwitcher() {
  const { locale, labels, setLocale } = useI18n();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{labels.common.language}</span>
      <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} className="rounded border border-white/30 bg-transparent px-2 py-1 text-white">
        <option value="ru" className="text-black">{labels.common.russian}</option>
        <option value="en" className="text-black">{labels.common.english}</option>
        <option value="lv" className="text-black">{labels.common.latvian}</option>
      </select>
    </label>
  );
}
