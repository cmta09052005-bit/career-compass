"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MarketingNavbar from "@/components/MarketingNavbar";
import { marketingFonts } from "@/components/marketingFonts";
import "@/app/story.css";
import "@/app/marketing-polish.css";

const routes = ["/", "/about", "/how-it-works"];
export default function MarketingShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const content = useRef(null);
  const switching = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const marketing = routes.includes(pathname);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);
  const { contextSafe } = useGSAP(() => {
    switching.current = false;
    if (!content.current) return;
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
  if (!marketing) return children;
  return <div className={`story-home marketing-shell ${marketingFonts}`}><MarketingNavbar solid={pathname !== "/" || scrolled} active={pathname} onNavigate={navigate} /><div ref={content} className="marketing-content">{children}</div></div>;
}
