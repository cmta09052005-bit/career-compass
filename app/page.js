"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { marketingFonts } from "@/components/marketingFonts";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Button from "@/components/Button";
import Card from "@/components/Card";
import useCarouselAutoplay from "@/components/useCarouselAutoplay";
import "./story.css";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

const chapters = [
  { id: "world", name: "The World" },
  { id: "mountains", name: "The Mountains", title: "Discover what pulls you forward.", body: "Pick from real-life situations and find out what interests keep calling you back.", stat: "GUIDED SCENARIOS", count: 8, motif: "mountain-peak", note: "INTERESTS" },
  { id: "forest", name: "The Forest", title: "Find strength in what you can do.", body: "See how sure you are in different skills, including hands-on, creative, technical, and working with people.", stat: "STRENGTH SIGNALS", count: 10, motif: "pine-branch", note: "SKILLS" },
  { id: "valley", name: "The Valley", title: "What you've already built matters too.", body: "Add your grades and best subjects. They help complete your journey too.", stat: "A FEW QUICK DETAILS", motif: "ribbon-scroll", note: "ACADEMICS" },
  { id: "islands", name: "The Islands", title: "See where your journey can take you.", body: "Your interests, strengths, and grades connect to college courses worth checking out.", stat: "POSSIBLE COURSES", count: 24, motif: "island-flag", note: "POSSIBILITIES" },
  { id: "ahead", name: "The Journey Ahead" },
];
const explorers = [
  ["The Wanderer", "Curious about everything, sure about nothing yet."],
  ["The Trailblazer", "Leads first, figures it out along the way."],
  ["The Scout", "Notices details others walk past."],
  ["The Cartographer", "Likes a plan, even for the unknown."],
  ["The Ranger", "Steady, patient, prepared for anything."],
  ["The Navigator", "Always finding the next direction."],
];
const number = (index) => String(index + 1).padStart(2, "0");

