"use client";

import { browserStorage, subscribeToStorage } from "@/lib/browserStorage";


import Localized from "@/components/Localized";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import CelebrationDialog from "@/components/CelebrationDialog";
import Card from "@/components/Card";
import { OfflineButton } from "@/components/OfflineMode";
import AtlasTutorial from "@/components/AtlasTutorial";
import { playSound, soundEnabled, setSoundEnabled } from "@/lib/sound";
import usePopupState from "@/components/usePopupState";
import Toggle from "@/components/Toggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { SECTION_STATUS, SESSION_STORAGE_KEY, useSessionAnswers } from "@/lib/useSessionAnswers";
import { isValidStrand } from "@/lib/assessmentValidation";
import "./atlas.css";

const GUIDE_KEY = "careerCompassJourneyGuideSeen";
const TOUR_KEY = "careerCompassAtlasTourSeen";
const FIRST_WALK_KEY = "careerCompassAtlasFirstWalk";
const UNLOCK_KEY = "careerCompassAtlasUnlockSeen";
const EXPEDITION_KEY = "careerCompassExpeditionSeen";
const BASECAMP = { id: "basecamp", left: 8, top: 52 };
const ISLANDS = { id: "islands", left: 88, top: 63, name: "The Islands" };
const FOG_ZONES = [
  { id: "interests", left: 15, top: 3, width: 29, height: 59 },
  { id: "skills", left: 40, top: 12, width: 22, height: 68 },
  { id: "academic", left: 56, top: 4, width: 23, height: 78 },
  { id: "islands", left: 76, top: 8, width: 24, height: 83 },
];
const ROAD = "M80 520 C85 465 105 425 135 420 C148 417 157.2 421 164.24 429.32 C167.63442594 433.33159429 171.77961177 434.04307338 175.20816623 438.17606603 C178.63672069 442.30905868 181.59742415 448.82985183 184.81132677 454.11795589 C188.02522939 459.40605996 191.61520684 464.03587847 194.49158195 469.90469042 C197.36795707 475.77350236 200.23774248 482.09673357 202.06957746 489.33082757 C203.90141245 496.56492156 203.97158897 505.6420434 205.48259185 513.3092544 C206.99359474 520.9764654 208.84797342 528.53827597 211.13559478 535.33409357 C213.42321614 542.12991117 215.41408893 550.85275605 219.20832 554.08416 C223.88885322 558.07039418 227.63084794 565.30138947 232.62894162 568.61771815 C237.6270353 571.93404683 243.71279062 574.20864548 249.19688209 573.9821321 C254.68097355 573.75561872 260.0920176 568.67991362 265.53349042 567.25863788 C270.97496324 565.83736214 276.78046119 568.79112371 281.84571901 565.45447766 C286.91097683 562.11783162 292.0641638 554.87792761 295.92503734 547.23876162 C299.78591088 539.59959563 302.24258807 529.20015932 305.01096026 519.6194817 C307.77933245 510.03880409 310.05893734 499.74699501 312.5352705 489.75469595 C315.01160366 479.76239689 317.15963373 469.39838225 319.86895922 459.66568733 C322.57828471 449.93299241 324.99862227 439.20356883 328.79122344 431.35852642 C332.5838246 423.51348402 337.63457726 417.26876426 342.62456619 412.59543292 C347.61455513 407.92210159 353.2903571 405.29357873 358.73115706 403.31853842 C364.17195702 401.34349811 369.8290206 399.61004042 375.26936595 400.74519107 C380.70971131 401.88034172 386.23834374 405.88070506 391.37322919 410.1294423 C396.50811465 414.37817955 401.39324011 420.20856575 406.07867868 426.23761454 C410.76411725 432.26666334 416.00900421 437.97557722 419.48586062 446.3037351 C422.96271702 454.63189297 425.36356352 465.71554735 426.93981711 476.20656179 C428.51607071 486.69757623 428.32405628 498.1822812 428.9433822 509.24982175 C429.56270812 520.31736229 429.89694672 531.5570953 430.65577263 542.61180503 C431.41459855 553.66651476 431.67219464 565.18197281 433.49633767 575.57808013 C435.3204807 585.97418746 438.68848765 595.45113003 441.60063081 604.98844899 C444.51277397 614.52576794 447.01353534 625.30470471 450.96919661 632.80199385 C454.92485789 640.29928299 460.35830751 645.00221662 465.33459846 649.97218382 C470.31088941 654.94215102 475.46558024 659.93236849 480.82694233 662.62179704 C486.18830441 665.31122559 491.93490408 666.02416045 497.50277096 666.10875513 C498.45968951 666.12329395 499.41742091 666.07841945 500.37568704 665.98835177 C504.99312871 665.55435723 509.6229859 664.07105348 514.23414364 663.12936508 C519.80226339 661.99224637 525.87156029 663.07982627 530.91148948 659.28604283 C535.95141866 655.49225939 540.43374174 647.83176748 544.47371874 640.36666445 C548.51369575 632.90156142 551.35082086 622.66189962 555.15135152 614.49542466 C558.95188217 606.3289497 562.78863803 597.85584042 567.27690266 591.36781471 C571.76516729 584.879789 577.60223639 581.94404617 582.08093927 575.56727039 C586.55964216 569.1904946 588.86595329 556.1291881 594.14912 553.10716 C601.658 548.812 610.1 547.3 620 550 C665 550 655 665 740 660 C800 660 800 595 855 625 L880 630";

const AVATARS = ["wanderer", "trailblazer", "scout", "cartographer", "ranger", "navigator"];
const REGIONS = [
  { id: "interests", name: "The Mountains", subject: "Interests", description: "Discover what pulls you forward.", detail: "8 scenarios", icon: "mountain-peak", badge: "Wayfinder", badgeIcon: "mountain-peak", left: 35.009543884317914, top: 40.717392281471724 },
  { id: "skills", name: "The Forest", subject: "Skills", description: "Find strength in what you can do.", detail: "10 statements", icon: "pine-branch", badge: "Skillcrafter", badgeIcon: "pine-branch", left: 50.03756870392547, top: 66.59883517680692 },
  { id: "academic", name: "The Valley", subject: "Academics", description: "What you've already built matters too.", detail: "Academic details", icon: "ribbon-scroll", badge: "Scholar", badgeIcon: "ribbon-scroll", left: 62, top: 55 },
];
const BADGE_DETAILS = {
  basecamp: { title: "Basecamp", description: "Your explorer profile is complete and your journey has begun." },
  interests: { title: "Wayfinder", description: "You mapped the interests that pull you forward." },
  skills: { title: "Skillcrafter", description: "You uncovered the strengths you can build on." },
  academic: { title: "Scholar", description: "You recorded the academic foundation beneath your path." },
  islands: { title: "Full Expedition", description: "You completed all three assessments and reached The Islands." },
};

function regionState(index, progress) {
  if (progress[REGIONS[index].id] === SECTION_STATUS.COMPLETED) return "completed";
  return REGIONS.slice(0, index).every(({ id }) => progress[id] === SECTION_STATUS.COMPLETED) ? "active" : "locked";
}

