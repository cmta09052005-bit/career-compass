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

const INTEREST_ITEMS = items.filter((item) => item.section === "Interests");

export default function InterestsPage() {
  const router = useRouter();
  const { session, isReady, updateSession } = useSessionAnswers();
  const [questionIndex, setQuestionIndex] = useState(0);
  useUnsavedProgressWarning(true);

  const currentItem = INTEREST_ITEMS[questionIndex];
  const selectedKey = session.interests[currentItem.id];
  const progressItems = INTEREST_ITEMS.map((item, index) => ({
    id: item.id,
    state: index <= questionIndex ? "completed" : "unlocked",
  }));

  function selectOption(key) {
    updateSession({
      interests: { [currentItem.id]: key },
      journeyProgress: { interests: SECTION_STATUS.IN_PROGRESS },
    });
  }

  function goBack() {
    if (questionIndex === 0) {
      router.push("/journey");
      return;
    }
    setQuestionIndex((index) => index - 1);
  }

  function goNext() {
    if (!selectedKey) return;
    if (questionIndex < INTEREST_ITEMS.length - 1) {
      setQuestionIndex((index) => index + 1);
      return;
    }
    updateSession({
      journeyProgress: { interests: SECTION_STATUS.COMPLETED },
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
        {/* 25 — Section/progress label */}
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase sm:text-sm">
          Interests — Question {questionIndex + 1} of {INTEREST_ITEMS.length}
        </p>

        {/* 26 — Mini progress indicator */}
        <div className="mt-4">
          <ProgressIndicator
            items={progressItems}
            completedCount={questionIndex + 1}
            variant="mini"
          />
        </div>

        {/* 27 — Scenario prompt text */}
        <h1 className="mt-8 font-serif text-2xl leading-tight text-balance sm:text-3xl md:text-4xl">
          {currentItem.text}
        </h1>

        <div
          className="mt-8 grid gap-3 sm:grid-cols-2"
          aria-label="Answer options"
          role="radiogroup"
        >
          {currentItem.options.map((option, optionIndex) => {
            const isSelected = selectedKey === option.key;
            return (
              <Card
                // 28–31 — Option cards 1–4
                key={option.key}
                as="button"
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => selectOption(option.key)}
                className={`max-w-none rounded-2xl p-5 text-left transition-[border-color,background-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-[0.99] ${
                  isSelected
                    ? "border-gold bg-gold/20"
                    : "border-beige/20 bg-navy/35 hover:border-teal/70 hover:bg-teal/10"
                }`}
              >
                <span className="flex items-start gap-4">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                      isSelected
                        ? "border-gold bg-gold text-navy"
                        : "border-beige/30 text-beige/70"
                    }`}
                    aria-hidden="true"
                  >
                    {option.key}
                  </span>
                  <span className="pt-1 text-sm leading-6 sm:text-base">
                    {option.text}
                  </span>
                </span>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {/* 32 — Back button */}
          <Button
            label="Back"
            variant="secondary"
            onClick={goBack}
            className="w-full sm:w-auto"
          />
          {/* 33 — Next button */}
          <Button
            label={
              questionIndex === INTEREST_ITEMS.length - 1
                ? "Complete Interests"
                : "Next"
            }
            onClick={goNext}
            disabled={!isReady || !selectedKey}
            className="w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          />
        </div>
      </Card>
    </main>
  );
}
