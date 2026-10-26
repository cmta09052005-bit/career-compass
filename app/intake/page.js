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
import { isBasecampComplete, resolveRoute, ROUTE_LABELS } from "@/lib/routeResolution";
import "./basecamp.css";

gsap.registerPlugin(useGSAP);

const GRADE_LEVELS = [11, 12];
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
  const gradeGroup = useRef(null);
  const transitioning = useRef(false);
  const routeState = resolveRoute({ ...session, chosenRoute: session.route });
  const { contextSafe } = useGSAP(() => {
    if (!(step === 1 && document.querySelector(".journey-portal[open]"))) gsap.fromTo(inner.current, { opacity: 0 }, { opacity: 1, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .28, onComplete: () => { transitioning.current = false; } });
    inner.current.scrollTop = 0;
    heading.current?.focus({ preventScroll: true });
  }, { scope: root, dependencies: [step], revertOnUpdate: true });

  const advance = (event) => contextSafe(() => {
    event.preventDefault();
    if (!isReady || transitioning.current) return;
    transitioning.current = true;
    gsap.to(inner.current, { opacity: 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .28, onComplete: () => { window.history.pushState(null, "", "/intake?step=2"); setStep(2); } });
  })();
  const chooseGrade = (grade) => {
    setError(false);
    const gradeLevel = session.gradeLevel === grade ? null : grade;
    updateSession({ gradeLevel, yearLevel: gradeLevel ? `Grade ${gradeLevel}` : "" });
  };

  function enterMap(event) {
    event.preventDefault();
    if (!isReady || transitioning.current) return;
    if (!isBasecampComplete(session)) {
      setError(true);
      if (!session.gradeLevel) gradeGroup.current?.querySelector("input")?.focus();
      else document.querySelector('.basecamp-routes input')?.focus();
      return;
    }
    const autoAssigned = !session.avatarId || ["random", "skip"].includes(session.avatarId);
    if (autoAssigned) updateSession({ avatarId: EXPLORERS[Math.floor(Math.random() * 6)][0] });
    window.dispatchEvent(new CustomEvent("explorer-created", { detail: { autoAssigned } }));
  }

  const changeStep = (next) => contextSafe(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    gsap.to(inner.current, { opacity: 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .28, onComplete: () => { window.history.pushState(null, "", next === 2 ? "/intake?step=2" : "/intake"); setStep(next); } });
  })();
  const back = () => {
    if (step === 2) changeStep(1);
    else if (session.nickname || session.gradeLevel || session.pilotSchoolId || session.route || session.avatarId) setLeaving(true);
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
      <div className="basecamp-appbar"><Localized as="span" className="basecamp-wordmark"><Localized as={Image} src="/brand/compass-v2-transparent-96.png" width={24} height={28} alt="" />CAREER COMPASS</Localized></div>
      <Card className="basecamp-shell" aria-labelledby="basecamp-title">
        <Localized as="button" type="button" className="basecamp-back basecamp-card-back" onClick={back}>← Back</Localized>
        <Localized as="div" ref={inner} className="basecamp-inner">
          <Localized as="header" className="basecamp-heading">
            <Localized as={Image} src="/brand/compass-v2-transparent-192.png" width={52} height={60} alt="" className="basecamp-compass" priority /><span className="basecamp-compass-sparks" aria-hidden="true"><i /><i /><i /><i /></span>
            {sessionEnded && <Localized as="p" className="basecamp-subtext" role="status">No saved journey was found. Let’s start again.</Localized>}
            <Localized as="p" className="basecamp-eyebrow">BASECAMP · EXPLORER PROFILE</Localized>
            <Localized as="div" className="basecamp-steps" aria-label={`Step ${step} of 2`}><span aria-hidden="true" className="filled" /><i aria-hidden="true" /><span aria-hidden="true" className={step === 2 ? "filled" : ""} /><Localized as="p">Step {step} of 2</Localized></Localized>
            <Localized as="h1" id="basecamp-title" ref={heading} tabIndex={-1}>{step === 1 ? "Choose Your Explorer" : "Choose your curriculum"}</Localized>
            <Localized as="p" className="basecamp-subtext">{step === 1 ? "Add a name and choose an explorer. Both are optional." : "Start with your grade level."}</Localized>
            {step === 1 && <Localized as="p" className="basecamp-privacy">No account needed. Progress is saved in this browser on this device. Restart your journey or clear this site&apos;s browser data to erase it.</Localized>}
            {step === 2 && <Localized as="div" className="basecamp-recap"><Localized as="span" translate={session.nickname.trim() ? "no" : undefined}><i className="recap-person" aria-hidden="true" />{session.nickname.trim() || "Explorer"}</Localized>{session.avatarId && <Localized as="span">{EXPLORERS.find(([id]) => id === session.avatarId)?.[1] || "Explorer"}</Localized>}{session.gradeLevel && <Localized as="span">Grade {session.gradeLevel}</Localized>}{session.route && <Localized as="span">{ROUTE_LABELS[session.route]}</Localized>}<Localized as="button" type="button" onClick={() => changeStep(1)}>Edit</Localized></Localized>}
          </Localized>
          {step === 1 ? <form onSubmit={advance} noValidate className="basecamp-form">
            <div>
              <Localized as="label" htmlFor="nickname">Your name or nickname <Localized as="span" className="basecamp-optional">Optional</Localized></Localized>
              <Localized as="input" id="nickname" type="text" name="nickname" autoComplete="given-name" maxLength={50} placeholder="What should we call you?" value={session.nickname} disabled={!isReady} onChange={(event) => updateSession({ nickname: event.target.value })} />
            </div>
            <Localized as="fieldset" className="basecamp-avatars" aria-describedby="explorer-results-note" disabled={!isReady}><Localized as="legend">Choose your explorer <Localized as="span" className="basecamp-optional">Optional</Localized></Localized><Localized as="p" id="explorer-results-note" className="basecamp-helper basecamp-explorer-note">Your name and explorer do not affect your assessment results.</Localized>{EXPLORERS.map(([id, name, description], index) => <label key={id} className={`basecamp-avatar ${id === "random" ? "basecamp-skip" : ""}`}><input className="sr-only" type="checkbox" name="avatar" value={id} checked={session.avatarId === id} onChange={() => updateSession({ avatarId: session.avatarId === id ? null : id })} /><span className="basecamp-avatar-face"><span className="basecamp-portrait-frame"><span aria-hidden="true" className={`basecamp-portrait ${id === "random" ? "basecamp-silhouette" : ""}`} style={id === "navigator" ? { backgroundImage: "url(/characters/career-compass/navigator-framed.svg)", backgroundSize: "100% auto", backgroundPosition: "center top" } : { "--portrait-position": `${Math.min(index, 5) * 20}%` }} /></span><Localized as="strong">{name}</Localized><Localized as="span" className="basecamp-flavor">{description}</Localized><SelectionStamp /></span></label>)}</Localized>            <div className="basecamp-actions"><Button type="submit" disabled={!isReady} className="story-button basecamp-cta" label="Continue" /></div>
          </form> : <form onSubmit={enterMap} noValidate className="basecamp-form basecamp-curriculum">
            <fieldset ref={gradeGroup} disabled={!isReady}>
              <Localized as="legend">Grade level <Localized as="span" className="basecamp-required">(required)</Localized></Localized>
              <div className="basecamp-years">{GRADE_LEVELS.map(grade => <label key={grade} className="basecamp-choice"><input className="sr-only" type="checkbox" name="gradeLevel" value={grade} checked={session.gradeLevel === grade} onChange={() => chooseGrade(grade)} aria-describedby={error ? "basecamp-error" : undefined} /><Localized as="span" className="basecamp-choice-face">Grade {grade}<SelectionStamp /></Localized></label>)}</div>
            </fieldset>
            {routeState.needsRouteChoice && <fieldset disabled={!isReady}><Localized as="legend">Curriculum</Localized><div className="basecamp-years basecamp-routes">{["old", "new"].map(route => <label key={route} className="basecamp-choice"><input className="sr-only" type="checkbox" name="route" value={route} checked={session.route === route} aria-describedby={error ? "basecamp-error" : undefined} onChange={() => { setError(false); updateSession({ route: session.route === route ? null : route }); }} /><Localized as="span" className="basecamp-choice-face">{ROUTE_LABELS[route]}<SelectionStamp /></Localized></label>)}</div></fieldset>}
            {routeState.locked && <Localized as="p" className="basecamp-route-note" role="status">{`Grade 11 uses ${ROUTE_LABELS.new}.`}</Localized>}
            {error && <Localized as="p" id="basecamp-error" className="basecamp-error" role="alert">{!session.gradeLevel ? "Choose your grade level." : "Choose your curriculum."}</Localized>}
            <div className="basecamp-actions"><Button type="submit" className="story-button basecamp-cta" label="Enter my map" disabled={!isReady} /></div>
          </form>}
        </Localized>
      </Card>
      <dialog ref={leaveDialog} className="basecamp-leave popup-card" aria-labelledby="leave-title" aria-describedby="leave-description" onCancel={(event) => { event.preventDefault(); setLeaving(false); }} onClose={() => setLeaving(false)}>
        <Localized as="button" className="popup-close" aria-label="Close dialog" onClick={() => setLeaving(false)}>×</Localized><Localized as="h2" id="leave-title">Leave Basecamp?</Localized><Localized as="p" id="leave-description">Your choices are saved on this device.</Localized>
        <div><Button autoFocus className="story-button" label="Stay" onClick={() => setLeaving(false)} /><Localized as="button" className="basecamp-back" type="button" onClick={() => { router.push("/"); }}>Leave</Localized></div>
      </dialog>
    </Localized>
  );
}






