"use client";

import Localized from "@/components/Localized";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { marketingFonts } from "@/components/marketingFonts";
import Button from "@/components/Button";
import Card from "@/components/Card";
import useCardCarousel from "@/components/useCardCarousel";
import "../story.css";
import "./how-it-works.css";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  ["Pick your explorer", "Add your strand and optional name and grade level, then pick an explorer.", "explorer-backpack"],
  ["See the map", "Your journey map shows 3 trails to finish, one at a time. Your compass shows how far you've gone.", "flag-marker-pin"],
  ["The Mountains", "Answer a few real-life situations about what interests you.", "mountain-peak"],
  ["The Forest", "Say how confident you feel in different skills.", "pine-branch"],
  ["The Valley", "Add your grades and best subjects. The last piece of the map.", "ribbon-scroll"],
  ["Finding your path", "Your answers turn into course matches, in seconds.", "sunburst"],
  ["The Islands", "See your matches, explore each one, and download your report.", "island-flag"],
];
const trails = [
  { id: "mountains", name: "The Mountains", type: "Interests", icon: "mountain-peak", format: "8 real-life situations to choose from", description: "There's no right or wrong answer. Every choice tells the system something new about you.", time: "about 3–4 minutes", number: "01" },
  { id: "forest", name: "The Forest", type: "Skills", icon: "pine-branch", format: '10 quick sliders, from "not really me" to "definitely me"', description: "Covers hands-on, creative, technical, and people skills.", time: "about 2–3 minutes", number: "02" },
  { id: "valley", name: "The Valley", type: "Academics", icon: "ribbon-scroll", format: "a short step-by-step form", description: "Just your general average and your best subjects.", time: "less than a minute", number: "03" },
];
const rewards = [["Wayfinder", "mountain-peak"], ["Skillcrafter", "pine-branch"], ["Scholar", "ribbon-scroll"]];
const outcomes = [
  ["Up to 24 course matches, ranked just for you", "island-flag"],
  ["A match score for each one", "sunburst"],
  ["Details for every course, including schools, careers, and tips to get there", "magnifying-glass"],
  ["A downloadable report you can keep or show your guidance counselor", "compass-download"],
];
const trust = [["No login needed", "explorer-backpack"], ["Progress is saved on this device", "fog-mist"], ["Free for all Senior High School students", "sunburst"], ["About 10 minutes, start to finish", "footprint-trail"]];
function Icon({ name, size = 64, className = "" }) {
  return <Localized as={Image} className={className} src={`/icons/career-compass/${name}.svg`} alt="" width={size} height={size} />;
}

