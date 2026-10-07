"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import I18nProvider from "@/components/General/I18nProvider";
import type { Locale } from "@/lib/i18n-data";

const Providers = ({ children, initialLocale = "ru" }: { children: React.ReactNode; initialLocale?: Locale }) => {
  return <SessionProvider><I18nProvider initialLocale={initialLocale}>{children}</I18nProvider></SessionProvider>;
};

export default Providers;
