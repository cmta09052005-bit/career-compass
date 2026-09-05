"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./JourneyPortal.css";

export default function JourneyPortal({ onEnter, onCancel, onComplete, title, description, destinationSelector }) {
  const dialog = useRef(null);
  const advance = useRef(() => {});
  const handoff = useRef(false);
  useGSAP((context, contextSafe) => {
    dialog.current.showModal();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let entered = false;
    let observer;
    // One timeline owns the welcome, route handoff, popup exit and Basecamp entrance.
    // The opaque dialog stays mounted while Next loads and commits the destination.
    const tl = gsap.timeline();
    tl.from(".portal-compass", { rotation: reduced ? 0 : -100, scale: reduced ? 1 : .7, opacity: 0, duration: reduced ? .15 : .7, ease: "back.out(1.5)" });
    if (!reduced) {
      tl.fromTo(".portal-halo", { scale: .4, opacity: .7 }, { scale: 2.2, opacity: 0, duration: 1.2, repeat: 1, repeatDelay: -.6, ease: "power2.out" }, 0);
      tl.from(".portal-card", { scale: .94, duration: .55, ease: "back.out(1.6)" }, 0);
      tl.fromTo(".portal-compass", { filter: "drop-shadow(0 0 0px #d4a017)" }, { filter: "drop-shadow(0 0 20px #d4a017)", duration: .35, repeat: 1, yoyo: true }, 0);
      tl.fromTo(".portal-sparks i", { x: 0, y: 0, opacity: .8 }, { x: i => Math.cos(i * Math.PI / 12) * (110 + i % 3 * 30), y: i => Math.sin(i * Math.PI / 12) * (90 + i % 3 * 20), opacity: 0, rotation: i => i * 45, duration: 1.35, ease: "power2.out" }, 0);
    }
    const reveal = contextSafe(() => {
      const target = document.querySelector(destinationSelector);
      if (!target) return;
      observer?.disconnect();
      tl.to('.portal-card', { opacity: 0, scale: reduced ? 1 : .95, duration: reduced ? .1 : .3 }, 2)
        .to(dialog.current, { backgroundColor: 'rgba(27,42,74,0)', backdropFilter: 'blur(0px)', duration: reduced ? .1 : .4 }, reduced ? 2.1 : 2.2)
        .fromTo(target, { opacity: 0 }, { opacity: 1, duration: reduced ? .1 : .4, clearProps: 'opacity' }, reduced ? 2.1 : 2.2)
        .call(() => { onComplete(); target.querySelector('h1')?.focus({ preventScroll: true }); });
      tl.play(2);
    });
    const enter = () => {
      if (entered) return;
      entered = true;
      handoff.current = true;
      tl.pause(2);
      observer = new MutationObserver(reveal);
      observer.observe(document.body, { childList: true, subtree: true });
      onEnter();
      reveal();
    };
    advance.current = enter;
    tl.addPause(2, enter);
    return () => { observer?.disconnect(); tl.kill(); advance.current = () => {}; };
  }, { scope: dialog });
  return <dialog ref={dialog} className="journey-portal" aria-labelledby="portal-title" aria-describedby="portal-description" onCancel={event => { event.preventDefault(); if (!handoff.current) onCancel(); }} onClick={() => advance.current()} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); advance.current(); } }}><div className="portal-card"><div className="portal-symbol"><span className="portal-halo" aria-hidden="true" /><Image className="portal-compass" src="/landing-compass.png" alt="" width={86} height={100} /><div className="portal-sparks" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} />)}</div></div><h2 id="portal-title">{title}</h2><p id="portal-description">{description}</p></div></dialog>;
}


