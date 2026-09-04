"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { marketingFonts } from "@/components/marketingFonts";
import Button from "@/components/Button";
import Card from "@/components/Card";
import useCarouselAutoplay from "@/components/useCarouselAutoplay";
import "../story.css";
import "./how-it-works.css";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  ["Pick your explorer", "Choose how you explore, then add your name, strand, and grade level. Takes less than a minute.", "explorer-backpack"],
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
const rewards = [["Wayfinder", "compass-download"], ["Skillcrafter", "pine-branch"], ["Scholar", "ribbon-scroll"]];
const outcomes = [
  ["Up to 24 course matches, ranked just for you", "island-flag"],
  ["A match score for each one", "sunburst"],
  ["Details for every course, including schools, careers, and tips to get there", "magnifying-glass"],
  ["A downloadable report you can keep or show your guidance counselor", "compass-download"],
];
const trust = [["No login needed", "explorer-backpack"], ["Nothing is saved after you close the tab", "fog-mist"], ["Free for all Senior High School students", "sunburst"], ["About 10 minutes, start to finish", "footprint-trail"]];
function Icon({ name, size = 64, className = "" }) {
  return <Image className={className} src={`/icons/career-compass/${name}.svg`} alt="" width={size} height={size} />;
}

export default function HowItWorks() {
  const root = useRef(null);
  const tabPanel = useRef(null);
  const carousel = useRef(null);
  const pendingTab = useRef(null);
  const [selected, setSelected] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const { contextSafe } = useGSAP(() => {
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

  useGSAP(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(tabPanel.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3, onComplete: () => ScrollTrigger.refresh() });
    }
  }, { scope: root, dependencies: [selected], revertOnUpdate: true });

  const switchTab = (index) => {
    if (index === selected && pendingTab.current === null) return;
    pendingTab.current = index;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSelected(index);
      pendingTab.current = null;
      return;
    }
    contextSafe(() => {
      gsap.to(tabPanel.current, { opacity: 0, x: -20, duration: 0.25, overwrite: true, onComplete: () => {
        setSelected(index);
        pendingTab.current = null;
        // If rapid switching returns to the current tab, React has no change to animate.
        if (index === selected) gsap.to(tabPanel.current, { opacity: 1, x: 0, duration: 0.3 });
      } });
    })();
  };
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
  const autoplay = useCarouselAutoplay(carousel, () => switchTab((selected + 1) % trails.length));
  const trail = trails[selected];

  return (
    <main ref={root} className={`story-home hiw-page ${marketingFonts}`}>
      <a href="#hiw-intro" className="story-skip">Skip to content</a>
      <div className="hiw-watermark" aria-hidden="true" />
      <div className="hiw-container">
        <section id="hiw-intro" className="hiw-intro" aria-labelledby="hiw-title">
          <p className="hiw-label">How It Works</p>
          <h1 id="hiw-title">Here&apos;s exactly<br />what happens.</h1>
          <p>No surprises, no wrong answers. Just a clear path from where you are now to a few college courses worth looking into.</p>
          <Image className="hiw-intro-compass" src="/landing-compass.png" alt="" width={145} height={170} priority />
        </section>

        <section className="hiw-path-section" aria-labelledby="path-heading">
          <div className="hiw-section-heading"><p className="hiw-label">01 / Your journey</p><h2 id="path-heading">The Full Path</h2><span className="hiw-heading-rule" /></div>
          <div className="hiw-path-board">
            <div className="hiw-board-banner" aria-hidden="true">THE FULL PATH <span>01 to 07</span></div>
            <div className="path-timeline">
              <svg className="hiw-path-svg" aria-hidden="true"><path className="path-track" /><path className="path-line" /></svg><ol>
              {steps.map(([title, copy, icon], index) => <li className={`hiw-step ${activeStep === index ? "is-active" : ""}`} key={title} aria-current={activeStep === index ? "step" : undefined}>
                <span className="step-node" aria-hidden="true">{index + 1}</span>
                <div><h3><span className="sr-only">Step {index + 1}. </span>{title}</h3><p>{copy}</p></div>
                <Icon name={icon} className="hiw-step-icon" />
              </li>)}
            </ol></div>
          </div>
        </section>

        <section ref={carousel} className="hiw-trails" aria-labelledby="trails-heading">
          <div className="hiw-section-heading"><p className="hiw-label">02 / A closer look</p><h2 id="trails-heading">The Three Trails</h2><span className="hiw-heading-rule" /></div>
          <div role="tablist" aria-label="The three assessment trails" className="hiw-tabs">
            {trails.map((item, index) => <button key={item.id} type="button" role="tab" id={`trail-tab-${item.id}`} aria-selected={selected === index} aria-controls="trail-panel" tabIndex={selected === index ? 0 : -1} onClick={() => switchTab(index)} onKeyDown={(event) => tabKey(event, index)}><span>{item.number}</span>{item.name}</button>)}
          </div>
          <Card as="div" className="story-panel hiw-trail-paper">
            <div ref={tabPanel} role="tabpanel" id="trail-panel" aria-labelledby={`trail-tab-${trail.id}`} tabIndex={0} className="hiw-tab-content">
              <div className="hiw-trail-art"><Icon name={trail.icon} size={170} /><span>TRAIL {trail.number}</span></div>
              <div className="hiw-trail-copy"><h3>{trail.name}: {trail.type}</h3><p className="hiw-format"><strong>Format:</strong> {trail.format}</p><p>{trail.description}</p><p className="hiw-time"><span aria-hidden="true">◷</span> Time: {trail.time}</p></div>
            </div>
          </Card>
          <div className="carousel-controls" aria-label="Trail carousel controls"><Button className="story-button" label="←" aria-label="Previous trail" onClick={() => switchTab((selected + 2) % 3)} />{trails.map((item, index) => <button key={item.id} type="button" className="carousel-dot" aria-label={`Show ${item.name}`} aria-pressed={selected === index} onClick={() => switchTab(index)} />)}<Button className="story-button" label="→" aria-label="Next trail" onClick={() => switchTab((selected + 1) % 3)} /><button type="button" className="carousel-play" onClick={autoplay.togglePaused} aria-label={autoplay.paused ? "Play trail carousel" : "Pause trail carousel"}>{autoplay.paused ? "Play" : "Pause"}</button></div>
        </section>

        <section className="hiw-rewards" aria-labelledby="rewards-heading">
          <p className="hiw-label">Along the Way</p><h2 id="rewards-heading">Every trail you finish<br />unlocks something.</h2>
          <p>Small rewards along the way, so it never feels like you&apos;re just filling out a form.</p>
          <div className="badge-row">{rewards.map(([name, icon]) => <div className="badge-preview" key={name}><div className="hiw-seal"><Icon name="wax-seal-frame" size={140} className="hiw-seal-frame" />{name === "Wayfinder" ? <Image src="/landing-compass.png" alt="" width={62} height={62} className="hiw-seal-symbol" /> : <Icon name={icon} size={66} className="hiw-seal-symbol" />}</div><h3>{name}</h3></div>)}</div>
        </section>

        <section className="hiw-outcomes" aria-labelledby="outcomes-heading">
          <div className="hiw-section-heading"><p className="hiw-label">03 / Your next direction</p><h2 id="outcomes-heading">What You&apos;ll Get</h2><span className="hiw-heading-rule" /></div>
          <Card as="div" className="story-panel hiw-outcome-paper"><ul>{outcomes.map(([copy, icon]) => <li key={copy}><Icon name={icon} size={52} /><span>{copy}</span></li>)}</ul></Card>
        </section>

        <section className="hiw-trust" aria-labelledby="trust-heading"><h2 id="trust-heading" className="hiw-label">Good to Know</h2><div className="trust-strip">{trust.map(([copy, icon]) => <Card as="div" className="trust-card" key={copy}><Icon name={icon} size={45} /><p>{copy}</p></Card>)}</div></section>
        <section className="hiw-closing" aria-labelledby="closing-heading"><h2 id="closing-heading">Ready to see your map?</h2><Button href="/intake" className="story-button hiw-start" label="Start Your Journey ↗" /></section>
      </div>
      <footer className="story-footer"><Link className="story-brand" href="/"><Image src="/landing-compass.png" width={32} height={32} alt="" />CAREER COMPASS</Link><p>A web-based decision support system for Senior High School career guidance.</p><a href="#hiw-intro">Back to top ↑</a></footer>
    </main>
  );
}





