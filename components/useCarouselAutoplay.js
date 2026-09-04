"use client";

import { useEffect, useRef, useState } from "react";

export default function useCarouselAutoplay(container, advance) {
  const latest = useRef(advance);
  const [paused, setPaused] = useState(false);
  useEffect(() => { latest.current = advance; }, [advance]);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let hovering = false;
    let touching = false;
    let focused = false;
    let timer;
    const schedule = () => {
      clearTimeout(timer);
      if (paused || motion.matches || !visible || hovering || touching || focused || document.hidden) return;
      timer = setTimeout(() => { latest.current(); schedule(); }, 3000);
    };
    const enter = (event) => { if (event.pointerType === "mouse") hovering = true; schedule(); };
    const leave = () => { hovering = false; touching = false; schedule(); };
    const down = () => { touching = true; schedule(); };
    const up = () => { touching = false; schedule(); };
    const focus = (event) => { focused = event.target.matches(":focus-visible"); schedule(); };
    const blur = (event) => { if (!element.contains(event.relatedTarget)) focused = false; schedule(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .15; schedule(); }, { threshold: [0, .15] });
    observer.observe(element);
    const events = { pointerenter: enter, pointerleave: leave, pointerdown: down, pointerup: up, pointercancel: leave, focusin: focus, focusout: blur };
    Object.entries(events).forEach(([name, handler]) => element.addEventListener(name, handler));
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", schedule);
    return () => { clearTimeout(timer); observer.disconnect(); Object.entries(events).forEach(([name, handler]) => element.removeEventListener(name, handler)); document.removeEventListener("visibilitychange", schedule); motion.removeEventListener("change", schedule); };
  }, [container, paused]);
  return { paused, togglePaused: () => setPaused((value) => !value) };
}
