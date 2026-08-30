"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ProgressIndicator from "@/components/ProgressIndicator";
import items from "@/data/items.json";
import {
  SECTION_STATUS,
  useSessionAnswers,
} from "@/lib/useSessionAnswers";
import useUnsavedProgressWarning from "@/lib/useUnsavedProgressWarning";

const SKILL_ITEMS = items.filter((item) => item.section === "Skills");

export default function SkillsPage() {
  const router = useRouter();
  const { session, isReady, updateSession } = useSessionAnswers();
  const [statementIndex, setStatementIndex] = useState(0);
  useUnsavedProgressWarning(true);

  const currentItem = SKILL_ITEMS[statementIndex];
  const selectedValue = session.skills[currentItem.id];
  const hasSelectedValue = Number.isFinite(selectedValue);
  const progressItems = SKILL_ITEMS.map((item, index) => ({
    id: item.id,
    state: index <= statementIndex ? "completed" : "unlocked",
  }));

  function selectConfidence(value) {
    updateSession({
      skills: { [currentItem.id]: Number(value) },
      journeyProgress: { skills: SECTION_STATUS.IN_PROGRESS },
    });
  }

  function goBack() {
    if (statementIndex === 0) {
      router.push("/journey");
      return;
    }
    setStatementIndex((index) => index - 1);
  }

  function goNext() {
    if (!hasSelectedValue) return;
    if (statementIndex < SKILL_ITEMS.length - 1) {
      setStatementIndex((index) => index + 1);
      return;
    }
    updateSession({
      journeyProgress: { skills: SECTION_STATUS.COMPLETED },
    });
    router.push("/journey");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-10 text-beige sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 15% 15%, rgba(45,191,184,0.22), transparent 30%), radial-gradient(circle at 85% 80%, rgba(212,160,23,0.18), transparent 32%)",
        }}
      />

      <Card className="relative max-w-3xl">
        {/* 34 — Section/progress label */}
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase sm:text-sm">
          Skills — Statement {statementIndex + 1} of {SKILL_ITEMS.length}
        </p>
        <div className="mt-4">
          <ProgressIndicator
            items={progressItems}
            completedCount={statementIndex + 1}
            variant="mini"
          />
        </div>

        {/* 35 — Statement text */}
        <h1 className="mt-8 font-serif text-2xl leading-tight text-balance sm:text-3xl md:text-4xl">
          {currentItem.text}
        </h1>

        {/* 36 — Confidence slider */}
        <div className="mt-10 rounded-2xl border border-beige/20 bg-navy/35 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor={`confidence-${currentItem.id}`}
              className="text-sm font-semibold text-beige"
            >
              Confidence level
            </label>
            <output
              htmlFor={`confidence-${currentItem.id}`}
              className="flex size-10 items-center justify-center rounded-full border border-gold/60 bg-gold/15 font-bold text-gold"
              aria-live="polite"
            >
              {hasSelectedValue ? selectedValue : "—"}
            </output>
          </div>
          <input
            id={`confidence-${currentItem.id}`}
            type="range"
            min={currentItem.min}
            max={currentItem.max}
            step="1"
            value={hasSelectedValue ? selectedValue : currentItem.min}
            onInput={(event) => selectConfidence(event.currentTarget.value)}
            aria-valuetext={
              hasSelectedValue
                ? `${selectedValue} out of ${currentItem.max}`
                : "No confidence level selected"
            }
            className="mt-7 h-2 w-full cursor-pointer accent-gold"
          />
          <div
            className="mt-5 grid grid-cols-5 gap-2"
            role="radiogroup"
            aria-label="Choose a confidence level"
          >
            {Array.from(
              { length: currentItem.max - currentItem.min + 1 },
              (_, index) => currentItem.min + index,
            ).map((value) => {
              const isSelected = selectedValue === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${value} out of ${currentItem.max}`}
                  onClick={() => selectConfidence(value)}
                  className={`min-h-11 rounded-xl border text-sm font-bold transition-[border-color,background-color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-[0.97] ${
                    isSelected
                      ? "border-gold bg-gold text-navy"
                      : "border-beige/25 bg-navy/45 text-beige hover:border-teal"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between gap-4 text-xs text-beige/70 sm:text-sm">
            <span>{currentItem.minLabel}</span>
            <span className="text-right">{currentItem.maxLabel}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {/* 37 — Back button */}
          <Button
            label="Back"
            variant="secondary"
            onClick={goBack}
            className="w-full sm:w-auto"
          />
          {/* 38 — Next button */}
          <Button
            label={
              statementIndex === SKILL_ITEMS.length - 1
                ? "Complete Skills"
                : "Next"
            }
            onClick={goNext}
            disabled={!isReady || !hasSelectedValue}
            className="w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          />
        </div>
      </Card>
    </main>
  );
}
