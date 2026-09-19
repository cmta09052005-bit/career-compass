"use client";

import Localized from "@/components/Localized";

import { Children, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button";
import StatementIcon from "@/app/journey/skills/StatementIcon";
import { useSessionAnswers } from "@/lib/useSessionAnswers";
import { COMPARISON_LIMIT_NOTICE, toggleCourseComparison } from "@/lib/courseComparison";
import { playSound } from "@/lib/sound";
import "./journal.css";

gsap.registerPlugin(useGSAP);

const TABS = [
  { id: "overview", label: "Overview", asset: "/icons/career-compass/course-overview-dossier.svg" },
  { id: "study", label: "What You'll Study", asset: "/icons/career-compass/course-study-books.svg" },
  { id: "schools", label: "Where Can You Study", asset: "/icons/career-compass/course-schools-academy.svg" },
  { id: "careers", label: "Where Can This Path Lead", asset: "/icons/career-compass/course-careers-signpost.svg" },
  { id: "guidance", label: "Guidance Tips", asset: "/icons/career-compass/course-guidance-lantern.svg" },
  { id: "aid", label: "Financial Aid", asset: "/icons/career-compass/course-aid-purse.svg" },
];

export default function FieldJournal({ course, categoryCode, children }) {
  const [active, setActive] = useState(0);
  const [comparisonNotice, setComparisonNotice] = useState("");
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

  function toggleComparison() {
    if (!selected && comparison.length >= 2) { setComparisonNotice(COMPARISON_LIMIT_NOTICE); return; }
    setComparisonNotice("");
    updateSession({ courseComparison: toggleCourseComparison(comparison, course.courseId) });
  }

  function navigateTabs(event, index) {
    const next = event.key === "ArrowRight" ? (index + 1) % TABS.length : event.key === "ArrowLeft" ? (index + TABS.length - 1) % TABS.length : event.key === "Home" ? 0 : event.key === "End" ? TABS.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    openTab(next, true);
  }

  return <main ref={journal} className="course-screen field-journal game-ui-screen explorer-map-screen">
    <div className="journal-shell" data-tab={TABS[active].id}>
      <Localized as={Link} href="/results" className="trail-exit popup-close" aria-label="Close course details">×</Localized>
      <Localized as="header" className="journal-header">
        <Localized as="p" className="map-ribbon">Discovered Career Path</Localized>
        <Localized as="h1">{course.courseName}</Localized>
        <Localized as="p" className="journal-category">{course.category} · {course.courseId}</Localized>
        <div className="journal-tools">
          <Localized as="button" type="button" className="journal-compare" disabled={!isReady} aria-pressed={selected} onClick={toggleComparison}>{selected ? "Added to Compare" : "Add to Compare"}</Localized>
          <Localized as="div" className="journal-bookmark" role="status" aria-label={`${viewed.length} of 6 tabs viewed`}><Localized as="span">{viewed.length} of 6 explored</Localized><Localized as="div" aria-hidden="true">{TABS.map((tab, index) => <i key={tab.id} data-viewed={viewed.includes(index)} />)}</Localized></Localized>
        </div>
        {comparisonNotice && <Localized as="p" role="alert" className="journal-comparison-notice">{comparisonNotice}</Localized>}
      </Localized>
      <Localized as="div" className="journal-tabs" role="tablist" aria-label="Field journal sections">
        {TABS.map((tab, index) => <Localized as="button" key={tab.id} ref={element => { tabs.current[index] = element; }} type="button" role="tab" id={`journal-tab-${tab.id}`} aria-controls={`journal-panel-${tab.id}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => openTab(index)} onKeyDown={event => navigateTabs(event, index)}>
          <Localized as={Image} src={tab.asset} width={28} height={28} style={{ height: "auto" }} alt="" /><Localized as="span">{tab.label}</Localized>
        </Localized>)}
      </Localized>
      <Localized as="div" className="journal-pages">
        <div className="journal-watermark" aria-hidden="true"><StatementIcon category={categoryCode} /></div>
        {TABS.map((tab, index) => <Localized as="section" ref={element => { pages.current[index] = element; }} key={tab.id} id={`journal-panel-${tab.id}`} className="journal-page" role="tabpanel" aria-labelledby={`journal-tab-${tab.id}`} tabIndex={0} hidden={active !== index}>{panels[index]}</Localized>)}
      </Localized>
      <footer className="journal-footer"><Button label="Back to Results" href="/results" variant="secondary" /><Localized as="button" type="button" className="journal-aid-link" onClick={() => openTab(5, true)}>Need help with school expenses?</Localized></footer>
    </div>
  </main>;
}
