"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import items from "@/data/items.json";
import {
  SECTION_STATUS,
  useSessionAnswers,
} from "@/lib/useSessionAnswers";
import useUnsavedProgressWarning from "@/lib/useUnsavedProgressWarning";

const ACADEMIC_ITEMS = items.filter(
  (item) => item.section === "Academic Performance",
);
const STRAND_ITEM = ACADEMIC_ITEMS.find((item) => item.id === "ACA-01");
const GWA_ITEM = ACADEMIC_ITEMS.find((item) => item.id === "ACA-03");
const SUBJECTS_ITEM = ACADEMIC_ITEMS.find((item) => item.id === "ACA-04");

export default function AcademicPage() {
  const router = useRouter();
  const { session, isReady, updateSession } = useSessionAnswers();
  useUnsavedProgressWarning(true);

  const strandLabel =
    STRAND_ITEM.options.find((option) => option.value === session.strand)
      ?.text || session.strand || "Not provided";
  const hasValidGwa =
    Number.isFinite(session.gwa) &&
    session.gwa >= GWA_ITEM.min &&
    session.gwa <= GWA_ITEM.max;
  const hasSubjects = session.subjects.length > 0;
  const canSubmit = isReady && hasValidGwa && hasSubjects;
  const hasReachedSubjectLimit =
    session.subjects.length >= SUBJECTS_ITEM.maxSelect;

  function updateGwa(event) {
    const value = event.target.value;
    updateSession({
      gwa: value === "" ? null : Number(value),
      journeyProgress: { academic: SECTION_STATUS.IN_PROGRESS },
    });
  }

  function toggleSubject(value) {
    const isSelected = session.subjects.includes(value);
    if (!isSelected && hasReachedSubjectLimit) return;

    updateSession({
      subjects: isSelected
        ? session.subjects.filter((subject) => subject !== value)
        : [...session.subjects, value],
      journeyProgress: { academic: SECTION_STATUS.IN_PROGRESS },
    });
  }

  function submitAcademicProfile(event) {
    event.preventDefault();
    if (!canSubmit) return;
    updateSession({
      journeyProgress: { academic: SECTION_STATUS.COMPLETED },
    });
    router.push("/processing");
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

      <Card className="relative max-w-4xl">
        <form onSubmit={submitAcademicProfile}>
          {/* 39 — Section label */}
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase sm:text-sm">
            Academic Performance
          </p>
          <h1 className="mt-3 font-serif text-3xl text-balance sm:text-4xl">
            Complete your academic profile
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-beige/70 sm:text-base">
            Add your general average and choose up to three subjects where
            you perform best.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="space-y-6">
              {/* 40 — Strand display (read-only) */}
              <section className="rounded-2xl border border-beige/20 bg-navy/35 p-5">
                <h2 className="text-sm font-semibold text-beige/70">
                  {STRAND_ITEM.text}
                </h2>
                <p className="mt-2 text-lg font-semibold text-gold">
                  {strandLabel}
                </p>
                <p className="mt-1 text-xs text-beige/55">
                  Based on your student intake information
                </p>
              </section>

              {/* 41 — General Weighted Average input */}
              <section className="rounded-2xl border border-beige/20 bg-navy/35 p-5">
                <label
                  htmlFor="academic-gwa"
                  className="text-sm font-semibold text-beige"
                >
                  {GWA_ITEM.text}
                </label>
                <input
                  id="academic-gwa"
                  type="number"
                  min={GWA_ITEM.min}
                  max={GWA_ITEM.max}
                  step="0.01"
                  value={session.gwa ?? ""}
                  onChange={updateGwa}
                  placeholder={`${GWA_ITEM.min}–${GWA_ITEM.max}`}
                  required
                  className="mt-3 min-h-12 w-full rounded-xl border border-beige/25 bg-navy/70 px-4 text-lg text-beige outline-none transition-colors placeholder:text-beige/35 focus:border-gold"
                />
                <p className="mt-2 text-xs text-beige/55">
                  Enter a value from {GWA_ITEM.min} to {GWA_ITEM.max}.
                </p>
              </section>
            </div>

            {/* 42 — Best-Performing Subjects checklist */}
            <fieldset className="rounded-2xl border border-beige/20 bg-navy/35 p-5 sm:p-6">
              <legend className="px-1 text-sm font-semibold text-beige">
                {SUBJECTS_ITEM.text}
              </legend>
              <p className="mt-1 text-xs text-beige/55" aria-live="polite">
                {session.subjects.length} of {SUBJECTS_ITEM.maxSelect} selected
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SUBJECTS_ITEM.options.map((option) => {
                  const isSelected = session.subjects.includes(option.value);
                  const isDisabled = !isSelected && hasReachedSubjectLimit;
                  return (
                    <label
                      key={option.value}
                      className={`flex min-h-16 items-start gap-3 rounded-xl border p-4 transition-colors ${
                        isSelected
                          ? "border-gold bg-gold/15"
                          : "border-beige/15 bg-navy/30"
                      } ${
                        isDisabled
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer hover:border-teal/70"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => toggleSubject(option.value)}
                        className="mt-0.5 size-4 shrink-0 accent-gold"
                      />
                      <span className="text-sm leading-5 text-beige/90">
                        {option.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {/* 43 — Back button */}
            <Button
              label="Back"
              variant="secondary"
              onClick={() => router.push("/journey/skills")}
              className="w-full sm:w-auto"
            />
            {/* 44 — Submit button */}
            <Button
              label="Submit"
              type="submit"
              disabled={!canSubmit}
              className="w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            />
          </div>
        </form>
      </Card>
    </main>
  );
}
