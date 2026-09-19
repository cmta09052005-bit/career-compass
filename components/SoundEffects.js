"use client";
import { useEffect } from "react";
import { activateSound, initializeSound, playSound, stopSounds } from "@/lib/sound";
import { subscribeToStorage } from "@/lib/browserStorage";
export default function SoundEffects() {
  useEffect(() => {
    initializeSound();
    const unsubscribe = subscribeToStorage(key => {
      if (key === null || key === "careerCompassSound") { initializeSound(); stopSounds(); }
    });
    const activate = () => activateSound();
    const click = (event) => { activate(); if (event.target.closest("button:not(:disabled), a, input[type=radio], input[type=checkbox]")) playSound("tap"); };
    const visibility = () => { if (document.hidden) stopSounds(); };
    document.addEventListener("pointerdown", activate);
    document.addEventListener("keydown", activate);
    document.addEventListener("click", click);
    document.addEventListener("visibilitychange", visibility);
    let previous = new Map();
    const observer = new MutationObserver(() => {
      const current = new Map([...document.querySelectorAll("dialog[open], .atlas-popover")].map(element => [element, element.dataset.popupKey]));
      for (const [element, key] of current) if (!previous.has(element) || previous.get(element) !== key) { playSound("open"); if (element.dataset.celebration === "true") playSound("badge"); };
      for (const [element, key] of previous) if (!current.has(element) || current.get(element) !== key) playSound("close");
      previous = current;
    });
    observer.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:["open", "data-popup-key"] });
    return () => { unsubscribe(); observer.disconnect(); stopSounds(); document.removeEventListener("pointerdown", activate); document.removeEventListener("keydown", activate); document.removeEventListener("click", click); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return null;
}
