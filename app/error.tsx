"use client";
import React from "react";
import { useI18n } from "@/components/General/I18nProvider";

const ErrorPage = () => {
  const { labels } = useI18n();
  return <div>{labels.errors.server}</div>;
};

export default ErrorPage;
