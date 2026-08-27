"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import LandingCompass from "@/components/LandingCompass";
import { useSessionAnswers } from "@/lib/useSessionAnswers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function LandingPage() {
  useSessionAnswers();

  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const assemblyRef = useRef(null);
  const lidRef = useRef(null);
  const needleRef = useRef(null);

  useGSAP(
    () => {
      const assembly = assemblyRef.current;
      const lid = lidRef.current;
      const needle = needleRef.current;
      const hero = heroRef.current;
      if (!assembly || !lid || !needle || !hero) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.set(assembly, {
        rotation: reduceMotion ? 0 : 60,
        scale: reduceMotion ? 1 : 0.94,
        transformOrigin: "50% 50%",
      });
      gsap.set(lid, {
        rotation: reduceMotion ? -132 : 0,
        svgOrigin: "120 32",
      });
      gsap.set(needle, {
        rotation: reduceMotion ? 0 : 42,
        svgOrigin: "120 120",
      });

      if (reduceMotion) return;

      const lenis = new Lenis({
        autoRaf: false,
        duration: 1.15,
      });
      const onLenisScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onLenisScroll);

      const onTick = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=115%",
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
        },
      });

      tl.to(assembly, { rotation: 0, scale: 1.04, ease: "none" }, 0)
        .to(lid, { rotation: -132, ease: "none" }, 0)
        .to(needle, { rotation: 0, ease: "none" }, 0.12);

      return () => {
        gsap.ticker.remove(onTick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.off("scroll", onLenisScroll);
        lenis.destroy();
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative min-h-svh text-beige">
      {/* 5 — Background: navy-to-lavender gradient + radial glow (no images) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,#121a2e_0%,#1b2a4a_42%,#5a4d7a_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_28%,rgba(212,160,23,0.22)_0%,rgba(45,191,184,0.1)_38%,transparent_68%)]"
      />

      <section
        ref={heroRef}
        className="flex min-h-svh flex-col px-5 pb-10 pt-4 sm:px-8 lg:px-12"
      >
        {/* 6 — Navigation Bar (brand mark is also indicator 1) */}
        <header className="flex items-center justify-between gap-4 py-2">
          {/* 1 — Brand mark */}
          <p className="font-serif text-[0.7rem] tracking-[0.28em] text-beige/90 sm:text-xs">
            CAREER COMPASS
          </p>
          <nav
            aria-label="Placeholder"
            className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[0.65rem] tracking-[0.18em] text-beige/80 sm:gap-x-4 sm:text-xs"
          >
            <a href="#explore" className="transition-colors hover:text-gold">
              Explore
            </a>
            <span aria-hidden="true" className="text-beige/40">
              ·
            </span>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-gold"
            >
              How It Works
            </a>
            <span aria-hidden="true" className="text-beige/40">
              ·
            </span>
            <a href="#about" className="transition-colors hover:text-gold">
              About
            </a>
          </nav>
        </header>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 sm:mb-8">
            <LandingCompass
              assemblyRef={assemblyRef}
              lidRef={lidRef}
              needleRef={needleRef}
            />
          </div>

          {/* 2 — Headline */}
          <h1 className="font-serif text-[1.75rem] leading-snug text-beige sm:text-4xl md:text-5xl md:leading-tight">
            You are an Explorer.
            <br />
            Your career path is a map.
          </h1>

          {/* 3 — Description */}
          <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-beige/80 sm:mt-5 sm:text-base">
            Career Compass helps Senior High School students chart interests,
            skills, and academic performance toward college courses worth
            exploring. This is a guidance map for conversation with a counselor
            — not a final decision about your future.
          </p>

          {/* 4 — Primary CTA */}
          <Link
            href="/intake"
            className="mt-7 inline-flex items-center justify-center rounded-full border border-gold/70 bg-gold/15 px-7 py-3 font-sans text-xs tracking-[0.2em] text-beige uppercase transition-[box-shadow,transform,background-color] duration-200 ease-out hover:bg-gold/25 hover:shadow-[0_0_28px_rgba(212,160,23,0.55)] active:scale-[0.97] sm:mt-8 sm:px-8 sm:text-sm"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
