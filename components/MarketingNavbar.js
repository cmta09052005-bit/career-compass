import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";

export default function MarketingNavbar({ solid = false, active, onNavigate }) {
  return (
    <header className={`story-navbar ${solid ? "is-solid" : ""}`}>
      <Link className="story-brand" href="/" onClick={(event) => onNavigate?.(event, "/")}><Image src="/landing-compass.png" alt="" width={40} height={40} /><span>CAREER COMPASS</span></Link>
      <nav aria-label="Main navigation">
        <Link href="/" aria-current={active === "/" ? "page" : undefined} onClick={(event) => onNavigate?.(event, "/")}>Home</Link>
        <Link href="/about" aria-current={active === "/about" ? "page" : undefined} onClick={(event) => onNavigate?.(event, "/about")}>About</Link>
        <Link href="/how-it-works" aria-current={active === "/how-it-works" ? "page" : undefined} onClick={(event) => onNavigate?.(event, "/how-it-works")}>How It Works</Link>
      </nav>
      <Button href="/intake" className="story-button story-nav-start" label="Start Journey ↗" />
    </header>
  );
}
