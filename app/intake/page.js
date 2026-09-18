"use client";

import Localized from "@/components/Localized";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button";
import usePopupState from "@/components/usePopupState";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { useSessionAnswers } from "@/lib/useSessionAnswers";
import "./basecamp.css";

gsap.registerPlugin(useGSAP);

const STRANDS = ["Academic-STEM", "Academic-ABM", "Academic-HUMSS", "TVL", "Arts & Design", "Sports"];
const YEAR_LEVELS = ["Grade 11", "Grade 12"];
const EXPLORERS = [
  ["wanderer", "The Wanderer", "Curious about everything, sure about nothing yet."],
  ["trailblazer", "The Trailblazer", "Leads first, figures it out along the way."],
  ["scout", "The Scout", "Notices details others walk past."],
  ["cartographer", "The Cartographer", "Likes a plan, even for the unknown."],
  ["ranger", "The Ranger", "Steady, patient, prepared for anything."],
  ["navigator", "The Navigator", "Always finding the next direction."],
  ["random", "Random", "We'll pick an Explorer for you."],
];

function SelectionStamp() {
  return <Badge variant="icon" size="small" state="unlocked" className="basecamp-stamp" aria-hidden="true" icon={<Localized as="span" className="basecamp-stamp-check">✓</Localized>} />;
}

function CampDust() {
  const dust = useRef(null);
  useEffect(() => {
    const update = () => { if (dust.current) dust.current.closest(".basecamp").dataset.ambientPaused = String(document.hidden || !document.hasFocus()); };
    update();
    document.addEventListener("visibilitychange", update);
    window.addEventListener("blur", update);
    window.addEventListener("focus", update);
    return () => { document.removeEventListener("visibilitychange", update); window.removeEventListener("blur", update); window.removeEventListener("focus", update); };
  }, []);
  return <Localized as="div" ref={dust} className="basecamp-dust" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ left: `${6 + index * 6.6}%`, top: `${12 + (index * 23) % 78}%`, animationDelay: `${index * -2.7}s`, animationDuration: `${16 + index % 4 * 3}s` }} />)}</Localized>;
}

