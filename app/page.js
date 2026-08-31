"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";
import "lenis/dist/lenis.css";
import "splitting/dist/splitting.css";
import CompassIntro from "@/components/CompassIntro";
import Button from "@/components/Button";
import { useSessionAnswers } from "@/lib/useSessionAnswers";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

const chapters = [
  ["mountains", "02", "The Mountains", "Discover what draws you forward.", "Choose between real-life scenarios and uncover the interests that keep calling you back.", "8 guided scenarios", "dark-dissolve"],
  ["forest", "03", "The Forest", "Find strength in what you can do.", "Reflect on your confidence across practical, creative, technical, and people-centered skills.", "10 strength signals", "light-bloom"],
  ["islands", "04", "The Islands", "See the paths your story opens.", "Connect your interests, strengths, strand, and academic trail to college courses worth exploring.", "24 possible courses", "warm-wash"],
];

const chapterNavigation = [
  ["explore", "01", "The World"],
  ["mountains", "02", "The Mountains"],
  ["forest", "03", "The Forest"],
  ["islands", "04", "The Islands"],
  ["about", "05", "Journey Ahead"],
];

function Scene({ name }) {
  return <div aria-hidden="true" className={`scene scene-${name}`}><i className="scene-image" /><i className="scene-depth" /><i className="scene-atmosphere" /></div>;
}

function BoundaryTransition({ type }) {
  return <div aria-hidden="true" className={`boundary-transition transition-${type} chapter-transition-out`} />;
}

function WorldMountainTransition() {
  return <div aria-hidden="true" className="world-mountain-transition"><i className="world-mountain-preview" /><i className="world-mountain-haze" /></div>;
}

function PaintedWorld() {
  const canvas = useRef(null);

  useEffect(() => {
    const element = canvas.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!element || reduce) return;
    const renderer = new THREE.WebGLRenderer({ canvas: element, alpha: true, antialias: false, powerPreference: "high-performance" });
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      vertexShader: "void main(){gl_Position=vec4(position,1.0);}",
      fragmentShader: `
        precision mediump float;
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uPointer;
        uniform vec2 uResolution;
        float noise(vec2 p){return sin(p.x)*sin(p.y);}
        void main(){
          vec2 uv=gl_FragCoord.xy/uResolution.xy;
          vec2 p=uv-.5;
          p.x*=uResolution.x/uResolution.y;
          float pointerGlow=.15/(.16+distance(uv,uPointer));
          float brush=noise(p*vec2(8.,5.)+vec2(uTime*.035,uScroll*3.2));
          brush+=noise(p*vec2(17.,11.)-vec2(uScroll*1.7,uTime*.02))*.45;
          vec3 midnight=vec3(.025,.075,.13);
          vec3 teal=vec3(.03,.28,.31);
          vec3 gold=vec3(.62,.39,.09);
          float chapter=clamp(uScroll,0.,1.);
          vec3 color=mix(midnight,teal,smoothstep(0.,.72,chapter));
          color=mix(color,gold,max(0.,chapter-.72)*.85+pointerGlow*.08);
          float alpha=.13+smoothstep(-1.,1.,brush)*.11+pointerGlow*.025;
          gl_FragColor=vec4(color,alpha);
        }`,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);
    const resize = () => {
      const ratio = Math.min(devicePixelRatio, 1.5);
      renderer.setPixelRatio(ratio);
      renderer.setSize(innerWidth, innerHeight, false);
      uniforms.uResolution.value.set(element.width, element.height);
    };
    const pointer = (event) => uniforms.uPointer.value.set(event.clientX / innerWidth, 1 - event.clientY / innerHeight);
    const scroll = () => uniforms.uScroll.value = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    let frame;
    const render = (time) => {
      uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    resize();
    scroll();
    addEventListener("resize", resize);
    addEventListener("pointermove", pointer, { passive: true });
    addEventListener("scroll", scroll, { passive: true });
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", pointer);
      removeEventListener("scroll", scroll);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvas} className="painted-world" aria-hidden="true" />;
}

