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
import "../story.css";
import "../how-it-works/how-it-works.css";
import "./about.css";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger);
const pillars = [
  ["Exploratory", 'No pressure to give the "right" answer. Just discover what fits.', "magnifying-glass"],
  ["Supportive", "Built to guide you, not judge you.", "flag-marker-pin"],
  ["Interactive", "You answer through scenarios and simple sliders, not long, boring forms.", "footprint-trail"],
  ["Personalized", "Your results are based on you: your interests, your skills, your grades.", "sunburst"],
];
const team = [["Charlene Mae T. Adille", "CA"], ["Juno Alligah B. Romano", "JR"]];
const faqs = [
  ["Is this an official DepEd tool?", "No. Career Compass is an independent student capstone project, not an official DepEd system. It's meant to support your school's guidance process, not replace it."],
  ["Will this tell me exactly what course to take?", "No. It gives you a ranked list of course matches to explore based on your answers. The final decision is always yours."],
  ["Do I need to create an account?", "No. Nothing is saved after you close the tab. It's free and open to any Senior High School student."],
  ["How accurate are the results?", "Career Compass uses a scoring method built with input from real guidance counselors, but it's a guide, not a guarantee. Talk to your counselor, family, or teachers too."],
];

export default function About() {
  const root = useRef(null);
  const [flipped, setFlipped] = useState([false, false]);
  const [openFAQ, setOpenFAQ] = useState(null);
  const { contextSafe } = useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".pillar-card", { opacity: 0, y: 30, duration: 0.6, stagger: 0.15, scrollTrigger: { trigger: ".pillars-section", start: "top 80%" } });
      gsap.from(".team-card", { rotationY: 90, opacity: 0, duration: 0.7, stagger: 0.2, ease: "power2.out", scrollTrigger: { trigger: ".team-section", start: "top 75%" } });
      gsap.to(".about-start", { scale: 1.03, ease: "sine.inOut", boxShadow: "0 0 20px rgba(212,160,23,0.6)", repeat: -1, yoyo: true, duration: 1.8 });
    });
    return () => mm.revert();
  }, { scope: root });

  const flipCard = (index) => {
    const next = !flipped[index];
    setFlipped((current) => current.map((value, item) => item === index ? next : value));
    contextSafe(() => gsap.to(root.current.querySelector(`[data-person="${index}"] .team-card-inner`), { rotationY: next ? 180 : 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.5, ease: "power2.inOut", overwrite: true }))();
  };
  const showFAQ = (next) => {
    setOpenFAQ(next);
    contextSafe(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      root.current.querySelectorAll(".faq-item").forEach((item, itemIndex) => {
        const answer = item.querySelector(".faq-answer");
        const expanded = itemIndex === next;
        // Measure the inner text so the tween remains interruptible and wraps on mobile.
        const height = answer.firstElementChild.getBoundingClientRect().height;
        gsap.to(answer, { height: expanded ? height : 0, opacity: expanded ? 1 : 0, duration: reduced ? 0 : 0.25, ease: "power2.out", overwrite: true, onComplete: () => { if (expanded) gsap.set(answer, { height: "auto" }); ScrollTrigger.refresh(); } });
        gsap.to(item.querySelector(".faq-icon"), { rotation: expanded ? 180 : 0, duration: reduced ? 0 : 0.3, overwrite: true });
      });
    })();
  };

  return (
    <main ref={root} className={`story-home hiw-page about-page ${marketingFonts}`}>
      <Localized as="a" href="#about-intro" className="story-skip">Skip to content</Localized>
      <div className="hiw-watermark" aria-hidden="true" />
      <div className="about-container">
        <section id="about-intro" className="about-intro" aria-labelledby="about-title">
          <Localized as={Image} src="/landing-compass.png" alt="" width={76} height={76} priority />
          <Localized as="p" className="hiw-label">About</Localized><Localized as="h1" id="about-title">Why Career<br />Compass exists.</Localized>
          <Localized as="p">A lot of Senior High School students end up guessing when it&apos;s time to pick a college course. This was built to make that choice a little less confusing, and a lot less scary.</Localized>
        </section>
        <section className="about-text-section" aria-labelledby="problem-title">
          <Localized as="p" className="hiw-label">The Problem</Localized><div><Localized as="h2" id="problem-title">Choosing a course shouldn&apos;t feel like guessing.</Localized><Localized as="p">Many students pick a course based on what&apos;s popular, what their friends chose, or what their family expects, not what actually fits them. Most schools want to help, but counselors often don&apos;t have enough time to sit down with every single student.</Localized></div>
        </section>
        <section className="pillars-section" aria-labelledby="approach-title">
          <Localized as="p" className="hiw-label">Our Approach</Localized><Localized as="h2" id="approach-title">Built to feel like exploring,<br />not taking a test.</Localized>
          <Localized as="div" className="about-pillars">{pillars.map(([name, copy, icon], index) => <Card as="article" className="story-panel pillar-card" key={name}><Localized as="span" className="about-card-number">0{index + 1}</Localized><Localized as={Image} src={`/icons/career-compass/${icon}.svg`} alt="" width={60} height={60} /><Localized as="h3">{name}</Localized><Localized as="p">{copy}</Localized></Card>)}</Localized>
        </section>
        <section className="about-text-section about-research" aria-labelledby="research-title">
          <Localized as="p" className="hiw-label">Grounded in<br />Real Research</Localized><div><Localized as="h2" id="research-title">Not just an idea. Built with real schools.</Localized><Localized as="p">Career Compass was developed with guidance counselors and teachers from senior high schools in Albay, so the questions and results reflect what students actually go through, not just theory.</Localized></div>
        </section>
        <section className="team-section" aria-labelledby="team-title">
          <Localized as="p" className="hiw-label">Who Made This</Localized><Localized as="h2" id="team-title">Made by two BSIT students who wanted better guidance for Senior High.</Localized>
          <Localized as="p" className="about-team-description">Career Compass is a capstone project by Charlene Mae T. Adille and Juno Alligah B. Romano, BSIT students at Bicol University Polangui. It was built because they saw how many students in their own community needed this kind of support.</Localized>
          <Localized as="div" className="about-team-grid">{team.map(([name, initials], index) => <div className="team-card" data-person={index} key={name}>
            <Localized as="button" className="about-team-button" type="button" onClick={() => flipCard(index)} aria-label={`${flipped[index] ? "Show front" : "Read biography"}: ${name}`} aria-pressed={flipped[index]}>
              <span className="team-card-inner">
                <span className="team-face team-front" aria-hidden={flipped[index]}><Localized as="span" className="team-portrait" aria-label="Initials in place of a portrait photo"><Localized as="span" className="team-initials">{initials}</Localized><Localized as={Image} src="/icons/career-compass/wax-seal-frame.svg" alt="" width={185} height={185} /></Localized><Localized as="span" className="team-name">{name}</Localized><Localized as="span" className="team-role">BSIT Student Researcher</Localized><Localized as="span" className="team-school">Bicol University Polangui</Localized><Localized as="span" className="team-flip-hint">Read bio <Localized as="span" aria-hidden="true">↗</Localized></Localized></span>
                <span className="team-face team-back" aria-hidden={!flipped[index]}><Localized as={Image} src="/landing-compass.png" alt="" width={58} height={58} /><Localized as="span" className="team-name">{name}</Localized><Localized as="span" className="team-role">BSIT Student Researcher</Localized><Localized as="span" className="team-bio">Co-created Career Compass as part of a BSIT capstone project at Bicol University Polangui, from early research through system design and development.<Localized as="span" className="team-thanks">“Thank you for exploring what we built.”</Localized></Localized><Localized as="span" className="team-flip-hint">Back to front <Localized as="span" aria-hidden="true">↶</Localized></Localized></span>
              </span>
            </Localized>
          </div>)}</Localized>
        </section>
        <section className="about-avatar-credits" aria-label="Character avatar credits">
          <Localized as="p">Character avatars in Career Compass were generated using Anthropic and curated by the development team.</Localized>
        </section>
        <section className="about-faq" aria-labelledby="faq-title"><Localized as="p" className="hiw-label">A few honest answers</Localized><Localized as="h2" id="faq-title">Questions you might have</Localized><Localized as="div" className="faq-list">{faqs.map(([question, answer], index) => <div className="faq-item" key={question} onPointerEnter={(event) => { if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) showFAQ(index); }} onPointerLeave={(event) => { if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) showFAQ(null); }}><h3><button type="button" id={`faq-question-${index}`} aria-expanded={openFAQ === index} aria-controls={`faq-answer-${index}`} onClick={() => showFAQ(openFAQ === index ? null : index)}><Localized as="span">{question}</Localized><span className="faq-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 9 7 7 7-7" /></svg></span></button></h3><div id={`faq-answer-${index}`} className="faq-answer" role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={openFAQ !== index}><Localized as="p">{answer}</Localized></div></div>)}</Localized></section>
        <section className="hiw-closing" aria-labelledby="about-closing-title"><Localized as="h2" id="about-closing-title">Ready to start exploring?</Localized><Button href="/intake" className="story-button about-start" label="Start Your Journey ↗" /><Localized as={Link} href="/how-it-works" className="story-text-link">How It Works ↗</Localized></section>
      </div>
      <footer className="story-footer"><Localized as={Link} className="story-brand" href="/"><Localized as={Image} src="/landing-compass.png" width={32} height={32} alt="" />CAREER COMPASS</Localized><Localized as="p">A web-based decision support system for Senior High School career guidance.</Localized><Localized as="a" href="#about-intro">Back to top ↑</Localized></footer>
    </main>
  );
}


