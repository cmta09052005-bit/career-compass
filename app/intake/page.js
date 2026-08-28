"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useSessionAnswers } from "@/lib/useSessionAnswers";

const STRANDS = [
  "Academic-STEM",
  "Academic-ABM",
  "Academic-HUMSS",
  "TVL",
  "Arts & Design",
  "Sports",
];

const YEAR_LEVELS = ["Grade 11", "Grade 12"];

export default function IntakePage() {
  const router = useRouter();
  const { session, isReady, updateSession } = useSessionAnswers();
  const canContinue = isReady && Boolean(session.strand);

  function handleSubmit(event) {
    event.preventDefault();
    if (canContinue) router.push("/journey");
  }

  return (
    <main className="relative isolate flex min-h-svh flex-1 items-center justify-center overflow-hidden bg-navy px-4 py-10 text-beige sm:px-6 sm:py-14 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(145deg,#121a2e_0%,#1b2a4a_48%,#443d63_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle_at_18%_18%,rgba(45,191,184,0.18),transparent_28%),radial-gradient(circle_at_82%_76%,rgba(212,160,23,0.18),transparent_32%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full border border-gold/10 shadow-[0_0_100px_rgba(212,160,23,0.08)] sm:h-96 sm:w-96"
      />

      {/* 13 — Background panel frame */}
      <Card>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-teal sm:text-xs">
            Explorer Profile
          </p>

          {/* 7 — Panel heading */}
          <h1 className="mt-3 font-serif text-3xl leading-tight text-beige sm:text-4xl md:text-5xl">
            Who Are You, Explorer?
          </h1>

          {/* 8 — Supporting subtext */}
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-beige/85 sm:text-base">
            Tell us a little about yourself so we can personalize your journey.
          </p>
        </div>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          {/* 9 — Nickname input field */}
          <div className="mx-auto max-w-2xl">
            <label
              htmlFor="nickname"
              className="mb-2 block text-sm font-medium text-beige"
            >
              Your nickname or first name
              <span className="ml-2 text-xs font-normal text-beige/75">
                Optional
              </span>
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              autoComplete="given-name"
              maxLength={50}
              value={session.nickname}
              disabled={!isReady}
              onChange={(event) =>
                updateSession({ nickname: event.target.value })
              }
              placeholder="What should we call you?"
              className="w-full rounded-xl border border-beige/20 bg-beige/8 px-4 py-3 text-base text-beige outline-none transition placeholder:text-beige/35 hover:border-beige/35 focus:border-gold focus:ring-4 focus:ring-gold/15 disabled:cursor-wait disabled:opacity-60"
            />
          </div>

          {/* 10 — Strand selector */}
          <fieldset disabled={!isReady}>
            <legend className="text-sm font-medium text-beige">
              Choose your strand <span className="text-gold">*</span>
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {STRANDS.map((strand) => (
                <label key={strand} className="group relative cursor-pointer">
                  <input
                    type="radio"
                    name="strand"
                    value={strand}
                    checked={session.strand === strand}
                    onChange={(event) =>
                      updateSession({ strand: event.target.value })
                    }
                    className="peer sr-only"
                  />
                  <span className="flex min-h-16 items-center justify-center rounded-xl border border-beige/20 bg-beige/6 px-4 py-3 text-center text-sm font-medium text-beige/80 transition group-hover:border-gold/55 group-hover:bg-gold/8 peer-checked:border-gold peer-checked:bg-gold/18 peer-checked:text-beige peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-teal peer-disabled:cursor-wait peer-disabled:opacity-60">
                    {strand}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* 11 — Year Level selector */}
          <fieldset disabled={!isReady}>
            <legend className="text-sm font-medium text-beige">
              Current year level
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {YEAR_LEVELS.map((yearLevel) => (
                <label key={yearLevel} className="group relative cursor-pointer">
                  <input
                    type="radio"
                    name="yearLevel"
                    value={yearLevel}
                    checked={session.yearLevel === yearLevel}
                    onChange={(event) =>
                      updateSession({ yearLevel: event.target.value })
                    }
                    className="peer sr-only"
                  />
                  <span className="flex min-h-14 items-center justify-center rounded-xl border border-beige/20 bg-beige/6 px-4 py-3 text-center text-sm font-medium text-beige/80 transition group-hover:border-teal/60 group-hover:bg-teal/8 peer-checked:border-teal peer-checked:bg-teal/15 peer-checked:text-beige peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold peer-disabled:cursor-wait peer-disabled:opacity-60">
                    {yearLevel}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-beige/75">
              This is for personalization only and does not affect your results.
            </p>
          </fieldset>

          {/* 12 — Continue button */}
          <div className="flex justify-center pt-1">
            <Button
              type="submit"
              disabled={!canContinue}
              label={
                <>
                  Continue
                  <span aria-hidden="true" className="ml-3 text-lg leading-none">
                    →
                  </span>
                </>
              }
              className="inline-flex w-full items-center justify-center font-semibold tracking-[0.18em] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:border-beige/15 disabled:bg-beige/10 disabled:text-beige/35 sm:w-auto sm:min-w-52"
            />
          </div>
        </form>
      </Card>
    </main>
  );
}