export default function LandingPage() {
  useSessionAnswers();
  const root = useRef(null);
  const progress = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let wordsContext;
    import("splitting").then(({ default: Splitting }) => {
      if (cancelled || !root.current) return;
      Splitting({ target: root.current.querySelectorAll("[data-splitting]"), by: "words" });
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      wordsContext = gsap.context(() => {
        gsap.fromTo(".intro-copy .word", { yPercent: 115, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.035, ease: "power3.out", scrollTrigger: { trigger: ".intro-copy", start: "top 76%", end: "top 38%", scrub: 0.4 } });
        gsap.utils.toArray(".journey-chapter").forEach((section) => {
          gsap.fromTo(section.querySelectorAll("h2 .word"), { yPercent: 115, rotation: 2, autoAlpha: 0 }, { yPercent: 0, rotation: 0, autoAlpha: 1, stagger: 0.045, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 72%", end: "top 34%", scrub: 0.4 } });
        });
      }, root);
      ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
      wordsContext?.revert();
    };
  }, []);

  useGSAP(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({ autoRaf: false, duration: 1.08, anchors: { offset: 0 }, syncTouch: false });
    const update = () => ScrollTrigger.update();
    const tick = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    gsap.fromTo(".world-intro", { autoAlpha: 0, yPercent: 10 }, { autoAlpha: 1, yPercent: 0, ease: "none", scrollTrigger: { trigger: ".world-intro", start: "top 78%", end: "top 38%", scrub: 0.4 } });
    gsap.fromTo(".world-nav", { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: ".world-intro", start: "top 70%", end: "top 45%", scrub: true } });
    gsap.to(".intro-copy", { yPercent: -8, autoAlpha: 0.18, ease: "none", scrollTrigger: { trigger: ".world-intro", start: "top top", end: "bottom 32%", scrub: 0.55 } });
    gsap.to(".map-contours", { yPercent: 7, rotation: -4, ease: "none", scrollTrigger: { trigger: ".world-intro", start: "top top", end: "bottom top", scrub: 0.8 } });
    gsap.timeline({ scrollTrigger: { trigger: ".world-intro", start: "bottom 82%", end: "bottom 28%", scrub: 0.55 } })
      .fromTo(".world-mountain-transition", { autoAlpha: 0 }, { autoAlpha: 1, ease: "none" }, 0)
      .fromTo(".world-mountain-preview", { yPercent: 8, scale: 1.08 }, { yPercent: 0, scale: 1, ease: "none" }, 0)
      .fromTo(".world-mountain-haze", { xPercent: -7, autoAlpha: 0.18 }, { xPercent: 7, autoAlpha: 0.72, ease: "none" }, 0);
    ScrollTrigger.create({ trigger: root.current, start: 80, end: "bottom bottom", toggleClass: { targets: ".world-nav", className: "world-nav-scrolled" } });
    chapterNavigation.forEach(([id]) => {
      const section = id === "explore" ? root.current.querySelector(".world-intro") : document.getElementById(id);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 56%",
        end: "bottom 44%",
        onToggle: ({ isActive }) => {
          if (!isActive) return;
          root.current.querySelectorAll(".chapter-rail a").forEach((link) => {
            const active = link.dataset.chapter === id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "step");
            else link.removeAttribute("aria-current");
          });
          const activeNav = id === "explore" ? "home" : id === "about" ? "about" : "how-it-works";
          root.current.querySelectorAll(".world-nav nav a").forEach((link) => {
            const active = link.dataset.nav === activeNav;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
          });
        },
      });
    });
    gsap.fromTo(progress.current, { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.15 } });

    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      gsap.utils.toArray(".journey-chapter").forEach((section) => {
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top top", end: "+=135%", pin: true, scrub: 0.7, anticipatePin: 1 },
        });
        const exit = section.querySelector(".chapter-transition-out");
        const exitFrom = exit.classList.contains("transition-dark-dissolve")
          ? { autoAlpha: 0, scale: 1.03 }
          : exit.classList.contains("transition-light-bloom")
            ? { autoAlpha: 0, yPercent: 18, scale: 0.96 }
            : { autoAlpha: 0, scale: 0.92 };
        const exitTo = exit.classList.contains("transition-warm-wash")
          ? { autoAlpha: 1, scale: 1.12, duration: 0.32, ease: "none" }
          : { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.34, ease: "none" };
        timeline
          .fromTo(section.querySelector(".scene-image"), { scale: 1.18, yPercent: 5 }, { scale: 1.02, yPercent: -3, ease: "none" }, 0)
          .fromTo(section.querySelector(".scene-depth"), { autoAlpha: 0.2 }, { autoAlpha: 1, ease: "none" }, 0)
          .fromTo(section.querySelector(".scene-atmosphere"), { xPercent: -10 }, { xPercent: 10, ease: "none" }, 0)
          .fromTo(section.querySelector(".chapter-copy"), { clipPath: "inset(0 100% 0 0)", x: -45, autoAlpha: 0 }, { clipPath: "inset(0 0% 0 0)", x: 0, autoAlpha: 1, ease: "none" }, 0.14)
          .fromTo(section.querySelectorAll(".chapter-copy > :not(h2)"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.055, ease: "none" }, 0.22)
          .fromTo(exit, exitFrom, exitTo, 0.72)
          .to(section.querySelector(".chapter-copy"), { y: -28, autoAlpha: 0, ease: "none" }, 0.78)
          .to(section.querySelector(".scene-image"), { scale: 0.98, ease: "none" }, 0.78);
      });
    });
    media.add("(max-width: 767px)", () => {
      gsap.utils.toArray(".journey-chapter").forEach((section) => {
        gsap.fromTo(section.querySelector(".chapter-copy"), { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: section, start: "top 75%", end: "top 38%", scrub: 0.35 } });
        gsap.fromTo(section.querySelector(".scene-image"), { scale: 1.12 }, { scale: 1.02, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        const exit = section.querySelector(".chapter-transition-out");
        const exitFrom = exit.classList.contains("transition-dark-dissolve") ? { autoAlpha: 0, scale: 1.03 } : exit.classList.contains("transition-light-bloom") ? { autoAlpha: 0, yPercent: 18, scale: 0.96 } : { autoAlpha: 0, scale: 0.92 };
        const exitTo = exit.classList.contains("transition-warm-wash") ? { autoAlpha: 1, scale: 1.12 } : { autoAlpha: 1, yPercent: 0, scale: 1 };
        gsap.fromTo(exit, exitFrom, { ...exitTo, ease: "none", scrollTrigger: { trigger: section, start: "bottom 48%", end: "bottom 18%", scrub: 0.45 } });
      });
    });
    gsap.fromTo(".final-content > *", { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.055, ease: "power3.out", scrollTrigger: { trigger: ".journey-final", start: "top 72%", end: "top 34%", scrub: 0.4, refreshPriority: -10 } });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => { media.revert(); gsap.ticker.remove(tick); gsap.ticker.lagSmoothing(500, 33); lenis.off("scroll", update); lenis.destroy(); };
  }, { scope: root });

  return <main ref={root} className="cinematic-landing text-beige">
    <CompassIntro />
    <div aria-hidden="true" className="landing-progress"><span ref={progress} /></div>
    <nav className="chapter-rail" aria-label="Landing page chapters">{chapterNavigation.map(([id, number, label], index) => <a key={id} href={`#${id}`} data-chapter={id} className={index === 0 ? "is-active" : ""} aria-current={index === 0 ? "step" : undefined}><span>{number}</span><strong>{label}</strong></a>)}</nav>
    <div className="world-shell" id="explore">
      <PaintedWorld />
      <header className="world-nav"><a href="#explore" className="world-brand"><img src="/brand/career-compass-mark-96.png" alt="" /> Career Compass</a><div className="world-nav-actions"><nav aria-label="Landing page navigation"><a href="#explore" data-nav="home" className="is-active" aria-current="page">Home</a><a href="#about" data-nav="about">About</a><a href="#how-it-works" data-nav="how-it-works">How It Works</a></nav><a className="nav-journey-link" href="/intake">Start Journey</a></div></header>
      <section className="world-intro"><div aria-hidden="true" className="map-contours" /><WorldMountainTransition /><div className="intro-copy">
        <p className="chapter-label">Chapter 01 · The World</p><h1 data-splitting><span>You are an Explorer.</span><span>Your career path is a map.</span></h1>
        <p>Chart your interests, strengths, and academic trail. Career Compass turns reflection into possible college directions you can explore with confidence.</p>
        <div className="hero-actions"><Button href="/intake" label="Start Your Journey" variant="cta-glow" /><a className="hero-scroll-hint" href="#mountains"><span>Explore the Story</span><i>↓</i></a></div>
      </div></section>

      <div id="how-it-works">{chapters.map(([name, number, eyebrow, title, body, stat, transition], index) => <section key={name} id={name} className={`journey-chapter chapter-${name}`}><Scene name={name} /><BoundaryTransition type={transition} /><div className={`chapter-copy ${index % 2 ? "chapter-copy-right" : ""}`}><p className="chapter-label">Chapter {number} · {eyebrow}</p><h2 data-splitting>{title}</h2><p>{body}</p><span className="chapter-stat">{stat}</span></div><a className="chapter-next" href={index === chapters.length - 1 ? "#about" : `#${chapters[index + 1][0]}`} aria-label={`Continue to ${index === chapters.length - 1 ? "the journey ahead" : chapters[index + 1][2]}`}>Explore onward <span>↓</span></a></section>)}</div>
      <section id="about" className="journey-final"><div aria-hidden="true" className="final-rays" /><div className="final-content"><p className="chapter-label">Chapter 05 · The Journey Ahead</p><h2>Your future is not a straight line.</h2><p>Explore the map. Discover your direction. Find the path that fits you.</p><p className="final-disclaimer">Your results are a guide, not the final decision. Talk to your guidance counselor about your next steps.</p><Button href="/intake" label="Start Your Journey" variant="cta-glow" className="mt-8" /><small>For Senior High School students · No account required · Session-only</small></div></section>
      <footer className="landing-footer"><div className="landing-footer-main"><div><a href="#explore" className="landing-footer-brand"><img src="/brand/career-compass-mark-96.png" alt="" /> <span>Career Compass</span></a><p>Every journey needs a compass.</p></div><nav aria-label="Footer navigation"><a href="#explore">Home</a><a href="#about">About</a><a href="#how-it-works">How It Works</a></nav><p className="landing-footer-contact">Contact Us</p></div><div className="landing-footer-meta"><p>Your map is a guide, not the final decision. Talk to your guidance counselor about your results.</p><small>© 2026 Career Compass. All rights reserved.</small></div></footer>
    </div>
  </main>;
}
