"use client";

import { hasUnsavedChanges, retryPendingChanges, subscribeToStorage } from "@/lib/browserStorage";
import useUnsavedProgressWarning from "@/lib/useUnsavedProgressWarning";


import Localized from "@/components/Localized";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { journeyEntry } from "@/lib/journeyEntry";
import { useSessionAnswers } from "@/lib/useSessionAnswers";
import MarketingNavbar from "@/components/MarketingNavbar";
import usePopupState from "./usePopupState";
import JourneyPortal from "@/components/JourneyPortal";
import { marketingFonts } from "@/components/marketingFonts";
import "@/app/story.css";
import "@/app/marketing-polish.css";

const routes = ["/", "/about", "/how-it-works", "/intake"];
export default function MarketingShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const content = useRef(null);
  const switching = useRef(false);
  const { session } = useSessionAnswers();
  const entry = journeyEntry(session);
  const [saveFailed, setSaveFailed] = useState(false);
  useUnsavedProgressWarning(true);
  useEffect(() => {
    const refresh = () => setSaveFailed(hasUnsavedChanges());
    queueMicrotask(refresh);
    const unsubscribe = subscribeToStorage(refresh);
    window.addEventListener("focus", retryPendingChanges);
    return () => { unsubscribe(); window.removeEventListener("focus", retryPendingChanges); };
  }, []);
  const [scrolled, setScrolled] = useState(false);
  const [autoAssignedAvatar, setAutoAssignedAvatar] = useState(false);
  const [portal, setPortal] = usePopupState(false, ".portal-card");
  const marketing = routes.includes(pathname);
  const assessment = pathname === "/intake" || pathname === "/journey" || pathname.startsWith("/journey/") || pathname === "/processing" || pathname === "/results" || pathname.startsWith("/results/") || pathname === "/report";
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);
  const { contextSafe } = useGSAP(() => {
    switching.current = false;
    if (!content.current || !marketing || pathname === "/intake") return;
    gsap.fromTo(content.current, { opacity: 0 }, { opacity: 1, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .28, clearProps: "opacity" });
  }, { dependencies: [pathname], revertOnUpdate: true });
  const navigate = (event, href) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (href === pathname) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      return;
    }
    event.preventDefault();
    if (switching.current) return;
    switching.current = true;
    router.prefetch(href);
    contextSafe(() => gsap.to(content.current, { opacity: 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : .28, onComplete: () => router.push(href) }))();
  };


  useEffect(() => {
    const completed = event => { setAutoAssignedAvatar(event.detail?.autoAssigned === true); setPortal("success"); router.prefetch("/journey"); };
    window.addEventListener("explorer-created", completed);
    return () => window.removeEventListener("explorer-created", completed);
  }, [router, setPortal]);

  const startJourney = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (marketing && pathname !== "/intake" && event.target.closest('a[href="/intake"]')) { event.preventDefault(); event.stopPropagation(); if (entry.href !== "/intake") { router.push(entry.href); return; } setPortal(true); router.prefetch("/intake"); }
  };
  return <Localized as="div" className={`${marketing ? "story-home marketing-shell" : ""} ${marketingFonts} ${assessment ? "assessment-frame" : ""}`} onClickCapture={startJourney}>{saveFailed && <Localized as="p" role="alert" className="fixed inset-x-0 top-0 z-[100] bg-navy px-4 py-3 text-center text-sm text-beige">Your latest changes could not be saved on this device. Keep this page open and allow browser storage before leaving.</Localized>}{marketing && pathname !== "/intake" && <MarketingNavbar entry={entry} solid={pathname !== "/" || scrolled} active={pathname} onNavigate={navigate} />}<Localized as="div" ref={content} className={marketing ? "marketing-content" : undefined}>{children}</Localized>{portal && <JourneyPortal celebration icon={portal === "success" ? "/icons/career-compass/explorer-backpack.svg" : "/landing-compass.png"} title={portal === "success" ? "Explorer Created!" : "Welcome, Explorer!"} description={portal === "success" ? "Your profile is ready. Your map awaits." : "Your journey begins now."} notice={portal === "success" && autoAssignedAvatar ? "We randomly assigned your explorer avatar. It does not affect your assessment results or scoring." : undefined} destinationSelector={portal === "success" ? ".explorer-map-screen" : ".basecamp"} onCancel={() => setPortal(false)} onEnter={() => router.push(portal === "success" ? "/journey" : "/intake")} onComplete={() => setPortal(false)} />}</Localized>;
}