export default function LandingPage() {
  const root = useRef(null);
  const track = useRef(null);
  const carousel = useRef(null);
  const [explorerIndex, setExplorerIndex] = useState(0);
  const requestedExplorer = useRef(0);
  const movingExplorer = useRef(false);
  useEffect(() => {
    const element = track.current;
    const distance = () => element.children[1].offsetLeft - element.children[0].offsetLeft;
    const settle = () => {
      if (movingExplorer.current) return;
      const index = Math.max(0, Math.min(explorers.length - 1, Math.round(element.scrollLeft / distance())));
      requestedExplorer.current = index;
      setExplorerIndex(index);
    };
    const resize = () => {
      gsap.killTweensOf(element);
      element.style.paddingRight = Math.max(5, element.clientWidth - element.firstElementChild.offsetWidth - 5) + "px";
      element.scrollLeft = requestedExplorer.current * distance();
      movingExplorer.current = false;
    };
    const interrupt = () => {
      gsap.killTweensOf(element);
      movingExplorer.current = false;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    element.addEventListener("scrollend", settle);
    element.addEventListener("pointerdown", interrupt);
    element.addEventListener("wheel", interrupt, { passive: true });
    return () => {
      observer.disconnect();
      element.removeEventListener("scrollend", settle);
      element.removeEventListener("pointerdown", interrupt);
      element.removeEventListener("wheel", interrupt);
    };
  }, []);
  const [active, setActive] = useState(0);

  const [announcement, setAnnouncement] = useState("");
  const { contextSafe } = useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      const motion = context.conditions.motion;

      chapters.forEach((chapter, index) => {
        ScrollTrigger.create({ trigger: `#${chapter.id}-chapter`, start: "top center", end: "bottom center", onEnter: () => setActive(index), onEnterBack: () => setActive(index) });
      });
      if (motion) {
        gsap.to(".story-map", { yPercent: -70, ease: "none", scrollTrigger: { trigger: ".story-wrapper", start: "top top", end: "bottom bottom", scrub: 1 } });
        gsap.utils.toArray(".story-panel").forEach((panel) => gsap.from(panel, { opacity: 0, y: 40, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: panel, start: "top 75%", toggleActions: "play none none reverse" } }));
        gsap.utils.toArray(".story-motif").forEach((motif) => gsap.from(motif, { opacity: 0, y: "+=40", duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: motif.parentElement, start: "top 65%", toggleActions: "play none none reverse" } }));
        gsap.from(".story-compass", { rotation: -45, opacity: 0, duration: 1.2, ease: "back.out(1.7)" });
        gsap.to(".story-compass-spin", { rotation: 360, duration: 60, repeat: -1, ease: "none" });
        gsap.to(".story-start", { boxShadow: "0 0 20px rgba(212,160,23,0.6)", repeat: -1, yoyo: true, duration: 1.8 });
        gsap.to(".story-ending .story-start", { scale: 1.03, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.utils.toArray("[data-count]").forEach((element) => {
          const counter = { val: 0 };
          gsap.to(counter, { val: Number(element.dataset.count), duration: 1.4, ease: "power1.out", onUpdate: () => { element.textContent = Math.round(counter.val); }, scrollTrigger: { trigger: element, start: "top 85%" } });
        });
      }
      const tl = gsap.timeline({ scrollTrigger: { trigger: "#forest-chapter", start: "bottom 60%", once: true }, onStart: () => setAnnouncement('Badge unlocked: Wayfinder. This is what it feels like after every step.') });
      if (motion) {
        tl.set(".story-popup", { scale: 0, rotation: -15, opacity: 0 })
          .to(".story-popup", { scale: 1.1, rotation: 0, opacity: 1, duration: 0.4, ease: "back.out(3)" })
          .to(".story-popup", { scale: 1, duration: 0.15 })
          .to(".story-popup", { opacity: 0, y: -20, duration: 0.4, delay: 2.2 });
      } else {
        tl.set(".story-popup", { opacity: 1 }).set(".story-popup", { opacity: 0 }, "+=3.15");
      }
    });
    return () => mm.revert();
  }, { scope: root });
  const showExplorer = (index) => contextSafe(() => {
    const next = (index + explorers.length) % explorers.length;
    const element = track.current;
    const distance = element.children[1].offsetLeft - element.children[0].offsetLeft;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf(element);
    requestedExplorer.current = next;
    movingExplorer.current = true;
    setExplorerIndex(next);
    gsap.to(element, { scrollTo: { x: next * distance, autoKill: false }, duration: reduced ? 0 : .6, ease: "power2.out", overwrite: true, onComplete: () => {
      movingExplorer.current = false;
    } });
  })();
  const slide = (direction) => showExplorer(requestedExplorer.current + direction);
  useCarouselAutoplay(carousel, () => slide(1));

  return (
    <main ref={root} className={`story-home ${marketingFonts}`}>
      <a href="#world-chapter" className="story-skip">Skip to content</a>
      <div className="story-map-window" aria-hidden="true"><div className="story-map" /><div className="story-map-shade" /></div>
      <nav className="story-stepper" aria-label="Chapter progress">
        {chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}-chapter`} aria-label={`Chapter ${number(index)}: ${chapter.name}`} aria-current={active === index ? "step" : undefined}><i /> <span>{number(index)}</span></a>)}
      </nav>
      <div className="story-wrapper">
        <section id="world-chapter" className="story-chapter story-hero" aria-labelledby="world-title">
          <Card as="div" className="story-panel story-hero-panel">
            <p className="story-eyebrow">Chapter 01 · The World</p>
            <h1 id="world-title">You are an Explorer.<br /><em>Your career path<br />is a map.</em></h1>
            <p id="world-description" className="story-description">Not sure which college course to choose? Answer a few questions about yourself and find courses worth exploring.</p>
            <div className="story-actions"><Button href="/intake" className="story-button story-start" label="Start Your Journey ↗" /><a href="#explorers" className="story-text-link">Explore the Story ↓</a></div>

          </Card>
          <div className="story-compass-stage" aria-hidden="true"><div className="story-orbit" /><div className="story-compass-spin"><img className="story-compass" src="/landing-compass.png" width="420" height="480" alt="" /></div><span className="story-compass-caption">YOUR NEXT CHAPTER STARTS HERE</span></div>
          <a className="story-scroll" href="#explorers">SCROLL TO EXPLORE <span>↓</span></a>
        </section>
        <section ref={carousel} id="explorers" className="story-explorers" aria-labelledby="explorers-title">
          <div className="story-explorers-heading"><div><p className="story-eyebrow">Choose how you explore</p><h2 id="explorers-title">Meet the Explorers</h2><p>Every journey starts with picking who you are on the map.<br />Six ways to explore. Pick the one that feels like you.</p></div></div>
          <div ref={track} className="story-carousel" tabIndex={0} aria-label="Six explorer portraits; swipe or use arrow buttons">
            {explorers.map(([name, description], index) => { return <Card as="article" key={name} className="story-explorer-card"><div className="story-portrait" role="img" aria-label={`${name}, an ink-and-parchment explorer portrait`} style={index === 5 ? { backgroundImage: "url(/characters/career-compass/navigator-framed.svg)", backgroundSize: "100% auto", backgroundPosition: "center top" } : { backgroundPosition: `${index * 20}% top` }} /><span className="story-card-number">EXPLORER {number(index)}</span><h3>{name}</h3><p>“{description}”</p></Card>; })}
          </div>
          <div className="carousel-controls" aria-label="Explorer carousel controls"><Button className="story-button" onClick={() => slide(-1)} label="←" aria-label="Previous explorers" />{explorers.map(([name], index) => <button type="button" key={name} className="carousel-dot" aria-label={`Show ${name}`} aria-pressed={explorerIndex === index} onClick={() => showExplorer(index)} />)}<Button className="story-button" onClick={() => slide(1)} label="→" aria-label="Next explorers" /></div>
        </section>
        {chapters.slice(1, 5).map((chapter, index) => <Fragment key={chapter.id}><section id={`${chapter.id}-chapter`} className={`story-chapter story-region region-${index}`} aria-labelledby={`${chapter.id}-title`}><span className="story-motif" aria-hidden="true" style={{ backgroundImage: `url(/icons/career-compass/${chapter.motif}.svg)` }} />
          <Card as="div" className="story-panel"><p className="story-eyebrow">Chapter {number(index + 1)} · {chapter.name}</p><h2 id={`${chapter.id}-title`}>{chapter.title}</h2><p className="story-description">{chapter.body}</p><div className="story-ribbon">{chapter.count && <span data-count={chapter.count}>{chapter.count}</span>} {chapter.stat}</div></Card>
        </section>{index === 1 && <div className="story-discovery-slot"><aside className="story-popup" aria-hidden="true"><p>BADGE UNLOCKED</p><h3>“Wayfinder”</h3><span>This is what it feels like after every step.</span></aside></div>}</Fragment>)}
        <section id="ahead-chapter" className="story-chapter story-ending" aria-labelledby="ahead-title"><Card as="div" className="story-panel"><img src="/landing-compass.png" width="76" height="90" alt="" /><p className="story-eyebrow">Chapter 06 · The Journey Ahead</p><h2 id="ahead-title">Every path leads somewhere.<br /><em>Yours hasn&apos;t been decided yet.</em></h2><Button href="/intake" className="story-button story-start" label="Start Your Journey ↗" /><a href="/about" className="story-text-link">About Career Compass ↗</a><p className="story-session">For Senior High School Students · No Account Needed · Nothing Is Saved</p></Card></section>
      </div>
      <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      <footer className="story-footer"><a className="story-brand" href="#world-chapter"><img src="/landing-compass.png" width="32" height="40" alt="" />CAREER COMPASS</a><p>A web-based decision support system for Senior High School career guidance.</p><a href="#world-chapter">Back to top ↑</a></footer>
    </main>
  );
}



