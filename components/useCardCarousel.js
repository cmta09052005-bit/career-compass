"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useCarouselAutoplay from "./useCarouselAutoplay";

gsap.registerPlugin(useGSAP);

// The Three Trails transition, shared with Meet the Explorers.
export default function useCardCarousel(container, panel, count) {
  const [selected, setSelected] = useState(0);
  const pending = useRef(null);
  const touch = useRef(null);
  const { contextSafe } = useGSAP(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(panel.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: .3, ease: "power1.out", onComplete: () => ScrollTrigger.refresh() });
    }
  }, { scope: container, dependencies: [selected], revertOnUpdate: true });
  const select = index => contextSafe(() => {
    const next = (index + count) % count;
    if (next === selected && pending.current === null) return;
    pending.current = next;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSelected(next);
      pending.current = null;
      return;
    }
    gsap.to(panel.current, { opacity: 0, x: -20, duration: .25, ease: "power1.out", overwrite: true, onComplete: () => {
      setSelected(next);
      pending.current = null;
      if (next === selected) gsap.to(panel.current, { opacity: 1, x: 0, duration: .3, ease: "power1.out" });
    } });
  })();
  const step = direction => select((pending.current ?? selected) + direction);
  useCarouselAutoplay(container, () => step(1));
  const swipeProps = {
    onTouchStart: event => { touch.current = event.touches[0].clientX; },
    onTouchEnd: event => {
      if (touch.current !== null) {
        const distance = event.changedTouches[0].clientX - touch.current;
        if (Math.abs(distance) > 45) step(distance < 0 ? 1 : -1);
      }
      touch.current = null;
    },
    onTouchCancel: () => { touch.current = null; },
  };
  return { selected, select, step, swipeProps };
}
