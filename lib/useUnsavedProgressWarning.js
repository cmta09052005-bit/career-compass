"use client";

import { useLanguage } from "@/components/LanguageProvider";

import { useEffect } from "react";

const WARNING_MESSAGE =
  "Are you sure you want to leave? Your progress will be lost.";

export default function useUnsavedProgressWarning(active) {
  const { t } = useLanguage();
  useEffect(() => {
    if (!active) return;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = t(WARNING_MESSAGE);
      return t(WARNING_MESSAGE);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [active, t]);
}
