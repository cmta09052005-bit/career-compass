"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button";
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
  ["skip", "Skip — surprise me later", "You can always come back to this."],
];

function SelectionStamp() {
  return <Badge variant="icon" size="small" state="unlocked" className="basecamp-stamp" aria-hidden="true" icon={<><span className="basecamp-stamp-rose">✧</span><span className="basecamp-stamp-check">✓</span></>} />;
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
  return <div ref={dust} className="basecamp-dust" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index} style={{ left: `${6 + index * 6.6}%`, top: `${12 + (index * 23) % 78}%`, animationDelay: `${index * -2.7}s`, animationDuration: `${16 + index % 4 * 3}s` }} />)}</div>;
}

export default function IntakePage() {
  const router = useRouter();
  const { session, isReady, updateSession, resetSession } = useSessionAnswers();
  const [step, setStep] = useState(1);
  const [sessionEnded, setSessionEnded] = useState(false);
  useEffect(() => { queueMicrotask(() => setSessionEnded(new URLSearchParams(window.location.search).get("session") === "ended")); }, []);
  const [error, setError] = useState(false);
  const [leaving, setLeaving] = useState(false);
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
    if (!session.strand) {
      setError(true);
      strandGroup.current.querySelector("input")?.focus();
      errorTween.current?.kill();
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        errorTween.current = gsap.fromTo(".basecamp-strands .basecamp-choice-face", { borderColor: "#FF7F3F" }, { borderColor: "rgba(212,160,23,.3)", duration: .24, repeat: 3, yoyo: true, clearProps: "borderColor" });
      }
      return;
    }
    transitioning.current = true;
    gsap.to(inner.current, { opacity: 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .28, onComplete: () => { setStep(2); } });
  })();
  const chooseStrand = (strand) => {
    errorTween.current?.revert();
    setError(false);
    updateSession({ strand });
  };

  const changeStep = (next) => contextSafe(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    gsap.to(inner.current, { opacity: 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .28, onComplete: () => setStep(next) });
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
    <main ref={root} className={`basecamp basecamp-step-${step}`} aria-label="Explorer profile">
      <div className="basecamp-watermark" aria-hidden="true" />
      <CampDust />
      <div className="basecamp-mist" aria-hidden="true"><i /><i /></div>
      <div className="basecamp-appbar"><span className="basecamp-wordmark"><Image src="/landing-compass.png" width={24} height={28} alt="" />CAREER COMPASS</span></div>
      <Card className="basecamp-shell" aria-labelledby="basecamp-title">
        <button type="button" className="basecamp-back basecamp-card-back" onClick={back}>← Back</button>
        <div ref={inner} className="basecamp-inner">
          <header className="basecamp-heading">
            <Image src="/landing-compass.png" width={52} height={60} alt="" className="basecamp-compass" priority /><span className="basecamp-compass-sparks" aria-hidden="true"><i /><i /><i /><i /></span>
            {sessionEnded && <p className="basecamp-subtext" role="status">Your session ended. Let’s start again.</p>}
            <p className="basecamp-eyebrow">BASECAMP · EXPLORER PROFILE</p>
            <div className="basecamp-steps" aria-label={`Step ${step} of 2`}><span aria-hidden="true" className="filled" /><i aria-hidden="true" /><span aria-hidden="true" className={step === 2 ? "filled" : ""} /><p>Step {step} of 2</p></div>
            <h1 id="basecamp-title" ref={heading} tabIndex={-1}>{step === 1 ? "Who Are You, Explorer?" : session.nickname.trim() ? `Choose Your Explorer, ${session.nickname.trim()}` : "Choose Your Explorer"}</h1>
            <p className="basecamp-subtext">{step === 1 ? "Tell us a little about yourself so we can personalize your journey." : "Pick who you'll be for this journey. It's just for fun, your answers are what really matter."}</p>
            {step === 1 && <p className="basecamp-privacy">No account needed. Nothing you enter here is saved once your session ends.</p>}
            {step === 2 && <div className="basecamp-recap"><span><i className="recap-person" aria-hidden="true" />{session.nickname.trim() || "Explorer"}</span><b aria-hidden="true">•</b><span>{session.strand}</span>{session.yearLevel && <><b aria-hidden="true">•</b><span>{session.yearLevel}</span></>}<button type="button" onClick={() => changeStep(1)}>Edit</button></div>}
          </header>
          {step === 1 ? <form onSubmit={advance} noValidate className="basecamp-form">
            <div>
              <label htmlFor="nickname">Your nickname or first name <span className="basecamp-optional">Optional</span></label>
              <input id="nickname" type="text" name="nickname" autoComplete="given-name" maxLength={50} placeholder="What should we call you?" value={session.nickname} disabled={!isReady} onChange={(event) => updateSession({ nickname: event.target.value })} />
            </div>
            <fieldset ref={strandGroup} disabled={!isReady} className={error ? "has-error" : ""} aria-describedby={error ? "strand-error" : undefined}>
              <legend>Choose your strand <span className="basecamp-required" aria-hidden="true">*</span><span className="sr-only"> (required)</span></legend>
              <div className="basecamp-strands">{STRANDS.map((strand) => <label key={strand} className="basecamp-choice"><input className="sr-only" type="radio" name="strand" required value={strand} checked={session.strand === strand} aria-describedby={error ? "strand-error" : undefined} onChange={() => chooseStrand(strand)} /><span className="basecamp-choice-face">{strand}<SelectionStamp /></span></label>)}</div>
              {error && <p id="strand-error" className="basecamp-error" role="alert">Please choose a strand to continue.</p>}
            </fieldset>
            <fieldset disabled={!isReady}>
              <legend>Current year level <span className="basecamp-optional">Optional</span></legend>
              <div className="basecamp-years">{YEAR_LEVELS.map((yearLevel) => <label key={yearLevel} className="basecamp-choice"><input className="sr-only" type="radio" name="yearLevel" value={yearLevel} checked={session.yearLevel === yearLevel} onChange={() => updateSession({ yearLevel })} /><span className="basecamp-choice-face">{yearLevel}<SelectionStamp /></span></label>)}</div>
              <p className="basecamp-helper">This is for personalization only. It does not affect your recommendations.</p>
            </fieldset>
            <div className="basecamp-actions"><Button type="submit" disabled={!isReady} className="story-button basecamp-cta" label="CONTINUE →" /></div>
          </form> : <div className="basecamp-avatars-step">
            <fieldset className="basecamp-avatars"><legend className="sr-only">Choose your explorer (optional)</legend>{EXPLORERS.map(([id, name, description], index) => <label key={id} className={`basecamp-avatar ${id === "skip" ? "basecamp-skip" : ""}`}><input className="sr-only" type="radio" name="avatar" value={id} checked={session.avatarId === id} onChange={() => updateSession({ avatarId: id })} /><span className="basecamp-avatar-face"><span className="basecamp-portrait-frame"><span aria-hidden="true" className={`basecamp-portrait ${id === "skip" ? "basecamp-silhouette" : ""}`} style={{ "--portrait-position": `${Math.min(index, 5) * 20}%` }} /></span><strong>{name}</strong><span className="basecamp-flavor">{description}</span><SelectionStamp /></span></label>)}</fieldset>
            {/* TODO: mount persistent Explorer status chip on next screen (The Atlas) */}
            <div className="basecamp-actions"><Button className="story-button basecamp-cta" label="ENTER MY MAP →" data-explorer-complete="true" /></div>
          </div>}
        </div>
      </Card>
      <dialog ref={leaveDialog} className="basecamp-leave" aria-labelledby="leave-title" aria-describedby="leave-description" onCancel={() => setLeaving(false)} onClose={() => setLeaving(false)}>
        <h2 id="leave-title">Leave your journey?</h2><p id="leave-description">Your answers here aren&apos;t saved once you go back.</p>
        <div><Button autoFocus className="story-button" label="Stay" onClick={() => setLeaving(false)} /><button className="basecamp-back" type="button" onClick={() => { resetSession(); router.push("/"); }}>Leave</button></div>
      </dialog>
    </main>
  );
}