export default function HowItWorks() {
  const root = useRef(null);
  const tabPanel = useRef(null);
  const carousel = useRef(null);
  const { selected, select: switchTab, step: slide, swipeProps } = useCardCarousel(carousel, tabPanel, trails.length);
  const [activeStep, setActiveStep] = useState(0);
  useGSAP(() => {
    root.current.querySelectorAll(".hiw-step").forEach((step, index) => {
      ScrollTrigger.create({ trigger: step, start: "top 60%", end: "bottom 60%", onEnter: () => setActiveStep(index), onEnterBack: () => setActiveStep(index) });
    });
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = root.current.querySelector(".path-timeline");
      const path = root.current.querySelector(".path-line");
      const nodes = [...timeline.querySelectorAll(".step-node")];
      const measure = () => {
        const bounds = timeline.getBoundingClientRect();
        const first = nodes[0].getBoundingClientRect();
        const last = nodes[nodes.length - 1].getBoundingClientRect();
        const x = first.left - bounds.left + first.width / 2;
        const y1 = first.top - bounds.top + first.height / 2;
        const y2 = last.top - bounds.top + last.height / 2;
        // Layout centers stay stable while the node scales animate.
        const d = `M ${x} ${y1} V ${y2}`;
        path.setAttribute("d", d);
        root.current.querySelector(".path-track").setAttribute("d", d);
        path.style.strokeDasharray = path.getTotalLength();
      };
      measure();
      const draw = gsap.fromTo(path, { strokeDashoffset: () => path.getTotalLength() }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: timeline, start: "top 70%", end: "bottom 70%", scrub: 1, invalidateOnRefresh: true, onRefreshInit: measure } });
      const resize = new ResizeObserver(() => { measure(); draw.invalidate(); ScrollTrigger.refresh(); });
      resize.observe(timeline);
      gsap.from(".step-node", { scale: 0, opacity: 0, duration: 0.5, stagger: 0.15, ease: "back.out(2)", scrollTrigger: { trigger: timeline, start: "top 65%" } });
      gsap.from(".badge-preview", { scale: 0, rotation: -10, opacity: 0, duration: 0.4, stagger: 0.2, ease: "back.out(3)", scrollTrigger: { trigger: ".badge-row", start: "top 80%" } });
      gsap.from(".trust-card", { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, scrollTrigger: { trigger: ".trust-strip", start: "top 85%" } });
      gsap.to(".hiw-start", { scale: 1.03, ease: "sine.inOut", boxShadow: "0 0 20px rgba(212,160,23,0.6)", repeat: -1, yoyo: true, duration: 1.8 });
      return () => resize.disconnect();
    });
    return () => mm.revert();
  }, { scope: root });

  const tabKey = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % trails.length;
    if (event.key === "ArrowLeft") next = (index + trails.length - 1) % trails.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = trails.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    root.current.querySelector(`#trail-tab-${trails[next].id}`).focus();
    switchTab(next);
  };

  const trail = trails[selected];

  return (
    <main ref={root} className={`story-home hiw-page ${marketingFonts}`}>
      <Localized as="a" href="#hiw-intro" className="story-skip">Skip to content</Localized>
      <div className="hiw-watermark" aria-hidden="true" />
      <div className="hiw-container">
        <section id="hiw-intro" className="hiw-intro" aria-labelledby="hiw-title">
          <Localized as="p" className="hiw-label">How It Works</Localized>
          <Localized as="h1" id="hiw-title">Here&apos;s exactly<br />what happens.</Localized>
          <Localized as="p">Answer questions about yourself, then compare college courses that fit your answers.</Localized>
          <Localized as={Image} className="hiw-intro-compass" src="/landing-compass.png" alt="" width={145} height={170} priority />
        </section>

        <section className="hiw-path-section" aria-labelledby="path-heading">
          <div className="hiw-section-heading"><Localized as="p" className="hiw-label">01 / Your journey</Localized><Localized as="h2" id="path-heading">The Full Path</Localized><span className="hiw-heading-rule" /></div>
          <div className="hiw-path-board">
            <Localized as="div" className="hiw-board-banner" aria-hidden="true">THE FULL PATH <Localized as="span">01 to 07</Localized></Localized>
            <div className="path-timeline">
              <svg className="hiw-path-svg" aria-hidden="true"><path className="path-track" /><path className="path-line" /></svg><Localized as="ol">
              {steps.map(([title, copy, icon], index) => <li className={`hiw-step ${activeStep === index ? "is-active" : ""}`} key={title} aria-current={activeStep === index ? "step" : undefined}>
                <Localized as="span" className="step-node" aria-hidden="true">{index + 1}</Localized>
                <div><Localized as="h3"><Localized as="span" className="sr-only">Step {index + 1}. </Localized>{title}</Localized><Localized as="p">{copy}</Localized></div>
                <Icon name={icon} className="hiw-step-icon" />
              </li>)}
            </Localized></div>
          </div>
        </section>

        <section ref={carousel} className="hiw-trails" aria-labelledby="trails-heading">
          <div className="hiw-section-heading"><Localized as="p" className="hiw-label">02 / A closer look</Localized><Localized as="h2" id="trails-heading">The Three Trails</Localized><span className="hiw-heading-rule" /></div>
          <Localized as="div" role="tablist" aria-label="The three assessment trails" className="hiw-tabs">
            {trails.map((item, index) => <Localized as="button" key={item.id} type="button" role="tab" id={`trail-tab-${item.id}`} aria-selected={selected === index} aria-controls="trail-panel" tabIndex={selected === index ? 0 : -1} onClick={() => switchTab(index)} onKeyDown={(event) => tabKey(event, index)}><Localized as="span">{item.number}</Localized>{item.name}</Localized>)}
          </Localized>
          <Card as="div" className="story-panel hiw-trail-paper" {...swipeProps}>
            <div ref={tabPanel} role="tabpanel" id="trail-panel" aria-labelledby={`trail-tab-${trail.id}`} tabIndex={0} className="hiw-tab-content">
              <div className="hiw-trail-art"><Icon name={trail.icon} size={170} /><Localized as="span">TRAIL {trail.number}</Localized></div>
              <div className="hiw-trail-copy"><Localized as="h3">{trail.name}: {trail.type}</Localized><Localized as="p" className="hiw-format"><Localized as="strong">Format:</Localized> {trail.format}</Localized><Localized as="p">{trail.description}</Localized><Localized as="p" className="hiw-time"><Localized as="span" aria-hidden="true">◷</Localized> Time: {trail.time}</Localized></div>
            </div>
          </Card>
          <Localized as="div" className="carousel-controls" aria-label="Trail carousel controls"><Button className="story-button" label="←" aria-label="Previous trail" onClick={() => slide(-1)} />{trails.map((item, index) => <Localized as="button" key={item.id} type="button" className="carousel-dot" aria-label={`Show ${item.name}`} aria-pressed={selected === index} onClick={() => switchTab(index)} />)}<Button className="story-button" label="→" aria-label="Next trail" onClick={() => slide(1)} /></Localized>
        </section>

        <section className="hiw-rewards" aria-labelledby="rewards-heading">
          <Localized as="p" className="hiw-label">Along the Way</Localized><Localized as="h2" id="rewards-heading">Every trail you finish<br />unlocks something.</Localized>
          <Localized as="p">Small rewards along the way, so it never feels like you&apos;re just filling out a form.</Localized>
          <Localized as="div" className="badge-row">{rewards.map(([name, icon]) => <div className="badge-preview" key={name}><div className="hiw-seal"><Icon name="wax-seal-frame" size={140} className="hiw-seal-frame" /><Icon name={icon} size={66} className="hiw-seal-symbol" /></div><Localized as="h3">{name}</Localized></div>)}</Localized>
        </section>

        <section className="hiw-outcomes" aria-labelledby="outcomes-heading">
          <div className="hiw-section-heading"><Localized as="p" className="hiw-label">03 / Your next direction</Localized><Localized as="h2" id="outcomes-heading">What You&apos;ll Get</Localized><span className="hiw-heading-rule" /></div>
          <Card as="div" className="story-panel hiw-outcome-paper"><Localized as="ul">{outcomes.map(([copy, icon]) => <li key={copy}><Icon name={icon} size={52} /><Localized as="span">{copy}</Localized></li>)}</Localized></Card>
        </section>

        <section className="hiw-trust" aria-labelledby="trust-heading"><Localized as="h2" id="trust-heading" className="hiw-label">Good to Know</Localized><Localized as="div" className="trust-strip">{trust.map(([copy, icon]) => <Card as="div" className="trust-card" key={copy}><Icon name={icon} size={45} /><Localized as="p">{copy}</Localized></Card>)}</Localized></section>
        <section className="hiw-closing" aria-labelledby="closing-heading"><Localized as="h2" id="closing-heading">Ready to see your map?</Localized><Button href="/intake" className="story-button hiw-start" label="Start Your Journey ↗" /><Localized as={Link} href="/#world-chapter" className="story-text-link">Explore the Story ↗</Localized></section>
      </div>
      <footer className="story-footer"><Localized as={Link} className="story-brand" href="/"><Localized as={Image} src="/landing-compass.png" width={32} height={32} alt="" />CAREER COMPASS</Localized><Localized as="p">A web-based decision support system for Senior High School career guidance.</Localized><Localized as="a" href="#hiw-intro">Back to top ↑</Localized></footer>
    </main>
  );
}





