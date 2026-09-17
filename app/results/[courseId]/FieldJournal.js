"use client";

import { Children, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button";
import StatementIcon from "@/app/journey/skills/StatementIcon";
import { useSessionAnswers } from "@/lib/useSessionAnswers";
import { toggleCourseComparison } from "@/lib/courseComparison";
import { playSound } from "@/lib/sound";
import "./journal.css";

gsap.registerPlugin(useGSAP);

const TABS = [
  { id: "overview", label: "Overview", asset: "/landing-compass.png" },
  { id: "study", label: "What You'll Study", category: "C4" },
  { id: "schools", label: "Where Can You Study", asset: "/icons/career-compass/flag-marker-pin.svg" },
  { id: "careers", label: "Where Can This Path Lead", category: "C3" },
  { id: "guidance", label: "Guidance Tips", asset: "/icons/career-compass/ribbon-scroll.svg" },
  { id: "aid", label: "Financial Aid", asset: "/icons/career-compass/wax-seal-frame.svg" },
];

export default function FieldJournal({ course, categoryCode, children }) {
  const [active, setActive] = useState(0);
  const journal = useRef(null);
  const pages = useRef([]);
  const tabs = useRef([]);
  const { session, isReady, updateSession } = useSessionAnswers();
  const viewed = [...new Set([0, ...(session.journalViews?.[course.courseId] || [])])];
  const comparison = session.courseComparison || [];
  const selected = comparison.includes(course.courseId);
  const panels = Children.toArray(children);

  useEffect(() => {
    if (!isReady || session.journalViews?.[course.courseId]?.includes(0)) return;
    updateSession({ journalViews: { ...session.journalViews, [course.courseId]: [0, ...(session.journalViews?.[course.courseId] || [])] } });
  }, [isReady, session.journalViews, course.courseId, updateSession]);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(pages.current[active], { opacity: .5, rotationY: -3, x: 5, transformOrigin: "left center" }, { opacity: 1, rotationY: 0, x: 0, duration: .24, ease: "power2.out", clearProps: "opacity,transform,transformOrigin" });
  }, { scope: journal, dependencies: [active], revertOnUpdate: true });

  function openTab(index, focus = false) {
    if (active !== index) {
      setActive(index);
      playSound("open", { volume: .14 });
      if (!viewed.includes(index)) updateSession({ journalViews: { ...session.journalViews, [course.courseId]: [...viewed, index] } });
    }
    if (focus) tabs.current[index]?.focus();
    tabs.current[index]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function navigateTabs(event, index) {
    const next = event.key === "ArrowRight" ? (index + 1) % TABS.length : event.key === "ArrowLeft" ? (index + TABS.length - 1) % TABS.length : event.key === "Home" ? 0 : event.key === "End" ? TABS.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    openTab(next, true);
  }

  return <main ref={journal} className="course-screen field-journal game-ui-screen explorer-map-screen">
    <Link href="/results" className="trail-exit popup-close" aria-label="Close course details">×</Link>
    <div className="journal-shell" data-tab={TABS[active].id}>
      <header className="journal-header">
        <p className="map-ribbon">Discovered Career Path</p>
        <h1>{course.courseName}</h1>
        <p className="journal-category">{course.category} · {course.courseId}</p>
        <div className="journal-tools">
          <button type="button" className="journal-compare" disabled={!isReady} aria-pressed={selected} onClick={() => updateSession({ courseComparison: toggleCourseComparison(comparison, course.courseId) })}><Image src="/icons/career-compass/magnifying-glass.svg" width={24} height={24} alt="" />{selected ? "Added to Compare" : "Add to Compare"}</button>
          <div className="journal-bookmark" role="status" aria-label={`${viewed.length} of 6 tabs viewed`}><span>{viewed.length} of 6 explored</span><div aria-hidden="true">{TABS.map((tab, index) => <i key={tab.id} data-viewed={viewed.includes(index)} />)}</div></div>
        </div>
      </header>
      <div className="journal-tabs" role="tablist" aria-label="Field journal sections">
        {TABS.map((tab, index) => <button key={tab.id} ref={element => { tabs.current[index] = element; }} type="button" role="tab" id={`journal-tab-${tab.id}`} aria-controls={`journal-panel-${tab.id}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => openTab(index)} onKeyDown={event => navigateTabs(event, index)}>
          {tab.category ? <StatementIcon category={tab.category} /> : <Image src={tab.asset} width={28} height={28} style={{ height: "auto" }} alt="" />}<span>{tab.label}</span>
        </button>)}
      </div>
      <div className="journal-pages">
        <div className="journal-watermark" aria-hidden="true"><StatementIcon category={categoryCode} /></div>
        {TABS.map((tab, index) => <section ref={element => { pages.current[index] = element; }} key={tab.id} id={`journal-panel-${tab.id}`} className="journal-page" role="tabpanel" aria-labelledby={`journal-tab-${tab.id}`} tabIndex={0} hidden={active !== index}>{panels[index]}</section>)}
      </div>
      <footer className="journal-footer"><Button label="Back to Results" href="/results" variant="secondary" /><button type="button" className="journal-aid-link" onClick={() => openTab(5, true)}>Need help with school expenses?</button></footer>
    </div>
  </main>;
}
