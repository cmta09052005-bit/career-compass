"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { journeyEntry } from "@/lib/journeyEntry";
import { SESSION_STORAGE_KEY } from "@/lib/useSessionAnswers";
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
  const [entry, setEntry] = useState(() => journeyEntry({}));
  useEffect(() => {
    try { const stored = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)) || {}; queueMicrotask(() => setEntry(journeyEntry(stored))); } catch { /* Fresh session CTA remains available. */ }
  }, [pathname]);
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
  return <div className={`${marketing ? "story-home marketing-shell" : ""} ${marketingFonts} ${assessment ? "assessment-frame" : ""}`} onClickCapture={startJourney}>{marketing && pathname !== "/intake" && <MarketingNavbar entry={entry} solid={pathname !== "/" || scrolled} active={pathname} onNavigate={navigate} />}<div ref={content} className={marketing ? "marketing-content" : undefined}>{children}</div>{portal && <JourneyPortal celebration icon={portal === "success" ? "/icons/career-compass/explorer-backpack.svg" : "/landing-compass.png"} title={portal === "success" ? "Explorer Created!" : "Welcome, Explorer!"} description={portal === "success" ? "Your profile is ready. Your map awaits." : "Your journey begins now."} notice={portal === "success" && autoAssignedAvatar ? "We randomly assigned your explorer avatar. It does not affect your assessment results or scoring." : undefined} destinationSelector={portal === "success" ? ".explorer-map-screen" : ".basecamp"} onCancel={() => setPortal(false)} onEnter={() => router.push(portal === "success" ? "/journey" : "/intake")} onComplete={() => setPortal(false)} />}</div>;
}


