"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import LandingCompass from "@/components/LandingCompass";
import Button from "@/components/Button";
import { useSessionAnswers } from "@/lib/useSessionAnswers";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

const chapters = [
  ["mountains", "04", "The Mountains", "Discover what draws you forward.", "Choose between real-life scenarios and uncover the interests that keep calling you back.", "8 guided scenarios"],
  ["forest", "05", "The Forest", "Find strength in what you can do.", "Reflect on your confidence across practical, creative, technical, and people-centered skills.", "10 strength signals"],
  ["islands", "06", "The Islands", "See the paths your story opens.", "Connect your interests, strengths, strand, and academic trail to college courses worth exploring.", "24 possible courses"],
];

function Clouds({ className = "" }) {
  return <div aria-hidden="true" className={`cloud-bank ${className}`}><i /><i /><i /><i /><i /></div>;
}

function Scene({ name }) {
  return <div aria-hidden="true" className={`scene scene-${name}`}><i className="scene-image" /><i className="scene-depth" /><i className="scene-atmosphere" /></div>;
}

export default function LandingPage() {
  useSessionAnswers();
  const root = useRef(null);
  const prologue = useRef(null);
  const assembly = useRef(null);
  const lid = useRef(null);
  const needle = useRef(null);
  const progress = useRef(null);

  useGSAP(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(assembly.current, { rotation: reduce ? 0 : 58, scale: reduce ? 1 : 0.9, transformOrigin: "50% 50%" });
    gsap.set(lid.current, { rotation: reduce ? -138 : 0, svgOrigin: "120 34" });
    gsap.set(needle.current, { rotation: reduce ? 0 : 48, svgOrigin: "120 120" });
    if (reduce) return;

    const lenis = new Lenis({ autoRaf: false, duration: 1.08, anchors: { offset: 0 }, syncTouch: false });
    const update = () => ScrollTrigger.update();
    const tick = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    gsap.timeline({ scrollTrigger: { trigger: prologue.current, start: "top top", end: "+=190%", pin: ".prologue-stage", scrub: 0.55, anticipatePin: 1 } })
      .to(assembly.current, { rotation: 0, scale: 1.08, duration: 0.64, ease: "none" }, 0)
      .to(lid.current, { rotation: -138, svgOrigin: "120 34", duration: 0.58, ease: "none" }, 0.06)
      .to(needle.current, { rotation: 0, duration: 0.42, ease: "none" }, 0.14)
      .to(".prologue-glow", { scale: 1.45, autoAlpha: 0.8, duration: 0.64, ease: "none" }, 0)
      .fromTo(".reveal-curtain", { yPercent: 52, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.38, ease: "none" }, 0.66)
      .to(".prologue-compass", { yPercent: -8, scale: 0.82, autoAlpha: 0, duration: 0.36, ease: "none" }, 0.86)
      .to(".prologue-shade", { autoAlpha: 0, duration: 0.4, ease: "none" }, 0.86)
      .to(".reveal-curtain", { yPercent: -32, autoAlpha: 0, duration: 0.42, ease: "none" }, 1.03);

    gsap.fromTo(".world-intro", { autoAlpha: 0, yPercent: 10 }, { autoAlpha: 1, yPercent: 0, ease: "none", scrollTrigger: { trigger: ".world-intro", start: "top 78%", end: "top 38%", scrub: 0.4 } });
    gsap.fromTo(".world-nav", { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: ".world-intro", start: "top 70%", end: "top 45%", scrub: true } });
    gsap.fromTo(progress.current, { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.15 } });

    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      gsap.utils.toArray(".journey-chapter").forEach((section) => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top top", end: "+=135%", pin: true, scrub: 0.7, anticipatePin: 1 },
        });
        timeline
          .fromTo(section.querySelector(".scene-image"), { scale: 1.18, yPercent: 5 }, { scale: 1.02, yPercent: -3, ease: "none" }, 0)
          .fromTo(section.querySelector(".chapter-cloud-curtain"), { yPercent: 0, autoAlpha: 1 }, { yPercent: -26, autoAlpha: 0, ease: "none" }, 0)
          .fromTo(section.querySelector(".scene-depth"), { autoAlpha: 0.2 }, { autoAlpha: 1, ease: "none" }, 0)
          .fromTo(section.querySelector(".scene-atmosphere"), { xPercent: -10 }, { xPercent: 10, ease: "none" }, 0)
          .fromTo(section.querySelector(".chapter-copy"), { clipPath: "inset(0 100% 0 0)", x: -45, autoAlpha: 0 }, { clipPath: "inset(0 0% 0 0)", x: 0, autoAlpha: 1, ease: "none" }, 0.14)
          .fromTo(section.querySelectorAll(".chapter-copy > *"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.045, ease: "none" }, 0.25)
          .to(section.querySelector(".chapter-copy"), { y: -28, autoAlpha: 0, ease: "none" }, 0.78)
          .to(section.querySelector(".scene-image"), { scale: 0.98, ease: "none" }, 0.78);
      });
    });
    media.add("(max-width: 767px)", () => {
      gsap.utils.toArray(".journey-chapter").forEach((section) => {
        gsap.fromTo(section.querySelector(".chapter-copy"), { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: section, start: "top 75%", end: "top 38%", scrub: 0.35 } });
        gsap.fromTo(section.querySelector(".scene-image"), { scale: 1.12 }, { scale: 1.02, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => { media.revert(); gsap.ticker.remove(tick); gsap.ticker.lagSmoothing(500, 33); lenis.off("scroll", update); lenis.destroy(); };
  }, { scope: root });

  return <main ref={root} className="cinematic-landing text-beige">
    <div aria-hidden="true" className="landing-progress"><span ref={progress} /></div>
    <section ref={prologue} className="prologue" aria-label="The compass awakens"><div className="prologue-stage">
      <div aria-hidden="true" className="prologue-shade" /><div aria-hidden="true" className="prologue-glow" /><Clouds className="cloud-back" />
      <div className="prologue-compass"><LandingCompass assemblyRef={assembly} lidRef={lid} needleRef={needle} /></div>
      <Clouds className="cloud-wipe reveal-curtain" />
      <p className="scroll-cue"><span /> Scroll to awaken</p>
    </div></section>

    <div className="world-shell" id="explore">
      <header className="world-nav"><a href="#explore" className="world-brand"><span>✦</span> Career Compass</a><nav aria-label="Landing page navigation"><a href="#explore">Explore</a><a href="#how-it-works">How it works</a><a href="#about">About</a></nav></header>
      <section className="world-intro"><div aria-hidden="true" className="map-contours" /><Clouds className="world-clouds" /><div className="intro-copy">
        <p className="chapter-label">Chapter 03 · The World</p><h1><span>You are an Explorer.</span><span>Your career path is a map.</span></h1>
        <p>Chart your interests, strengths, and academic trail. Career Compass turns reflection into possible college directions you can explore with confidence.</p>
        <Button href="/intake" label="Start Your Journey  ↗" variant="cta-glow" className="mt-8" />
      </div><div aria-hidden="true" className="world-horizon" /></section>

      <div id="how-it-works">{chapters.map(([name, number, eyebrow, title, body, stat], index) => <section key={name} id={name} className={`journey-chapter chapter-${name}`}><Scene name={name} /><Clouds className="chapter-cloud-curtain" /><div className={`chapter-copy ${index % 2 ? "chapter-copy-right" : ""}`}><p className="chapter-label">Chapter {number} · {eyebrow}</p><h2>{title}</h2><p>{body}</p><span className="chapter-stat">{stat}</span></div><a className="chapter-next" href={index === chapters.length - 1 ? "#about" : `#${chapters[index + 1][0]}`} aria-label={`Continue to ${index === chapters.length - 1 ? "the journey ahead" : chapters[index + 1][2]}`}>Explore onward <span>↓</span></a></section>)}</div>
      <section id="about" className="journey-final"><Clouds className="chapter-cloud-curtain final-cloud-curtain" /><div aria-hidden="true" className="final-rays" /><div className="final-content"><p className="chapter-label">Chapter 07 · The Journey Ahead</p><h2>Your future is not a straight line.</h2><p>Explore the map. Discover your direction. Find the path that fits you.</p><Button href="/intake" label="Start Your Journey  ↗" variant="cta-glow" className="mt-8" /><small>For Senior High School students · No account required · Session-only</small></div></section>
    </div>
  </main>;
}
