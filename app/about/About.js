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
  const toggleFAQ = (index) => {
    const next = openFAQ === index ? null : index;
    setOpenFAQ(next);
    contextSafe(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      root.current.querySelectorAll(".faq-item").forEach((item, itemIndex) => {
        const answer = item.querySelector(".faq-answer");
        const expanded = itemIndex === next;
        // Measure the inner text so the tween remains interruptible and wraps on mobile.
        const height = answer.firstElementChild.getBoundingClientRect().height;
        gsap.to(answer, { height: expanded ? height : 0, opacity: expanded ? 1 : 0, duration: reduced ? 0 : 0.35, ease: "power1.inOut", overwrite: true, onComplete: () => { if (expanded) gsap.set(answer, { height: "auto" }); ScrollTrigger.refresh(); } });
        gsap.to(item.querySelector(".faq-icon"), { rotation: expanded ? 45 : 0, duration: reduced ? 0 : 0.3, overwrite: true });
      });
    })();
  };

  return (
    <main ref={root} className={`story-home hiw-page about-page ${marketingFonts}`}>
      <a href="#about-intro" className="story-skip">Skip to content</a>
      <div className="hiw-watermark" aria-hidden="true" />
      <div className="about-container">
        <section id="about-intro" className="about-intro" aria-labelledby="about-title">
          <Image src="/landing-compass.png" alt="" width={76} height={76} priority />
          <p className="hiw-label">About</p><h1 id="about-title">Why Career<br />Compass exists.</h1>
          <p>A lot of Senior High School students end up guessing when it&apos;s time to pick a college course. This was built to make that choice a little less confusing, and a lot less scary.</p>
        </section>
        <section className="about-text-section" aria-labelledby="problem-title">
          <p className="hiw-label">The Problem</p><div><h2 id="problem-title">Choosing a course shouldn&apos;t feel like guessing.</h2><p>Many students pick a course based on what&apos;s popular, what their friends chose, or what their family expects, not what actually fits them. Most schools want to help, but counselors often don&apos;t have enough time to sit down with every single student.</p></div>
        </section>
        <section className="pillars-section" aria-labelledby="approach-title">
          <p className="hiw-label">Our Approach</p><h2 id="approach-title">Built to feel like exploring,<br />not taking a test.</h2>
          <div className="about-pillars">{pillars.map(([name, copy, icon], index) => <Card as="article" className="story-panel pillar-card" key={name}><span className="about-card-number">0{index + 1}</span><Image src={`/icons/career-compass/${icon}.svg`} alt="" width={60} height={60} /><h3>{name}</h3><p>{copy}</p></Card>)}</div>
        </section>
        <section className="about-text-section about-research" aria-labelledby="research-title">
          <p className="hiw-label">Grounded in<br />Real Research</p><div><h2 id="research-title">Not just an idea. Built with real schools.</h2><p>Career Compass was developed with guidance counselors and teachers from senior high schools in Albay, so the questions and results reflect what students actually go through, not just theory.</p></div>
        </section>
        <section className="team-section" aria-labelledby="team-title">
          <p className="hiw-label">Who Made This</p><h2 id="team-title">Made by two BSIT students who wanted better guidance for Senior High.</h2>
          <p className="about-team-description">Career Compass is a capstone project by Charlene Mae T. Adille and Juno Alligah B. Romano, BSIT students at Bicol University Polangui. It was built because they saw how many students in their own community needed this kind of support.</p>
          <div className="about-team-grid">{team.map(([name, initials], index) => <div className="team-card" data-person={index} key={name}>
            <button className="about-team-button" type="button" onClick={() => flipCard(index)} aria-label={`${flipped[index] ? "Show front" : "Read biography"}: ${name}`} aria-pressed={flipped[index]}>
              <span className="team-card-inner">
                <span className="team-face team-front" aria-hidden={flipped[index]}><span className="team-portrait" aria-label="Initials in place of a portrait photo"><span className="team-initials">{initials}</span><Image src="/icons/career-compass/wax-seal-frame.svg" alt="" width={185} height={185} /></span><span className="team-name">{name}</span><span className="team-role">BSIT Student Researcher</span><span className="team-school">Bicol University Polangui</span><span className="team-flip-hint">Read bio <span aria-hidden="true">↗</span></span></span>
                <span className="team-face team-back" aria-hidden={!flipped[index]}><Image src="/landing-compass.png" alt="" width={58} height={58} /><span className="team-name">{name}</span><span className="team-role">BSIT Student Researcher</span><span className="team-bio">Co-created Career Compass as part of a BSIT capstone project at Bicol University Polangui, from early research through system design and development.<span className="team-thanks">“Thank you for exploring what we built.”</span></span><span className="team-flip-hint">Back to front <span aria-hidden="true">↶</span></span></span>
              </span>
            </button>
          </div>)}</div>
        </section>
        <section className="about-faq" aria-labelledby="faq-title"><p className="hiw-label">A few honest answers</p><h2 id="faq-title">Questions you might have</h2><div className="faq-list">{faqs.map(([question, answer], index) => <div className="faq-item" key={question}><h3><button type="button" id={`faq-question-${index}`} aria-expanded={openFAQ === index} aria-controls={`faq-answer-${index}`} onClick={() => toggleFAQ(index)}><span>{question}</span><span className="faq-icon" aria-hidden="true">+</span></button></h3><div id={`faq-answer-${index}`} className="faq-answer" role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={openFAQ !== index}><p>{answer}</p></div></div>)}</div></section>
        <section className="hiw-closing" aria-labelledby="about-closing-title"><h2 id="about-closing-title">Ready to start exploring?</h2><Button href="/intake" className="story-button about-start" label="Start Your Journey ↗" /></section>
      </div>
      <footer className="story-footer"><Link className="story-brand" href="/"><Image src="/landing-compass.png" width={32} height={32} alt="" />CAREER COMPASS</Link><p>A web-based decision support system for Senior High School career guidance.</p><a href="#about-intro">Back to top ↑</a></footer>
    </main>
  );
}


