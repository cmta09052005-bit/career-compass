"use client";

import Localized from "@/components/Localized";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function MarketingNavbar({ solid = false, active, onNavigate, entry = { href: "/intake", label: "START YOUR JOURNEY" } }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header data-landing={active === "/" ? true : undefined} data-menu-open={menuOpen} onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }} className={`story-navbar ${solid ? "is-solid" : ""}`}>
      <Link className="story-brand" href="/" onClick={(event) => onNavigate?.(event, "/")}><Localized as={Image} src="/landing-compass.png" alt="" width={40} height={40} /><Localized as="span">CAREER COMPASS</Localized></Link>
      <Localized as="button" type="button" className="story-menu-toggle" aria-expanded={menuOpen} aria-controls="marketing-navigation" onClick={() => setMenuOpen((value) => !value)}>Menu {menuOpen ? "−" : "+"}</Localized>
      <Localized as="nav" id="marketing-navigation" aria-label="Main navigation" onClick={() => setMenuOpen(false)}>
        <Localized as={Link} href="/" aria-current={active === "/" ? "page" : undefined} onClick={(event) => onNavigate?.(event, "/")}>Home</Localized>
        <Localized as={Link} href="/about" aria-current={active === "/about" ? "page" : undefined} onClick={(event) => onNavigate?.(event, "/about")}>About</Localized>
        <Localized as={Link} href="/how-it-works" aria-current={active === "/how-it-works" ? "page" : undefined} onClick={(event) => onNavigate?.(event, "/how-it-works")}>How It Works</Localized>
        <LanguageSwitcher navigation />
      </Localized>
      <Button href={entry.href} className="story-button story-nav-start" label={entry.label} />
    </header>
  );
}
