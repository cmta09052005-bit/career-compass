"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandingCompass from "@/components/LandingCompass";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const INTRO_SESSION_KEY = "career-compass-awakening-v2-seen";

export default function CompassIntro() {
  const [visible, setVisible] = useState(true);
  const intro = useRef(null);
  const assembly = useRef(null);
  const lid = useRef(null);
  const needle = useRef(null);

  useEffect(() => {
    const element = intro.current;
    if (!element) return;
    let revealed = false;
    let failSafe;
    let timeline;

    const revealLanding = () => {
      if (revealed) return;
      revealed = true;
      clearTimeout(failSafe);
      document.documentElement.style.overflow = "";
      gsap.set(element, { autoAlpha: 0, display: "none" });
      setVisible(false);
      try {
        sessionStorage.setItem(INTRO_SESSION_KEY, "true");
      } catch {}
      ScrollTrigger.refresh();
    };

    try {
      if (sessionStorage.getItem(INTRO_SESSION_KEY) === "true") {
        revealLanding();
        return;
      }
    } catch {}

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.style.overflow = "hidden";
    failSafe = window.setTimeout(revealLanding, 5000);
    const context = gsap.context(() => {
      gsap.set(assembly.current, { rotation: reduce ? 0 : 56, scale: reduce ? 1 : 0.94, transformOrigin: "50% 50%" });
      gsap.set(lid.current, { rotation: reduce ? -138 : 0, svgOrigin: "120 34" });
      gsap.set(needle.current, { rotation: reduce ? 0 : 42, svgOrigin: "120 120" });

      if (reduce) {
        timeline = gsap.timeline({ onComplete: revealLanding });
        timeline.to(element, { autoAlpha: 0, duration: 0.35, ease: "power3.out" }, 0.25);
        return;
      }

      timeline = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: revealLanding });
      timeline
        .addLabel("presence", 0.15)
        .to(assembly.current, { rotation: 52, scale: 1, yPercent: -2, duration: 0.45 }, "presence")
        .addLabel("awaken", 0.6)
        .to(assembly.current, { rotation: 0, scale: 1.06, yPercent: 0, duration: 1.15 }, "awaken")
        .to(lid.current, { rotation: -138, svgOrigin: "120 34", duration: 1.05 }, "awaken+=0.08")
        .to(needle.current, { rotation: -24, duration: 0.38, ease: "power3.out" }, "awaken+=0.72")
        .to(needle.current, { rotation: 8, duration: 0.24, ease: "power3.inOut" }, ">")
        .to(needle.current, { rotation: 0, duration: 0.22, ease: "power3.out" }, ">")
        .to(".prologue-glow", { scale: 1.5, autoAlpha: 0.82, duration: 0.75, ease: "power3.out" }, "awaken+=1.12")
        .fromTo(".reveal-curtain", { yPercent: 58, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6 }, "awaken+=1.28")
        .to(".prologue-compass", { yPercent: -8, scale: 0.94, autoAlpha: 0, duration: 0.55, ease: "power3.out" }, "awaken+=1.68")
        .to(".prologue-shade", { autoAlpha: 0, duration: 0.5, ease: "power3.out" }, "<")
        .to(element, { autoAlpha: 0, duration: 0.65, ease: "power3.out" }, "awaken+=1.92");
    }, element);

    return () => {
      clearTimeout(failSafe);
      document.documentElement.style.overflow = "";
      timeline?.kill();
      context.revert();
    };
  }, []);

  if (!visible) return null;

  return <section ref={intro} className="prologue" aria-hidden="true"><div className="prologue-stage">
    <div className="prologue-shade" /><div className="prologue-glow" />
    <div className="cloud-bank cloud-back"><i /><i /><i /><i /><i /></div>
    <div className="prologue-compass"><LandingCompass assemblyRef={assembly} lidRef={lid} needleRef={needle} /></div>
    <div className="cloud-bank cloud-wipe reveal-curtain"><i /><i /><i /><i /><i /></div>
  </div></section>;
}
