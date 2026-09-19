"use client";

import Localized from "@/components/Localized";

import { Fragment, useRef, useState } from "react";
import { marketingFonts } from "@/components/marketingFonts";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/Button";
import Card from "@/components/Card";
import useCardCarousel from "@/components/useCardCarousel";
import { useSessionAnswers } from "@/lib/useSessionAnswers";
import { journeyEntry } from "@/lib/journeyEntry";
import "./story.css";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

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
  const { selected: explorerIndex, select: showExplorer, step: slide, swipeProps } = useCardCarousel(carousel, track, explorers.length);
  const { session } = useSessionAnswers();
  const entry = journeyEntry(session);
  const [active, setActive] = useState(0);

  const [announcement, setAnnouncement] = useState("");
  useGSAP(() => {
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


  return (
    <main ref={root} className={`story-home ${marketingFonts}`}>
      <Localized as="a" href="#world-chapter" className="story-skip">Skip to content</Localized>
      <div className="story-map-window" aria-hidden="true"><div className="story-map" /><div className="story-map-shade" /></div>
      <Localized as="nav" className="story-stepper" aria-label="Chapter progress">
        {chapters.map((chapter, index) => <Localized as="a" key={chapter.id} href={`#${chapter.id}-chapter`} aria-label={`Chapter ${number(index)}: ${chapter.name}`} aria-current={active === index ? "step" : undefined}><i /> <Localized as="span">{number(index)}</Localized></Localized>)}
      </Localized>
      <Localized as="div" className="story-wrapper">
        <section id="world-chapter" className="story-chapter story-hero" aria-labelledby="world-title">
          <Card as="div" className="story-panel story-hero-panel">
            <Localized as="p" className="story-eyebrow">Chapter 01 · The World</Localized>
            <Localized as="h1" id="world-title">You are an Explorer.<br /><Localized as="em">Your career path<br />is a map.</Localized></Localized>
            <Localized as="p" id="world-description" className="story-description">Not sure which college course to choose? Answer a few questions about yourself and find courses worth exploring.</Localized>
            <div className="story-actions"><Button href={entry.href} className="story-button story-start" label={entry.label} /><Localized as="a" href="#explorers" className="story-text-link">Explore the Story ↓</Localized></div>

          </Card>
          <div className="story-compass-stage" aria-hidden="true"><div className="story-orbit" /><div className="story-compass-spin"><Localized as="img" className="story-compass" src="/landing-compass.png" width="420" height="480" alt="" /></div><Localized as="span" className="story-compass-caption">YOUR NEXT CHAPTER STARTS HERE</Localized></div>
          <Localized as="a" className="story-scroll" href="#explorers">SCROLL TO EXPLORE <Localized as="span">↓</Localized></Localized>
        </section>
        <section ref={carousel} id="explorers" className="story-explorers" aria-labelledby="explorers-title">
          <div className="story-explorers-heading"><div><Localized as="p" className="story-eyebrow">Choose how you explore</Localized><Localized as="h2" id="explorers-title">Meet the Explorers</Localized><Localized as="p">Every journey starts with picking who you are on the map.<br />Six ways to explore. Pick the one that feels like you.</Localized></div></div>
          <Card as="div" className="story-panel story-explorer-paper" {...swipeProps}>
            <Localized as="div" ref={track} className="story-explorer-panel" tabIndex={0} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); slide(event.key === "ArrowRight" ? 1 : -1); } }} aria-label="Six explorer portraits; swipe or use arrow buttons">
              {explorers.slice(explorerIndex, explorerIndex + 1).map(([name, description]) => { const index = explorerIndex; return <article key={name} className="story-explorer-content"><Localized as="div" className="story-portrait" role="img" aria-label={`${name}, an ink-and-parchment explorer portrait`} style={index === 5 ? { backgroundImage: "url(/characters/career-compass/navigator-framed.svg)", backgroundSize: "100% auto", backgroundPosition: "center top" } : { backgroundPosition: `${index * 20}% top` }} /><Localized as="span" className="story-card-number">EXPLORER {number(index)}</Localized><Localized as="h3">{name}</Localized><Localized as="p">“{description}”</Localized></article>; })}
            </Localized>
          </Card>
          <Localized as="div" className="carousel-controls" aria-label="Explorer carousel controls"><Button className="story-button" onClick={() => slide(-1)} label="←" aria-label="Previous explorers" />{explorers.map(([name], index) => <Localized as="button" type="button" key={name} className="carousel-dot" aria-label={`Show ${name}`} aria-pressed={explorerIndex === index} onClick={() => showExplorer(index)} />)}<Button className="story-button" onClick={() => slide(1)} label="→" aria-label="Next explorers" /></Localized>
        </section>
        {chapters.slice(1, 5).map((chapter, index) => <Fragment key={chapter.id}><section id={`${chapter.id}-chapter`} className={`story-chapter story-region region-${index}`} aria-labelledby={`${chapter.id}-title`}><span className="story-motif" aria-hidden="true" style={{ backgroundImage: `url(/icons/career-compass/${chapter.motif}.svg)` }} />
          <Card as="div" className="story-panel"><Localized as="p" className="story-eyebrow">Chapter {number(index + 1)} · {chapter.name}</Localized><Localized as="h2" id={`${chapter.id}-title`}>{chapter.title}</Localized><Localized as="p" className="story-description">{chapter.body}</Localized><Localized as="div" className="story-ribbon">{chapter.count && <Localized as="span" data-count={chapter.count}>{chapter.count}</Localized>} {chapter.stat}</Localized></Card>
        </section>{index === 1 && <div className="story-discovery-slot"><aside className="story-popup" aria-hidden="true"><Localized as="p">BADGE UNLOCKED</Localized><Localized as="h3">“Wayfinder”</Localized><Localized as="span">This is what it feels like after every step.</Localized></aside></div>}</Fragment>)}
        <section id="ahead-chapter" className="story-chapter story-ending" aria-labelledby="ahead-title"><Card as="div" className="story-panel"><Localized as="img" src="/landing-compass.png" width="76" height="90" alt="" /><Localized as="p" className="story-eyebrow">Chapter 06 · The Journey Ahead</Localized><Localized as="h2" id="ahead-title">Every path leads somewhere.<br /><Localized as="em">Yours hasn&apos;t been decided yet.</Localized></Localized><Button href={entry.href} className="story-button story-start" label={entry.label} /><Localized as="a" href="/about" className="story-text-link">About Career Compass ↗</Localized><Localized as="p" className="story-session">For Senior High School Students · No Account Needed · Progress Saved on This Device</Localized></Card></section>
      </Localized>
      <Localized as="span" className="sr-only" role="status" aria-live="polite">{announcement}</Localized>
      <footer className="story-footer"><Localized as="a" className="story-brand" href="#world-chapter"><Localized as="img" src="/landing-compass.png" width="32" height="40" alt="" />CAREER COMPASS</Localized><Localized as="p">A web-based decision support system for Senior High School career guidance.</Localized><Localized as="a" href="#world-chapter">Back to top ↑</Localized></footer>
    </main>
  );
}



