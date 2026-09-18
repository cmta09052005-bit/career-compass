"use client";

import Localized from "@/components/Localized";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./JourneyPortal.css";
import "./celebrations.css";
import CelebrationEffects from "./CelebrationEffects";

export default function JourneyPortal({ onEnter, onCancel, onComplete, title, description, notice, destinationSelector, celebration = true, icon = "/landing-compass.png" }) {
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
    const reveal = contextSafe(() => {
      const target = document.querySelector(destinationSelector);
      if (!target) return;
      observer?.disconnect();
      tl.to('.portal-card', { opacity: 0, scale: reduced ? 1 : .95, duration: .2 }, 2)
        .fromTo(target, { opacity: 0 }, { opacity: 1, duration: .2, clearProps: 'opacity' }, reduced ? 2.1 : 2.2)
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
  return <dialog ref={dialog} className="journey-portal" data-celebration={celebration ? "true" : undefined} aria-labelledby="portal-title" aria-describedby={notice ? "portal-description portal-notice" : "portal-description"} onCancel={event => { event.preventDefault(); if (!handoff.current) onCancel(); }} onClick={() => advance.current()} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); advance.current(); } }}><Localized as="div" className={`portal-card popup-card celebration-card ${celebration ? "popup-win" : ""}`}><Localized as="button" className="popup-close" aria-label="Close dialog" onKeyDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); if (handoff.current) onComplete(); else onCancel(); }}>×</Localized><CelebrationEffects><Localized as={Image} className="portal-compass" src={icon} alt="" width={116} height={116} /></CelebrationEffects><Localized as="h2" id="portal-title">{title}</Localized><Localized as="p" id="portal-description">{description}</Localized>{notice && <Localized as="p" id="portal-notice" className="portal-notice">{notice}</Localized>}</Localized></dialog>;
}