function Icon({ name, className = "" }) {
  if (name === "lock") return <svg className={`atlas-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 10V7a5 5 0 0 1 10 0v3" /><rect x="4" y="10" width="16" height="12" rx="2" fill="#1b2a4a" /><path d="M12 14v4" /></svg>;
  // Local illustrations retain their original proportions.
  return <Localized as="img" className={`atlas-icon ${className}`} src={name === "compass" ? "/landing-compass.png" : `/icons/career-compass/${name}.svg`} alt="" draggable="false" />;
}

function LocationCard({ name }) {
  return <div className="atlas-location-card"><Localized as="h2">{name}</Localized></div>;
}

function StopMark({ locked = false, opening = false, pending = false }) {
  if (locked) return <span className={`atlas-stop-mark ${opening ? "is-opening" : ""} ${pending ? "arrival-lock" : ""}`} role="img" aria-label="Locked"><svg className="atlas-icon" viewBox="0 0 100 100" fill="none" aria-hidden="true"><g className="atlas-lock-shackle"><path d="M28 44V31a22 22 0 0 1 44 0v13" stroke="#1B2A4A" strokeWidth="14" /><path d="M28 44V31a22 22 0 0 1 44 0v13" stroke="#D4A017" strokeWidth="7" /></g><rect x="15" y="40" width="70" height="51" rx="9" fill="#1B2A4A" stroke="#D4A017" strokeWidth="4" /><rect x="22" y="47" width="56" height="37" rx="5" stroke="#D4A017" /><circle cx="50" cy="61" r="6" fill="#D4A017" /><path d="M50 65v10" stroke="#D4A017" strokeWidth="5" strokeLinecap="round" /><path className="atlas-lock-shine" d="M79 12v20M69 22h20" stroke="#D4A017" strokeWidth="4" /></svg></span>;
  return <span className="atlas-stop-mark" role="img" aria-label={locked ? "Locked" : "Completed"}><Icon name={locked ? "stop-padlock" : "stop-check"} /></span>;
}

function Explorer({ avatarId, className = "" }) {
  const index = Math.max(0, AVATARS.indexOf(avatarId));
  return <Localized as="span" aria-hidden="true" className={`atlas-explorer ${className}`} style={avatarId === "navigator" ? { backgroundImage: "url(/characters/career-compass/navigator-framed.svg)", backgroundSize: "100% auto", backgroundPosition: "center 25%" } : index >= 0 ? { backgroundImage: "url('/explorers.png')", backgroundPosition: `${index * 20}% 25%` } : undefined}>{index < 0 && <Icon name="compass" />}</Localized>;
}

function PinFrame() {
  return <svg className="atlas-pin-silhouette" viewBox="-1 -1 66 80" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false"><path d="M14 1.5H50Q62.5 1.5 62.5 14V50Q62.5 62.5 50 62.5H46L32 76.5 18 62.5H14Q1.5 62.5 1.5 50V14Q1.5 1.5 14 1.5Z" fill="#1B2A4A" stroke="#F5ECD7" strokeWidth="5" strokeLinejoin="round" /><path d="M14 1.5H50Q62.5 1.5 62.5 14V50Q62.5 62.5 50 62.5H46L32 76.5 18 62.5H14Q1.5 62.5 1.5 50V14Q1.5 1.5 14 1.5Z" stroke="#1B2A4A" strokeWidth="3" strokeLinejoin="round" /><path d="M14 4.5H50Q59.5 4.5 59.5 14V50Q59.5 59.5 50 59.5H44.8L32 72.3 19.2 59.5H14Q4.5 59.5 4.5 50V14Q4.5 4.5 14 4.5Z" stroke="#D4A017" strokeWidth="2" strokeLinejoin="round" /><path d="M14 6.5H50Q57.5 6.5 57.5 14V50Q57.5 57.5 50 57.5H44L32 69.5 20 57.5H14Q6.5 57.5 6.5 50V14Q6.5 6.5 14 6.5Z" stroke="#F5ECD7" strokeLinejoin="round" /></svg>;
}

export default function JourneyPage() {
  const router = useRouter();
  const { session, isReady, updateSession, resetSession } = useSessionAnswers();
  const root = useRef(null);
  const dialog = useRef(null);
  const hoverCard = useRef(null);
  const nodes = useRef({});
  const token = useRef(null);
  const trail = useRef(null);
  const mapWindow = useRef(null);
  const mapLayer = useRef(null);
  const drag = useRef(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [hintDismissed, setHintDismissed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [walking, setWalking] = useState(false);
  const [firstArrivalPending, setFirstArrivalPending] = useState(false);
  const [unlocking, setUnlocking] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [liftingFog, setLiftingFog] = useState([]);
  const [tabHidden, setTabHidden] = useState(() => typeof document !== "undefined" && document.hidden);
  const [unlockAnnouncement, setUnlockAnnouncement] = useState("");
  const [position, setPosition] = useState(null);
  const [sequenceReady, setSequenceReady] = useState(false);
  const [tour, setTour] = useState(null);
  const [tourWaiting, setTourWaiting] = useState(true);
  const [tourSeen, setTourSeen] = useState(false);
  const [replayQueued, setReplayQueued] = useState(false);
  const [skipNote, setSkipNote] = useState(false);
  const closingBadge = useRef(false);
  const initialized = useRef(false);
  const [openNode, setOpenNode] = usePopupState(null, ".atlas-popover");
  const [panel, setPanel] = usePopupState(null, ".atlas-dialog-card");
  const [sound, setSound] = useState(false);
  const [celebrate, setCelebrate] = usePopupState(false, ".atlas-expedition");
  const [badgeToast, setBadgeToast] = usePopupState([], ".atlas-badge-toast");
  const [mapSize, setMapSize] = useState({ width: 1, height: 1, viewWidth: 1, viewHeight: 1 });
  const leaving = useRef(false);
  const entering = useRef(false);
  const progress = session.journeyProgress;
  const count = REGIONS.filter(({ id }) => progress[id] === SECTION_STATUS.COMPLETED).length;
  const complete = count === 3;
  const started = REGIONS.some(({ id }) => progress[id] !== SECTION_STATUS.NOT_STARTED);
  const next = REGIONS.findIndex((_, index) => regionState(index, progress) === "active");
  const current = position || "basecamp";
  const actionReady = isReady && sequenceReady && !walking && !badgeToast.length && !tourWaiting && !tour && !(unlocking === "interests" && !started);
  const checkpoints = [
    { id: "basecamp", name: "Basecamp", icon: "explorer-backpack", mapped: isReady && isValidStrand(session.strand) },
    ...REGIONS.map(region => ({ ...region, mapped: progress[region.id] === SECTION_STATUS.COMPLETED })),
    { ...ISLANDS, icon: "island-flag", mapped: complete && current === "islands" && !walking },
  ];
  const mappedCount = checkpoints.filter(stop => stop.mapped).length;
  function checkpointStatus(stop) {
    if (stop.mapped) return SECTION_STATUS.COMPLETED;
    if (stop.id === "basecamp") return isReady ? SECTION_STATUS.IN_PROGRESS : SECTION_STATUS.NOT_STARTED;
    if (stop.id === "islands") return complete ? SECTION_STATUS.IN_PROGRESS : SECTION_STATUS.NOT_STARTED;
    return progress[stop.id] || SECTION_STATUS.NOT_STARTED;
  }
  const journeyRows = checkpoints.map((stop, index) => {
    const regionIndex = index - 1;
    const state = regionIndex >= 0 && regionIndex < REGIONS.length ? regionState(regionIndex, progress) : "locked";
    const action = stop.mapped ? "badge" : state === "active" ? "enter" : "locked";
    return { ...stop, regionIndex, status: checkpointStatus(stop), action };
  });

  useEffect(() => {
    if (!isReady) return;
    const recover = () => {
      if (leaving.current) return;
      let missing = !isValidStrand(session.strand);
      try { const stored = JSON.parse(browserStorage.getItem(SESSION_STORAGE_KEY)); missing = missing || !stored?.strand; } catch { missing = true; }
      if (missing) { leaving.current = true; router.replace("/intake?session=ended"); }
    };
    recover();
    window.addEventListener("focus", recover);
    window.addEventListener("pageshow", recover);
    return () => { window.removeEventListener("focus", recover); window.removeEventListener("pageshow", recover); };
  }, [isReady, session.strand, router]);

  /* eslint-disable react-hooks/set-state-in-effect -- Restore locally saved map position before the badge's first paint. */
  useLayoutEffect(() => {
    if (!isReady || !isValidStrand(session.strand) || initialized.current) return;
    initialized.current = true;
    let firstWalk = browserStorage.getItem(FIRST_WALK_KEY);
    const seenTour = browserStorage.getItem(TOUR_KEY) === "true";
    const pastIntroduction = started || firstWalk === "done" || firstWalk === "pending";
    if (pastIntroduction) browserStorage.setItem(TOUR_KEY, "true");
    setTourSeen(seenTour || pastIntroduction);
    setTourWaiting(!seenTour && !pastIntroduction);
    if (seenTour && !started && firstWalk !== "done" && firstWalk !== "pending") {
      browserStorage.setItem(FIRST_WALK_KEY, "pending");
      firstWalk = "pending";
    }
    // Establish the completed node and camera before the badge can be painted.
    setSequenceReady(false);
    let seen = [];
    try { seen = JSON.parse(browserStorage.getItem("careerCompassBadgeNotices")) || []; } catch { /* Optional storage. */ }
    if (!Array.isArray(seen)) seen = [];
    const earned = REGIONS.filter(({ id }) => progress[id] === SECTION_STATUS.COMPLETED && !seen.includes(id));
    if (earned.length) {
      setPosition(earned[0].id);
      setBadgeToast(earned);
    } else {
      if (started) firstWalk = null;
      setFirstArrivalPending(!started && firstWalk !== "done");
      const destination = complete ? "islands" : !started ? firstWalk === "done" ? "interests" : "basecamp" : REGIONS[next]?.id;
      let previous;
      try { previous = Number(browserStorage.getItem("careerCompassAtlasPosition")); } catch { /* Optional storage. */ }
      const from = firstWalk === "pending" ? BASECAMP : REGIONS.find((region) => region.left === previous || (region.id === "interests" && [36, 34.91901780963409].includes(previous)) || (region.id === "skills" && previous === 50));
      const to = complete ? ISLANDS : REGIONS[next];
      if (from && to && from.left < to.left) {
        setPosition(from.id);
        setWalking({ from, to, first: firstWalk === "pending", hold: firstWalk === "pending" });
      } else {
        setPosition(destination);
        setSequenceReady(true);
      }
    }
  }, [isReady, progress, session.strand, setBadgeToast, complete, next, started]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function closeBadge() {
    if (closingBadge.current || !badgeToast.length) return;
    closingBadge.current = true;
    const region = badgeToast[0];
    setBadgeToast([], () => {
      try {
        let seen = JSON.parse(browserStorage.getItem("careerCompassBadgeNotices")) || [];
        if (!Array.isArray(seen)) seen = [];
        browserStorage.setItem("careerCompassBadgeNotices", JSON.stringify([...new Set([...seen, region.id])]));
      } catch { /* Optional storage. */ }
      closingBadge.current = false;
      if (badgeToast.length > 1) {
        setPosition(badgeToast[1].id);
        setBadgeToast(badgeToast.slice(1));
        return;
      }
      const destination = REGIONS[REGIONS.indexOf(region) + 1] || ISLANDS;
      setWalking({ from: region, to: destination });
    });
  }

  const tokenTop = current === "islands" ? ISLANDS.top : current === "basecamp" ? BASECAMP.top : REGIONS.find(({ id }) => id === current)?.top || REGIONS[0].top;
  const tokenLeft = current === "islands" ? ISLANDS.left : current === "basecamp" ? BASECAMP.left : REGIONS.find(({ id }) => id === current)?.left || REGIONS[0].left;
  const tokenOffset = 0;
  const actionLabel = complete ? "Results" : started ? "Continue" : "Start";
  const walkingLabel = walking ? walking.hold ? "Start" : `Walking to ${walking.to.name}…` : actionLabel;
  const tokenHint = complete ? "This is you. Press Results to see your paths." : started ? "This is you. Press Continue to keep going." : "This is you. Press Start to begin.";

  useLayoutEffect(() => {
    if (!walking || badgeToast.length || !token.current || !mapLayer.current) return;
    if (walking.hold) {
      const timer = setTimeout(() => setWalking(previous => previous && { ...previous, hold: false }), 1000);
      return () => clearTimeout(timer);
    }
    const { from, to } = walking;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const width = mapLayer.current.offsetWidth;
    const height = mapLayer.current.offsetHeight;
    const path = trail.current;
    const length = path.getTotalLength();
    const distanceAt = (node) => {
      let nearest = 0, best = Infinity;
      for (let step = 0; step <= 1000; step++) {
        const distance = length * step / 1000, point = path.getPointAtLength(distance);
        const error = (point.x - node.left * 10) ** 2 + (point.y - node.top * 10) ** 2;
        if (error < best) { best = error; nearest = distance; }
      }
      return nearest;
    };
    const start = distanceAt(from), end = distanceAt(to);
    const first = path.getPointAtLength(start), last = path.getPointAtLength(end);
    const framesFor = (worldWidth, worldHeight) => Array.from({ length: 61 }, (_, index) => {
      const t = index / 60;
      const point = path.getPointAtLength(start + (end - start) * t);
      // Match the exact node centers at both ends so neither handoff can jump.
      const x = point.x + (from.left * 10 - first.x) * (1 - t) + (to.left * 10 - last.x) * t;
      const y = point.y + (from.top * 10 - first.y) * (1 - t) + (to.top * 10 - last.y) * t;
      return { transform: `translate(calc(-50% + ${(x / 1000 - from.left / 100) * worldWidth}px), calc(-50% + ${(y / 1000 - from.top / 100) * worldHeight}px))` };
    });
    let cancelled = false;
    const animation = token.current.animate(reduced ? [{ opacity: .6 }, { opacity: 1 }] : framesFor(width, height), { duration: reduced ? 200 : 2400, easing: "ease-in-out", fill: "forwards" });
    // Refresh geometry without restarting the walk when the window changes size.
    const observer = new ResizeObserver(() => {
      if (!reduced && mapLayer.current) animation.effect.setKeyframes(framesFor(mapLayer.current.offsetWidth, mapLayer.current.offsetHeight));
    });
    if (!reduced) observer.observe(mapLayer.current);
    animation.finished.then(() => {
      if (cancelled) return;
      try { browserStorage.setItem("careerCompassAtlasPosition", String(to.left)); } catch { /* Optional storage. */ }
      if (walking.first) browserStorage.setItem(FIRST_WALK_KEY, "done");
      setPosition(to.id);
      setWalking(false);
      setSequenceReady(true);
      let seen = [];
      try { seen = JSON.parse(browserStorage.getItem(UNLOCK_KEY)) || []; } catch { /* Optional storage. */ }
      const unlock = !walking.enter && (!Array.isArray(seen) || !seen.includes(to.id));
      if (unlock) {
        browserStorage.setItem(UNLOCK_KEY, JSON.stringify([...new Set([...(Array.isArray(seen) ? seen : []), to.id])]));
        setSequenceReady(false);
        setArrival(to.id);
      }
      if (walking.enter) {
        updateSession({ journeyProgress: { [to.id]: SECTION_STATUS.IN_PROGRESS } });
        router.push(`/journey/${to.id}`);
      } else if (!unlock && !walking.first && to !== ISLANDS) setPanel("next");
    }).catch(() => {});
    return () => { cancelled = true; observer.disconnect(); animation.cancel(); };
  }, [walking, badgeToast.length, setPanel, updateSession, router]);

  useEffect(() => {
    if (!arrival) return;
    const timer = setTimeout(() => {
      setUnlocking(arrival);
      setLiftingFog(previous => [...new Set([...previous, arrival])]);
      setUnlockAnnouncement("");
      setArrival(null);
      setSequenceReady(true);
      playSound("unlock");
    }, 300);
    return () => clearTimeout(timer);
  }, [arrival]);

  useEffect(() => {
    const visibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  useEffect(() => {
    if (!unlocking) return;
    const timer = setTimeout(() => {
      setUnlocking(null);
      setUnlockAnnouncement("Unlocked");
      if (unlocking !== "interests" && unlocking !== "islands") setPanel("next");
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 900);
    return () => clearTimeout(timer);
  }, [unlocking, setPanel]);

  // Only presentation waits for arrival; assessment permissions are unchanged.
  const pendingStop = unlocking || arrival || walking?.to?.id || (badgeToast.length ? (REGIONS[REGIONS.indexOf(badgeToast[badgeToast.length - 1]) + 1] || ISLANDS).id : current === "basecamp" && firstArrivalPending ? "interests" : null);

  const centerOnNode = useCallback((requestedNode, snap = false) => {
    if (!mapWindow.current || !mapLayer.current) return;
    const node = requestedNode || (walking?.hold ? BASECAMP : walking?.to) || (current === "islands" ? ISLANDS : current === "basecamp" ? BASECAMP : REGIONS.find(({ id }) => id === current));
    if (!node) return;
    const width = mapLayer.current.offsetWidth, height = mapLayer.current.offsetHeight;
    const viewWidth = mapWindow.current.clientWidth, viewHeight = mapWindow.current.clientHeight;
    const x = Math.max(viewWidth - width, Math.min(0, viewWidth / 2 - width * node.left / 100));
    const clampY = value => Math.max(viewHeight - height, Math.min(0, value));
    const preferredY = clampY((viewHeight + 100) / 2 - height * node.top / 100);
    // Preserve the normal framing when clear. In short windows, shift only the
    // camera within its existing limits so fixed controls cannot cover stops.
    const controls = [...root.current.querySelectorAll(".atlas-nameplate, .atlas-badges, .atlas-utility, .atlas-action-disc, .atlas-round-action > span:last-child, .atlas-page > .atlas-session, .atlas-scroll-hint")]
      .filter(element => getComputedStyle(element).display !== "none" && Number(getComputedStyle(element).opacity) > .05)
      .map(element => element.getBoundingClientRect());
    const footprints = [BASECAMP, ...REGIONS, ISLANDS].flatMap(stop => {
      const button = nodes.current[stop.id];
      if (!button) return [];
      const circle = button.getBoundingClientRect();
      const plate = button.parentElement.querySelector(".atlas-location-card").getBoundingClientRect();
      const cx = width * stop.left / 100, cy = height * stop.top / 100;
      return [
        { id:stop.id, left:cx - circle.width / 2, top:cy - circle.height / 2, width:circle.width, height:circle.height },
        { id:stop.id, left:cx - plate.width / 2, top:cy + plate.top - circle.top - circle.height / 2, width:plate.width, height:plate.height },
      ];
    });
    const pin = root.current.querySelector(".atlas-pin");
    const pinBottom = Number.parseFloat(getComputedStyle(pin).bottom);
    footprints.push({ id:node.id, left:width * node.left / 100 - pin.offsetWidth / 2, top:height * node.top / 100 - pinBottom - pin.offsetHeight, width:pin.offsetWidth, height:pin.offsetHeight });
    const penalty = y => footprints.reduce((sum, box) => {
      const left = box.left + x, top = box.top + y, right = left + box.width, bottom = top + box.height;
      const clipped = box.id === node.id ? Math.max(0, 8 - top) + Math.max(0, bottom - viewHeight + 8) : 0;
      return sum + clipped * 10000 + controls.reduce((area, control) => area + Math.max(0, Math.min(right, control.right) - Math.max(left, control.left)) * Math.max(0, Math.min(bottom, control.bottom) - Math.max(top, control.top)), 0);
    }, 0);
    let y = preferredY, best = penalty(y);
    for (let distance = 8; best > 0 && distance <= 160; distance += 8) {
      for (const offset of [distance, -distance]) {
        const candidate = clampY(preferredY + offset), score = penalty(candidate);
        if (score < best) { y = candidate; best = score; }
      }
    }
    setCamera({ x, y, snap: snap || !!walking?.hold });
  }, [current, walking]);

  const tourFlyover = useCallback(() => {
    const home = tour?.replay ? undefined : BASECAMP;
    const timers = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    [REGIONS[1], REGIONS[2], ISLANDS, BASECAMP].forEach((stop, index) => {
      timers.push(setTimeout(() => centerOnNode(stop, reduced), index * 1200));
    });
    return () => { timers.forEach(clearTimeout); centerOnNode(home, true); };
  }, [centerOnNode, tour?.replay]);

  function finishTour(skipped) {
    const replay = tour?.replay;
    setTour(null);
    centerOnNode(replay ? undefined : BASECAMP, true);
    if (replay) return;
    // Write pending first so an interrupted pair of writes still recovers the walk.
    browserStorage.setItem(FIRST_WALK_KEY, "pending");
    browserStorage.setItem("careerCompassAtlasPosition", String(BASECAMP.left));
    browserStorage.setItem(TOUR_KEY, "true");
    setTourSeen(true);
    setTourWaiting(false);
    setFirstArrivalPending(true);
    setSequenceReady(false);
    setPosition("basecamp");
    setWalking({ from: BASECAMP, to: REGIONS[0], first: true, hold: true });
    if (skipped) setSkipNote(true);
  }

  function replayTour() {
    setSkipNote(false);
    setPanel(null, () => { setOpenNode(null); setReplayQueued(true); });
  }

  useEffect(() => {
    if (!replayQueued || walking || arrival || unlocking || badgeToast.length || celebrate) return;
    if (complete && current === "islands" && !browserStorage.getItem(EXPEDITION_KEY)) return;
    const timer = setTimeout(() => { setReplayQueued(false); setPanel(null, () => { centerOnNode(undefined, true); setTour({ step: 0, replay: true }); }); }, 0);
    return () => clearTimeout(timer);
  }, [replayQueued, walking, arrival, unlocking, badgeToast.length, celebrate, centerOnNode, setPanel, complete, current]);

  useEffect(() => {
    if (!skipNote) return;
    const timer = setTimeout(() => setSkipNote(false), 4000);
    return () => clearTimeout(timer);
  }, [skipNote]);

  useLayoutEffect(() => {
    const elements = [document.documentElement, document.body];
    const previous = elements.map((element) => ({ overflow: element.style.overflow, height: element.style.height }));
    elements.forEach((element) => { element.style.overflow = "hidden"; element.style.height = "100%"; });
    const resize = () => {
      if (!mapLayer.current || !mapWindow.current) return;
      setMapSize({ width: mapLayer.current.offsetWidth, height: mapLayer.current.offsetHeight, viewWidth: mapWindow.current.clientWidth, viewHeight: mapWindow.current.clientHeight });
      centerOnNode();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mapWindow.current);
    observer.observe(mapLayer.current);
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    return () => {
      elements.forEach((element, index) => Object.assign(element.style, previous[index]));
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, [centerOnNode]);

  useEffect(() => {
    if (!sequenceReady || panel || walking || tour || tourWaiting || hintDismissed) return;
    const timer = setTimeout(() => setHintDismissed(true), 4000);
    return () => clearTimeout(timer);
  }, [sequenceReady, panel, walking, tour, tourWaiting, hintDismissed]);

  function panStart(event) {
    if (!actionReady || !event.isPrimary || event.button !== 0 || event.target.closest("button, a, .atlas-popover, .atlas-pin")) return;
    setOpenNode(null);
    const matrix = new DOMMatrixReadOnly(getComputedStyle(mapLayer.current).transform);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, cameraX: matrix.m41, cameraY: matrix.m42 };
    setCamera({ x: matrix.m41, y: matrix.m42 });
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function panMove(event) {
    if (drag.current?.id !== event.pointerId) return;
    setHintDismissed(true);
    setCamera({ x: Math.max(mapWindow.current.clientWidth - mapLayer.current.offsetWidth, Math.min(0, drag.current.cameraX + event.clientX - drag.current.x)), y: Math.max(mapWindow.current.clientHeight - mapLayer.current.offsetHeight, Math.min(0, drag.current.cameraY + event.clientY - drag.current.y)) });
  }

  function panEnd(event) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  useEffect(() => {
    if (!isReady || !session.strand) return;
    let timer;
    let handled = false;
    let noticesReady = false;
    const showWelcome = () => {
      if (!sequenceReady || walking || unlocking || tour || panel || !noticesReady || handled || document.querySelector(".journey-portal, .celebration-dialog[open]")) return;
      handled = true;
      try {
        if (complete && !browserStorage.getItem(EXPEDITION_KEY)) {
          browserStorage.setItem(EXPEDITION_KEY, "true");
          setCelebrate(true);

        } else if (tourWaiting && !started) setTour({ step: 0, replay: false });
      } catch { /* Help remains accessible when local storage is unavailable. */ }
    };
    const observer = new MutationObserver(showWelcome);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
    timer = setTimeout(() => { noticesReady = true; showWelcome(); }, 400);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [isReady, complete, session.strand, setCelebrate, sequenceReady, walking, unlocking, started, tour, tourWaiting, panel]);

  useEffect(() => {
    if (panel !== null && !dialog.current?.open) dialog.current?.showModal();
    if (panel === null && dialog.current?.open) dialog.current.close();
    if (panel === "exit" || panel === "restart") dialog.current?.querySelector(".atlas-confirm-actions .game-button")?.focus();
  }, [panel]);

  useEffect(() => {
    queueMicrotask(() => setSound(soundEnabled()));
    return subscribeToStorage(key => { if (key === null || key === "careerCompassSound") setSound(browserStorage.getItem("careerCompassSound") === "on"); });
  }, []);

  function closePanel() {
    if (panel === "guide") browserStorage.setItem(GUIDE_KEY, "true");
    setPanel(null);
  }

  function enter(index) {
    if (entering.current || !actionReady || index < 0 || regionState(index, progress) !== "active") return;
    entering.current = true;
    const region = REGIONS[index];
    const from = { left: tokenLeft, top: tokenTop };
    setOpenNode(null);
    setPanel(null, () => {
      if (current === region.id) {
        updateSession({ journeyProgress: { [region.id]: SECTION_STATUS.IN_PROGRESS } });
        router.push(`/journey/${region.id}`);
        return;
      }
      setWalking({ from, to: region, enter: true });
    });
  }

  function locate() {
    centerOnNode();
  }

  function toggleSound() {
    setSoundEnabled(!sound);
    setSound(!sound);
  }

  function leave(restart) {
    leaving.current = true;
    setPanel(null, () => {
    if (restart) resetSession();
    else {
      browserStorage.removeItem(FIRST_WALK_KEY);
      browserStorage.removeItem(GUIDE_KEY);
      browserStorage.removeItem(TOUR_KEY);
      if (!started) browserStorage.removeItem(UNLOCK_KEY);
    }
    router.push(restart ? "/intake" : "/");
    });
  }

  const target = complete ? ISLANDS : REGIONS[next] || REGIONS[2];
  const targetX = camera.x + mapSize.width * target.left / 100;
  const targetY = camera.y + mapSize.height * target.top / 100 - 88;
  const offscreen = targetX < 0 || targetX > mapSize.viewWidth || targetY < 0 || targetY > mapSize.viewHeight;
  const edgeAngle = Math.atan2(targetY - mapSize.viewHeight / 2, targetX - mapSize.viewWidth / 2) * 180 / Math.PI;
  const badgeId = typeof panel === "string" && panel.startsWith("badge-") ? panel.slice(6) : null;
  const badgeStop = checkpoints.find(stop => stop.id === badgeId);
  const badgeDetail = badgeStop ? { ...BADGE_DETAILS[badgeId], ...badgeStop, status: checkpointStatus(badgeStop) } : null;

  const hoverNode = typeof openNode === "number" ? { ...REGIONS[openNode], eyebrow: `ASSESSMENT ${openNode + 1} OF 3 · ${REGIONS[openNode].subject.toUpperCase()}` } : openNode === "basecamp" ? { ...BASECAMP, name: "Basecamp", eyebrow: "YOUR STARTING POINT", description: "Explorer profile complete." } : openNode === "islands" ? { ...ISLANDS, eyebrow: "BEYOND THE THREE ASSESSMENTS", description: complete ? "Your path is ready to reveal." : "Complete The Mountains, The Forest, and The Valley to reveal your paths." } : null;
  const hoverId = hoverNode?.id;
  useLayoutEffect(() => {
    const card = hoverCard.current;
    const anchor = nodes.current[hoverId];
    if (!card || !anchor) return;
    const bounds = anchor.getBoundingClientRect();
    const width = card.offsetWidth, height = card.offsetHeight;
    const beside = bounds.right + 24 + width <= window.innerWidth - 12 ? bounds.right + 24 : bounds.left - width - 24;
    card.style.left = `${Math.max(12, Math.min(window.innerWidth - width - 12, beside < 12 ? bounds.left + bounds.width / 2 - width / 2 : beside))}px`;
    const above = bounds.top - height - 24;
    card.style.top = `${Math.max(12, Math.min(window.innerHeight - height - 12, beside < 12 ? (above >= 12 ? above : bounds.bottom + 72) : bounds.top))}px`;
  }, [hoverId, camera, mapSize]);

  function hoverEvents(id) {
    return {
      onPointerEnter: event => { if (event.pointerType === "mouse" && !drag.current) setOpenNode(id); },
      onPointerLeave: event => { if (event.pointerType === "mouse" && !event.relatedTarget?.closest?.(".atlas-popover")) setOpenNode(null); },
      onFocus: () => setOpenNode(id),
      onBlur: event => { if (!event.relatedTarget?.closest?.(".atlas-popover")) setOpenNode(null); },
      onKeyDown: event => { if (event.key === "Escape") setOpenNode(null); },
    };
  }

  return (
    <Localized as="main" ref={root} className="explorer-map-screen atlas-page" data-tutorial-step={tour?.step} onPointerDownCapture={(event) => { if (!event.target.closest(".atlas-popover, .atlas-marker")) setOpenNode(null); }}>
      <div className="atlas-profile-cluster">
        <Localized as="header" className="atlas-nameplate" aria-label="Your explorer profile">
          <div className="atlas-name"><Explorer avatarId={session.avatarId} /><Localized as="span" translate={session.nickname ? "no" : undefined} title={session.nickname || "Explorer"}>{session.nickname || "Explorer"}</Localized></div>
          <div className="atlas-route-progress">
            <Localized as="div" className="atlas-checkpoints" role="group" aria-label={`${mappedCount} of 5 journey stops mapped. Open journey list`}>
              {checkpoints.map((stop, index) => {
                const active = !stop.mapped && index === mappedCount;
                const status = checkpointStatus(stop);
                return <Localized as="button" type="button" key={stop.id} className={`atlas-checkpoint ${stop.mapped ? "is-mapped" : ""} ${active ? "is-current" : ""}`} data-plain-tooltip={`${stop.name} — ${status}`} data-tooltip-action="activate" onClick={() => setPanel("list")} aria-label={`${stop.name} — ${status}. Open journey list`} aria-current={active ? "step" : undefined} />;
              })}
            </Localized>
          </div>
        </Localized>
        <Localized as="div" className="atlas-badges" data-tutorial-id="badges" role="group" aria-label="Map stop badges">
          {checkpoints.map(stop => <Localized as="button" key={stop.id} className={`atlas-badge ${stop.mapped ? "earned" : ""}`} data-plain-tooltip={stop.mapped ? stop.name : stop.id === "islands" ? "Finish all three assessments to earn this." : `Finish ${stop.name} to earn this.`} aria-label={`${stop.name}: ${stop.mapped ? "mapped" : "not yet mapped"}, view badge details`} onClick={() => setPanel(`badge-${stop.id}`)}><Icon name="wax-seal-frame" /><Icon name={stop.icon} className="atlas-badge-fill" /></Localized>)}
        </Localized>
      </div>
      <Localized as="nav" className="atlas-utilities" aria-label="Map tools">
        <Localized as="button" onClick={() => setPanel("settings")} className="atlas-utility" data-tooltip="Open journey settings" aria-label="Settings" data-tutorial-id="settings" disabled={!isReady}><span><Icon name="settings-gear" /></span><Localized as="small">Settings</Localized></Localized>
        <Localized as="button" onClick={locate} className="atlas-utility" data-tooltip="Center the map on your explorer" aria-label="Locate Me" data-tutorial-id="locate-me" disabled={!isReady}><span><Icon name="flag-marker-pin" /></span><Localized as="small">Locate Me</Localized></Localized>
        <Localized as="button" onClick={() => setPanel("guide")} className="atlas-utility" data-tooltip="Learn how to explore the map" aria-label="Journey Guide" data-tutorial-id="journey-guide" disabled={!isReady}><span><Icon name="journey-guide" /></span><Localized as="small"><span className="atlas-label-desktop">Journey Guide</span><span className="atlas-label-mobile">Guide</span></Localized></Localized>
      </Localized>
      <Localized as="section" ref={mapWindow} className={`atlas-window ${dragging ? "is-dragging" : ""} ${!sequenceReady && !walking ? "is-holding" : ""}`} aria-label="Journey map, drag to explore" tabIndex={0} onPointerDown={panStart} onPointerMove={panMove} onPointerUp={panEnd} onPointerCancel={panEnd} onLostPointerCapture={panEnd}>
        <Localized as="div" ref={mapLayer} className="atlas-canvas" style={{ transform: `translate3d(${camera.x}px, ${camera.y}px, 0)`, transition: camera.snap ? "none" : undefined }}>
          <div className="atlas-cartography" aria-hidden="true" />
          {isReady && position && FOG_ZONES.map(zone => {
            const index = REGIONS.findIndex(stop => stop.id === zone.id);
            const stop = index < 0 ? ISLANDS : REGIONS[index];
            const locked = pendingStop === zone.id || (index < 0 ? !complete : regionState(index, progress) === "locked");
            const lifting = liftingFog.includes(zone.id);
            if (!locked && !lifting) return null;
            return <div key={zone.id} aria-hidden="true" data-fog-stop={zone.id} className={`atlas-fog ${lifting ? "is-lifting" : ""} ${tabHidden || dragging ? "is-paused" : ""}`} onAnimationEnd={event => { if (event.target === event.currentTarget) setLiftingFog(previous => previous.filter(id => id !== zone.id)); }} style={{ left: `${zone.left}%`, top: `${zone.top}%`, width: `${zone.width}%`, height: `${zone.height}%`, "--fog-stop-x": `${(stop.left - zone.left) / zone.width * 100}%`, "--fog-stop-y": `${(stop.top - zone.top) / zone.height * 100}%` }}><span /><span /></div>;
          })}
          <svg className="atlas-trail" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path ref={trail} data-tutorial-id="route" d={ROAD} />{tour?.step === 1 && <circle className="atlas-tour-dot" r="4" style={{ offsetPath: `path("${ROAD}")` }} />}</svg>
          <div className="atlas-basecamp atlas-marker atlas-location" style={{ left: `${BASECAMP.left}%`, top: `${BASECAMP.top}%` }}><Localized as="button" ref={element => { nodes.current.basecamp = element; }} className="atlas-region-art" aria-label="Basecamp, profile complete" aria-expanded={openNode === "basecamp"} onClick={() => setOpenNode("basecamp")} {...hoverEvents("basecamp")}><Icon name="explorer-backpack" /><Localized as="span">01</Localized><StopMark /></Localized><LocationCard name="Basecamp" /></div>
          <div ref={token} className="atlas-you atlas-token" style={{ visibility: position ? "visible" : "hidden", left: `${tokenLeft}%`, top: `calc(${tokenTop}% + ${tokenOffset}px)` }}><div className="atlas-pin" data-tutorial-id="avatar-pin"><PinFrame /><Explorer avatarId={session.avatarId} /><Localized as="span" className="atlas-pin-tooltip" role="tooltip">{tokenHint}</Localized></div></div>
          {REGIONS.map((region, index) => {
            const state = regionState(index, progress);
            return <div key={region.id} className={`atlas-marker atlas-location ${state} ${state === "active" && pendingStop === region.id ? "arrival-pending" : ""}`} style={{ left: `${region.left}%`, top: `${region.top}%`, "--tutorial-order": index }}>
              <Localized as="button" ref={(element) => { nodes.current[region.id] = element; }} className="atlas-region-art" aria-label={`${region.name}, ${state}`} aria-expanded={openNode === index} onClick={() => state === "active" ? enter(index) : setOpenNode(index)} {...hoverEvents(index)}><Icon name={region.icon} /><Localized as="span">{String(index + 2).padStart(2, "0")}</Localized>{(state !== "active" || pendingStop === region.id) && <StopMark locked={state === "locked" || pendingStop === region.id} pending={state === "active"} opening={unlocking === region.id} />}</Localized>
              <LocationCard name={region.name.replace("The ", "")} />
            </div>;
          })}
          <div className={`atlas-summit atlas-marker atlas-location ${complete ? `active revealed ${pendingStop === "islands" ? "arrival-pending" : ""}` : "locked"}`} style={{ left: `${ISLANDS.left}%`, top: `${ISLANDS.top}%` }}><Localized as="button" ref={element => { nodes.current.islands = element; }} className="atlas-region-art" aria-expanded={openNode === "islands"} aria-label={`The Islands, ${complete ? "ready" : "locked"}`} onClick={() => complete && actionReady ? router.push("/processing") : setOpenNode("islands")} {...hoverEvents("islands")}><Icon name="island-flag" /><Localized as="span">05</Localized>{(!complete || pendingStop === "islands") && <StopMark locked pending={complete} opening={unlocking === "islands"} />}</Localized><LocationCard name="Islands" /></div>

        </Localized>
        {hoverNode && <Card ref={hoverCard} variant="popup" className="atlas-popover popup-card" role="dialog" aria-labelledby="atlas-node-title" onPointerEnter={() => setOpenNode(openNode)} onPointerLeave={event => { if (event.pointerType === "mouse") setOpenNode(null); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenNode(null); }} onKeyDown={event => { if (event.key === "Escape") { nodes.current[hoverNode.id]?.focus(); setOpenNode(null); } }}>
          <Localized as="button" className="atlas-close" aria-label="Close assessment details" onClick={() => setOpenNode(null)}>×</Localized>
          <Localized as="p" className="atlas-eyebrow">{hoverNode.eyebrow}</Localized>
          <Localized as="h2" id="atlas-node-title">{hoverNode.name}</Localized><Localized as="p" className="atlas-description">{hoverNode.description}</Localized>
          {typeof openNode === "number" && <><Localized as="span" className="atlas-detail">{hoverNode.detail}</Localized>
          <Localized as="button" className="atlas-node-action" disabled={!actionReady || regionState(openNode, progress) === "locked"} onClick={() => regionState(openNode, progress) === "completed" ? setPanel(`badge-${REGIONS[openNode].id}`) : enter(openNode)}>{regionState(openNode, progress) === "completed" ? "✓ View Your Badge" : regionState(openNode, progress) === "locked" ? `Locked, finish ${REGIONS[openNode - 1].name} first.` : walking ? `Walking to ${walking.to.name}…` : `Enter ${REGIONS[openNode].name} →`}</Localized>
          </>}
          {(openNode === "basecamp" || openNode === "islands") && checkpoints.find(stop => stop.id === openNode)?.mapped && <Localized as="button" className="atlas-node-action" disabled={!actionReady} onClick={() => setPanel(`badge-${openNode}`)}>✓ View Your Badge</Localized>}
        </Card>}
      </Localized>
      <Localized as="p" className="atlas-session">No account needed · Progress saved in this browser on this device</Localized>
      <Localized as="nav" className="atlas-actions" aria-label="Assessment actions">
        <Localized as="button" className="atlas-round-action primary" data-tutorial-id="main-action" disabled={!actionReady} onClick={() => complete ? router.push("/processing") : enter(next)} aria-label={walking ? walkingLabel : complete ? "View My Results" : started ? "Continue your assessment" : "Start your assessment"}><span className="atlas-action-disc"><Icon name={complete ? "island-flag" : "compass"} /></span><Localized as="span">{walkingLabel}</Localized></Localized>
        {tourSeen && !tourWaiting && !tour && !started && current === "interests" && sequenceReady && !walking && !arrival && !unlocking && <Localized as="div" className="atlas-start-hint" role="status"><svg viewBox="0 0 32 38" aria-hidden="true"><path d="M12 21V5a3 3 0 0 1 6 0v12l3-1 4 3 3 1v9l-6 7H12L5 25a3 3 0 0 1 4-4l3 3" fill="#F5ECD7" stroke="#1B2A4A" strokeWidth="2" /></svg><Localized as="span">Press Start to begin</Localized></Localized>}
      </Localized>
      {isReady && offscreen && <Localized as="button" className="atlas-edge-arrow" aria-label={`Locate ${target.name}`} onClick={locate} style={{ left: Math.max(22, Math.min(mapSize.viewWidth - 22, targetX)), top: Math.max(22, Math.min(mapSize.viewHeight - 22, targetY)) }}><Localized as="span" aria-hidden="true" style={{ transform: `rotate(${edgeAngle}deg)` }}>➜</Localized></Localized>}
      {badgeToast.length > 0 && <CelebrationDialog key={badgeToast[0].id} className="atlas-badge-toast" autoDismissMs={3200} theme={{ interests: "wind", skills: "leaves", academic: "paper" }[badgeToast[0].id]} title={badgeToast[0].badge} eyebrow="Achievement unlocked" description={`${badgeToast[0].name} complete`} icon={<Icon name={badgeToast[0].badgeIcon} />} onClose={closeBadge} />}
      <Localized as="span" className={`atlas-scroll-hint ${hintDismissed || tour || tourWaiting ? "is-dismissed" : ""}`} aria-hidden="true">DRAG TO EXPLORE ↔</Localized>
      <Localized as="p" className="sr-only" aria-live="polite">{mappedCount} of 5 mapped. {complete ? "All assessments complete. Results unlocked." : `${REGIONS[next]?.name || "The Mountains"} is your next assessment.`}</Localized>
      <Localized as="p" className="sr-only" aria-live="polite" aria-atomic="true">{unlockAnnouncement}</Localized>
      {skipNote && <Localized as="p" className="atlas-tour-note" role="status">You can replay the tutorial anytime from the Journey Guide.</Localized>}
      {tour && <AtlasTutorial step={tour.step} replay={tour.replay} actionLabel={actionLabel} onStep={step => setTour(previous => ({ ...previous, step }))} onFinish={finishTour} onFlyover={tourFlyover} />}
      {celebrate && <CelebrationDialog className="atlas-expedition" major title="Full Expedition!" description="All three assessments completed. Your path is ready." icon={<Icon name="sunburst" />} onClose={() => setCelebrate(false)} actionLabel="View My Results" onAction={() => setCelebrate(false, () => router.push("/processing"))} />}
      <dialog ref={dialog} className="atlas-dialog" data-popup-key={panel} aria-labelledby="atlas-dialog-title" onCancel={(event) => { event.preventDefault(); closePanel(); }} onClick={(event) => { if (event.target === event.currentTarget) closePanel(); }}>
        <Card key={panel} variant="popup" className="atlas-dialog-card popup-card">
          <Localized as="button" className="atlas-close" aria-label="Close dialog" onClick={closePanel}>×</Localized>
          <Icon className="atlas-dialog-icon" name={(panel === "next" ? REGIONS[next]?.icon : badgeDetail?.badgeIcon || badgeDetail?.icon) || (panel === "settings" ? "settings-gear" : panel === "guide" ? "journey-guide" : "compass")} />
          {panel === "next" && REGIONS[next] && <><Localized as="p" className="atlas-eyebrow">NEXT ASSESSMENT UNLOCKED</Localized><Localized as="h2" id="atlas-dialog-title">{REGIONS[next].name}</Localized><Localized as="p">Finish {REGIONS[next].name} to earn the {REGIONS[next].badge} badge.</Localized><Button label="Continue" onClick={() => enter(next)} /></>}
          {panel === "guide" && <><Localized as="p" className="atlas-eyebrow">JOURNEY GUIDE</Localized><Localized as="h2" id="atlas-dialog-title">Welcome to The Atlas</Localized><ul className="atlas-guide-steps"><li><Icon name="ribbon-scroll" /><Localized as="span">This is your map. Drag it left or right to look around.</Localized></li><li><Icon name="mountain-peak" /><Localized as="span">Finish regions in order: Mountains, then Forest, then Valley.</Localized></li><li><Icon name="sunburst" /><Localized as="span">A glowing region means it&apos;s ready. Tap it to start.</Localized></li><li><Icon name="flag-marker-pin" /><Localized as="span">Lost? Tap Locate Me anytime to find your spot again.</Localized></li></ul><Localized as="div" className="atlas-guide-path">Mountains <Localized as="span">···</Localized> Forest <Localized as="span">···</Localized> Valley</Localized><Button label="Got it" onClick={closePanel} /><Button label="Replay tutorial" variant="secondary" onClick={replayTour} /></>}
          {panel === "list" && <><Localized as="p" className="atlas-eyebrow">YOUR ASSESSMENTS</Localized><Localized as="h2" id="atlas-dialog-title">Journey list</Localized><Localized as="ul" className="atlas-region-list">{journeyRows.map(row => <li key={row.id}><div><Localized as="strong">{row.name}</Localized><Localized as="span">{row.status}</Localized></div><Button label={row.action === "badge" ? "View Badge" : row.action === "enter" ? "Enter Assessment" : "Locked"} disabled={row.action === "locked" || !actionReady} onClick={() => row.action === "badge" ? setPanel(`badge-${row.id}`) : enter(row.regionIndex)} /></li>)}</Localized></>}
          {panel === "settings" && <><Localized as="p" className="atlas-eyebrow">YOUR SESSION</Localized><Localized as="h2" id="atlas-dialog-title">Journey Settings</Localized><Toggle label="Sound" enabled={sound} onClick={toggleSound} className="atlas-sound" data-tooltip={sound ? "Turn journey sound effects off" : "Turn journey sound effects on"} /><OfflineButton /><LanguageSwitcher /><div className="atlas-settings-actions"><Button label="Replay tutorial" variant="secondary" onClick={replayTour} /><Localized as="button" className="atlas-danger" onClick={() => setPanel("restart")}>Restart Assessment</Localized><Localized as="button" className="atlas-danger" onClick={() => setPanel("exit")}>Exit</Localized></div></>}
          {(panel === "restart" || panel === "exit") && <><Localized as="p" className="atlas-eyebrow">BEFORE YOU GO</Localized><Localized as="h2" id="atlas-dialog-title">{panel === "restart" ? "Restart your journey?" : "Leave The Atlas?"}</Localized><Localized as="p">{panel === "restart" ? "This clears your saved journey and results. Your language and sound settings stay the same. This can't be undone." : "Your progress is saved in this browser. Use Continue Your Journey on Home when you return to this device."}</Localized><div className="atlas-confirm-actions"><Button label={panel === "exit" ? "Stay" : "Keep Going"} autoFocus variant="secondary" onClick={closePanel} /><Localized as="button" className="atlas-danger" onClick={() => leave(panel === "restart")}>{panel === "restart" ? "Restart" : "Leave"}</Localized></div></>}
          {badgeDetail && <><Localized as="p" className="atlas-eyebrow">{badgeDetail.status}</Localized><Localized as="h2" id="atlas-dialog-title">{badgeDetail.title}</Localized><Localized as="p">{badgeDetail.description}</Localized>{badgeId !== "islands" && <Localized as="p" className="atlas-badge-next">Next: {["The Mountains", "The Forest", "The Valley", "The Islands"][["basecamp", "interests", "skills", "academic"].indexOf(badgeId)]}</Localized>}<Button label="Back to The Atlas" onClick={closePanel} /></>}
        </Card>
      </dialog>
    </Localized>
  );
}
