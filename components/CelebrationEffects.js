"use client";

import Localized from "@/components/Localized";
export default function CelebrationEffects({ children, major = false, theme }) {
  const count = major ? 36 : 24;
  return <Localized as="div" className={`celebration-symbol ${major ? "celebration-major" : ""}`}>
    <span className="celebration-halo" aria-hidden="true" />
    <span className="celebration-ring" aria-hidden="true" />
    <Localized as="div" className="celebration-sparks" aria-hidden="true">{Array.from({ length: count }, (_, index) => <i key={index} style={{ "--spark-angle": `${index * 360 / count}deg`, "--spark-distance": `${(major ? 145 : 105) + index % 3 * 15}px`, animationDelay: `${index % 3 * 35}ms` }} />)}</Localized>
    {theme && <Localized as="div" className={`celebration-theme celebration-theme-${theme}`} aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} style={{ "--particle-x": `${(index % 5 - 2) * 43}px`, "--particle-y": `${Math.floor(index / 5) * 120 - 60}px`, "--particle-turn": `${index % 2 ? -140 : 160}deg`, animationDelay: `${index * 60}ms` }} />)}</Localized>}
    {children}
  </Localized>;
}
