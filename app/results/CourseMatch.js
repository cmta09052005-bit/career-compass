"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { playSound } from "@/lib/sound";

gsap.registerPlugin(useGSAP);

export default function CourseMatch({ course, rank, strength, dimmed, selected, onCompare, strongestCategory }) {
  const reveal = useRef(null);
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
    <Card as="article" className={`course-match ${rank === 1 ? "course-landmark" : ""}`} data-dimmed={dimmed}>
      {rank === 1 && <p className="landmark-label"><Image src="/icons/career-compass/island-flag.svg" width={48} height={48} alt="" />Your Landmark Match</p>}
      <div className="course-match-heading">
        <div>
          <p className="course-rank">Rank #{rank}</p>
          <h3>{course.courseId} – {course.courseName}</h3>
          <span className="course-category">{course.categoryName}</span>
        </div>
        <div className="course-strength" role="img" aria-label={`Relative match strength, ranked ${rank}`} data-tooltip="Arc shows relative strength among these matches" tabIndex={0}>
          <svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="35" fill="none" stroke="#cbb891" strokeWidth="5" /><circle cx="40" cy="40" r="35" fill="none" stroke="#98701c" strokeWidth="5" pathLength="100" strokeDasharray={`${strength} 100`} strokeLinecap="round" transform="rotate(-90 40 40)" /></svg>
          <Image src="/landing-compass.png" width={42} height={48} style={{ height: "auto" }} alt="" />
        </div>
      </div>
      {rank === 1 && strongestCategory && <p className="landmark-insight">Your strongest field was <strong>{strongestCategory.label}</strong>.</p>}
      <div className="course-match-actions">
        <Button label={<><Image src="/icons/career-compass/magnifying-glass.svg" width={26} height={26} alt="" />Explore This Course</>} href={`/results/${course.courseId}`} variant="secondary" />
        <button type="button" className="course-compare-toggle" aria-pressed={selected} aria-label={`Compare ${course.courseName}`} onClick={onCompare}><Image src="/icons/career-compass/magnifying-glass.svg" width={26} height={26} alt="" />{selected ? "Selected for comparison" : "Compare"}</button>
      </div>
    </Card>
  </div>;
}
