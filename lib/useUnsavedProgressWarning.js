"use client";

import { useLanguage } from "@/components/LanguageProvider";

import { useEffect } from "react";
import { hasUnsavedChanges, retryPendingChanges } from "./browserStorage";

const WARNING_MESSAGE =
  "Your latest changes could not be saved on this device. Leaving may lose those changes.";

export default function useUnsavedProgressWarning(active) {
  const { t } = useLanguage();
  useEffect(() => {
    if (!active) return;

    function handleBeforeUnload(event) {
      retryPendingChanges();
      if (!hasUnsavedChanges()) return;
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
