"use client";

import { useEffect } from "react";

const WARNING_MESSAGE =
  "Are you sure you want to leave? Your progress will be lost.";

export default function useUnsavedProgressWarning(active) {
  useEffect(() => {
    if (!active) return;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = WARNING_MESSAGE;
      return WARNING_MESSAGE;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [active]);
}
