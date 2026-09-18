"use client";

import Localized from "@/components/Localized";
/**
 * Temporary screen stub for foundation routing (site map 1–6).
 * Replace per-page once each screen is built.
 */
export default function ScreenPlaceholder({ title, path }) {
  return (
    <Localized as="main" className="game-ui-screen flex flex-1 flex-col items-center justify-center bg-beige px-6 py-16">
      {path ? (
        <Localized as="p" className="mb-3 font-sans text-sm uppercase tracking-[0.2em] text-teal">
          {path}
        </Localized>
      ) : null}
      <Localized as="h1" className="text-center font-serif text-4xl text-navy md:text-5xl">
        {title}
      </Localized>
    </Localized>
  );
}
