"use client";

import Button from "@/components/Button";
import Card from "@/components/Card";
import courses from "@/data/courses.json";
import {
  downloadExplorerReport,
  printExplorerReport,
} from "@/lib/explorerReport";
import {
  calculateCategoryScores,
  calculateCourseMatches,
  calculateMatchPercentages,
  rankResults,
} from "@/lib/scoringEngine";
import { useSessionAnswers } from "@/lib/useSessionAnswers";

export default function ReportPage() {
  const { session, answers, isReady } = useSessionAnswers();
  const categoryScores = calculateCategoryScores(answers);
  const categoryPercentages = calculateMatchPercentages(categoryScores);
  const rankedCategories = rankResults(categoryPercentages);
  const topCategory = rankedCategories[0];
  const rankedCourses = topCategory
    ? calculateCourseMatches(
        topCategory.category,
        topCategory,
        answers,
        courses,
      )
    : [];
  const report = {
    nickname: session.nickname,
    date: new Intl.DateTimeFormat("en-PH", { dateStyle: "long" }).format(
      new Date(),
    ),
    topCategory,
    rankedCourses,
    profile: {
      interestsAnswered: Object.keys(session.interests).length,
      strongSkills: Object.values(session.skills).filter(
        (value) => Number(value) >= 4,
      ).length,
      strand: session.strand,
      gwa: session.gwa,
      subjects: session.subjects,
    },
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-12 text-beige sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(45,191,184,0.22), transparent 32%), radial-gradient(circle at 80% 85%, rgba(212,160,23,0.16), transparent 30%)",
        }}
      />

      <Card className="relative max-w-2xl text-center">
        <div
          className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold/60 bg-gold/15 text-2xl text-gold"
          aria-hidden="true"
        >
          ✓
        </div>

        {/* 64 — Heading */}
        <h1 className="mt-6 font-serif text-3xl leading-tight text-balance sm:text-4xl md:text-5xl">
          Your Explorer Report Is Ready
        </h1>

        {/* 65 — Supporting text */}
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-beige/75 sm:text-base">
          Your journey has been mapped. Your next destination is yours to
          explore.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {/* 66 — Download Report button */}
          <Button
            label="Download Report"
            onClick={() => downloadExplorerReport(report)}
            disabled={!isReady}
            className="inline-flex w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
          />
          {/* 67 — Print Report button */}
          <Button
            label="Print Report"
            variant="secondary"
            onClick={() => printExplorerReport(report)}
            disabled={!isReady}
            className="inline-flex w-full items-center justify-center"
          />
        </div>

        {/* 68 — Back to Results button */}
        <Button
          label="Back to Results"
          href="/results"
          variant="secondary"
          className="mt-4 inline-flex w-full items-center justify-center sm:w-auto"
        />
      </Card>
    </main>
  );
}