export default function IntakePage() {
  const router = useRouter();
  const { session, isReady, updateSession } = useSessionAnswers();
  const [step, setStep] = useState(1);
  const [sessionEnded, setSessionEnded] = useState(false);
  useEffect(() => { queueMicrotask(() => setSessionEnded(new URLSearchParams(window.location.search).get("session") === "ended")); }, []);
  useEffect(() => {
    const restoreStep = () => { transitioning.current = false; setStep(new URLSearchParams(window.location.search).get("step") === "2" ? 2 : 1); };
    queueMicrotask(restoreStep);
    window.addEventListener("popstate", restoreStep);
    return () => window.removeEventListener("popstate", restoreStep);
  }, []);
  const [error, setError] = useState(false);
  const [leaving, setLeaving] = usePopupState(false, ".basecamp-leave");
  const leaveDialog = useRef(null);
  const root = useRef(null);
  const inner = useRef(null);
  const heading = useRef(null);
  const strandGroup = useRef(null);
  const transitioning = useRef(false);
  const errorTween = useRef(null);
  const { contextSafe } = useGSAP(() => {
    if (!(step === 1 && document.querySelector(".journey-portal[open]"))) gsap.fromTo(inner.current, { opacity: 0 }, { opacity: 1, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .28, onComplete: () => { transitioning.current = false; } });
    inner.current.scrollTop = 0;
    heading.current?.focus({ preventScroll: true });
  }, { scope: root, dependencies: [step], revertOnUpdate: true });

  const advance = (event) => contextSafe(() => {
    event.preventDefault();
    if (!isReady || transitioning.current) return;
    if (!STRANDS.includes(session.strand)) {
      setError(true);
      strandGroup.current.querySelector("input")?.focus();
      errorTween.current?.kill();
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        errorTween.current = gsap.fromTo(".basecamp-strands .basecamp-choice-face", { borderColor: "#FF7F3F" }, { borderColor: "rgba(212,160,23,.3)", duration: .24, repeat: 3, yoyo: true, clearProps: "borderColor" });
      }
      return;
    }
    transitioning.current = true;
    gsap.to(inner.current, { opacity: 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .28, onComplete: () => { window.history.pushState(null, "", "/intake?step=2"); setStep(2); } });
  })();
  const chooseStrand = (strand) => {
    errorTween.current?.revert();
    setError(false);
    updateSession({ strand });
  };

  const changeStep = (next) => contextSafe(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    gsap.to(inner.current, { opacity: 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .28, onComplete: () => { window.history.pushState(null, "", next === 2 ? "/intake?step=2" : "/intake"); setStep(next); } });
  })();
  const back = () => {
    if (step === 2) changeStep(1);
    else if (session.nickname || session.strand || session.yearLevel || session.avatarId) setLeaving(true);
    else router.push("/");
  };
  useEffect(() => {
    if (leaving) leaveDialog.current?.showModal();
    else leaveDialog.current?.close();
  }, [leaving]);

  return (
    <Localized as="main" ref={root} className={`basecamp basecamp-step-${step}`} aria-label="Explorer profile">
      <div className="basecamp-watermark" aria-hidden="true" />
      <CampDust />
      <div className="basecamp-mist" aria-hidden="true"><i /><i /></div>
      <div className="basecamp-appbar"><Localized as="span" className="basecamp-wordmark"><Localized as={Image} src="/landing-compass.png" width={24} height={28} alt="" />CAREER COMPASS</Localized></div>
      <Card className="basecamp-shell" aria-labelledby="basecamp-title">
        <Localized as="button" type="button" className="basecamp-back basecamp-card-back" onClick={back}>← Back</Localized>
        <Localized as="div" ref={inner} className="basecamp-inner">
          <Localized as="header" className="basecamp-heading">
            <Localized as={Image} src="/landing-compass.png" width={52} height={60} alt="" className="basecamp-compass" priority /><span className="basecamp-compass-sparks" aria-hidden="true"><i /><i /><i /><i /></span>
            {sessionEnded && <Localized as="p" className="basecamp-subtext" role="status">Your session ended. Let’s start again.</Localized>}
            <Localized as="p" className="basecamp-eyebrow">BASECAMP · EXPLORER PROFILE</Localized>
            <Localized as="div" className="basecamp-steps" aria-label={`Step ${step} of 2`}><span aria-hidden="true" className="filled" /><i aria-hidden="true" /><span aria-hidden="true" className={step === 2 ? "filled" : ""} /><Localized as="p">Step {step} of 2</Localized></Localized>
            <Localized as="h1" id="basecamp-title" ref={heading} tabIndex={-1}>{step === 1 ? "Who Are You, Explorer?" : session.nickname.trim() ? `Choose Your Explorer, ${session.nickname.trim()}` : "Choose Your Explorer"}</Localized>
            <Localized as="p" className="basecamp-subtext">{step === 1 ? "Choose your strand to begin. You can also add a name for your map." : "Pick who you'll be for this journey. It's just for fun, your answers are what really matter."}</Localized>
            {step === 1 && <Localized as="p" className="basecamp-privacy">No account needed. Nothing you enter here is saved once your session ends.</Localized>}
            {step === 2 && <Localized as="div" className="basecamp-recap"><Localized as="span"><i className="recap-person" aria-hidden="true" />{session.nickname.trim() || "Explorer"}</Localized><Localized as="b" aria-hidden="true">•</Localized><Localized as="span">{session.strand}</Localized>{session.yearLevel && <><Localized as="b" aria-hidden="true">•</Localized><Localized as="span">{session.yearLevel}</Localized></>}<Localized as="button" type="button" onClick={() => changeStep(1)}>Edit</Localized></Localized>}
          </Localized>
          {step === 1 ? <form onSubmit={advance} noValidate className="basecamp-form">
            <div>
              <Localized as="label" htmlFor="nickname">Your nickname or first name <Localized as="span" className="basecamp-optional">Optional</Localized></Localized>
              <Localized as="input" id="nickname" type="text" name="nickname" autoComplete="given-name" maxLength={50} placeholder="What should we call you?" value={session.nickname} disabled={!isReady} onChange={(event) => updateSession({ nickname: event.target.value })} />
            </div>
            <Localized as="fieldset" ref={strandGroup} disabled={!isReady} className={error ? "has-error" : ""} aria-invalid={error} aria-describedby={error ? "strand-error" : undefined}>
              <Localized as="legend">Choose your strand <Localized as="span" className="basecamp-required" aria-hidden="true">*</Localized><Localized as="span" className="sr-only"> (required)</Localized></Localized>
              <Localized as="div" className="basecamp-strands">{STRANDS.map((strand) => <label key={strand} className="basecamp-choice"><input className="sr-only" type="radio" name="strand" required value={strand} checked={session.strand === strand} aria-describedby={error ? "strand-error" : undefined} onChange={() => chooseStrand(strand)} /><Localized as="span" className="basecamp-choice-face">{strand}<SelectionStamp /></Localized></label>)}</Localized>
              {error && <Localized as="p" id="strand-error" className="basecamp-error" role="alert">Please choose a strand to continue.</Localized>}
            </Localized>
            <fieldset disabled={!isReady}>
              <Localized as="legend">Current year level <Localized as="span" className="basecamp-optional">Optional</Localized></Localized>
              <Localized as="div" className="basecamp-years">{YEAR_LEVELS.map((yearLevel) => <label key={yearLevel} className="basecamp-choice"><input className="sr-only" type="checkbox" name="yearLevel" value={yearLevel} checked={session.yearLevel === yearLevel} onChange={() => updateSession({ yearLevel: session.yearLevel === yearLevel ? "" : yearLevel })} /><Localized as="span" className="basecamp-choice-face">{yearLevel}<SelectionStamp /></Localized></label>)}</Localized>
              <Localized as="p" className="basecamp-helper">This is for personalization only. It does not affect your recommendations.</Localized>
            </fieldset>
            <div className="basecamp-actions"><Button type="submit" disabled={!isReady} className="story-button basecamp-cta" label="CONTINUE →" /></div>
          </form> : <Localized as="div" className="basecamp-avatars-step">
            <Localized as="fieldset" className="basecamp-avatars"><Localized as="legend" className="sr-only">Choose your explorer (optional)</Localized>{EXPLORERS.map(([id, name, description], index) => <label key={id} className={`basecamp-avatar ${id === "random" ? "basecamp-skip" : ""}`}><input className="sr-only" type="radio" name="avatar" value={id} checked={session.avatarId === id} onChange={() => updateSession({ avatarId: id })} /><span className="basecamp-avatar-face"><span className="basecamp-portrait-frame"><span aria-hidden="true" className={`basecamp-portrait ${id === "random" ? "basecamp-silhouette" : ""}`} style={id === "navigator" ? { backgroundImage: "url(/characters/career-compass/navigator-framed.svg)", backgroundSize: "100% auto", backgroundPosition: "center top" } : { "--portrait-position": `${Math.min(index, 5) * 20}%` }} /></span><Localized as="strong">{name}</Localized><Localized as="span" className="basecamp-flavor">{description}</Localized><SelectionStamp /></span></label>)}</Localized>
            {/* TODO: mount persistent Explorer status chip on next screen (The Atlas) */}
            <div className="basecamp-actions"><Button className="story-button basecamp-cta" label="ENTER MY MAP →" disabled={!isReady} onClick={() => { if (!isReady) return; if (!STRANDS.includes(session.strand)) { setError(true); changeStep(1); return; } const autoAssigned = !session.avatarId || ["random", "skip"].includes(session.avatarId); if (autoAssigned) updateSession({ avatarId: EXPLORERS[Math.floor(Math.random() * 6)][0] }); window.dispatchEvent(new CustomEvent("explorer-created", { detail: { autoAssigned } })); }} /></div>
          </Localized>}
        </Localized>
      </Card>
      <dialog ref={leaveDialog} className="basecamp-leave popup-card" aria-labelledby="leave-title" aria-describedby="leave-description" onCancel={(event) => { event.preventDefault(); setLeaving(false); }} onClose={() => setLeaving(false)}>
        <Localized as="button" className="popup-close" aria-label="Close dialog" onClick={() => setLeaving(false)}>×</Localized><Localized as="h2" id="leave-title">Leave your journey?</Localized><Localized as="p" id="leave-description">Your progress stays in this tab. You can continue from Home anytime before closing it.</Localized>
        <div><Button autoFocus className="story-button" label="Stay" onClick={() => setLeaving(false)} /><Localized as="button" className="basecamp-back" type="button" onClick={() => { router.push("/"); }}>Leave</Localized></div>
      </dialog>
    </Localized>
  );
}






