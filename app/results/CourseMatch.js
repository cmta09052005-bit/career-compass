"use client";

import Localized from "@/components/Localized";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { playSound } from "@/lib/sound";
import { resultLabels } from "@/lib/recommendations";
import { useLanguage } from "@/components/LanguageProvider";
import CourseInfo from "./CourseInfo";

gsap.registerPlugin(useGSAP);

export default function CourseMatch({ course, rank, strength, selected, onCompare, onLeave, showHint }) {
  const reveal = useRef(null);
  const labels = resultLabels(course);
  const { t } = useLanguage();
  useGSAP((context, contextSafe) => {
    const element = reveal.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) gsap.set(element, { opacity: 0, y: 14 });
    const observer = new IntersectionObserver(contextSafe(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      gsap.to(element, { opacity: 1, y: 0, duration: reduced ? 0 : .32, ease: "power2.out", clearProps: "opacity,transform" });
      playSound(rank === 1 ? "unlock" : "open", { volume: rank === 1 ? .3 : .14 });
      observer.disconnect();
    }), { root: element.closest(".assessment-scroll"), threshold: .08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, { scope: reveal });

  return <div ref={reveal} className="course-reveal">
    <Card as="article" className={`course-match ${rank === 1 ? "course-landmark" : ""}`}>
      {rank === 1 && <Localized as="p" className="landmark-label"><Localized as={Image} src="/icons/career-compass/island-flag.svg" width={48} height={48} alt="" />Your Landmark Match</Localized>}
      <div className="course-match-heading">
        <div>
          <Localized as="p" className="course-rank">{labels.rank}</Localized>
          <Localized as="h3">{labels.title}</Localized>
        </div>
        <Localized as="div" className="course-strength" role="img" aria-label={labels.arc} data-tooltip={labels.tooltip} tabIndex={0}>
          <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="35" fill="none" stroke="#cbb891" strokeWidth="5" /><circle cx="40" cy="40" r="35" fill="none" stroke="#98701c" strokeWidth="5" pathLength="100" strokeDasharray={`${strength} 100`} strokeLinecap="round" transform="rotate(-90 40 40)" /></svg>
          <Localized as={Image} src="/landing-compass.png" width={42} height={48} style={{ height: "auto" }} alt="" />
        </Localized>
      </div>
      <CourseInfo course={course} info={course.info} hint={showHint ? course.searchMatch?.hint : null} onLeave={onLeave} t={t} />
      <div className="course-match-actions">
        <Button label={<><Localized as={Image} src="/icons/career-compass/magnifying-glass.svg" width={26} height={26} alt="" />Explore This Course</>} href={`/results/${course.id}`} variant="secondary" onNavigate={onLeave} />
        <Localized as="button" type="button" className="course-compare-toggle" aria-pressed={selected} aria-label={`Compare ${course.name}`} onClick={onCompare}>{selected ? "Selected for comparison" : "Compare"}</Localized>
      </div>
    </Card>
  </div>;
}
