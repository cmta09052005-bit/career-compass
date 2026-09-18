"use client";

import Localized from "@/components/Localized";

import { useRef, useState } from "react";
import Button from "@/components/Button";
import JourneyAccess from "@/components/JourneyAccess";
import Card from "@/components/Card";
import courses from "@/data/courses.json";
import {
  buildExplorerReport,
  downloadExplorerReport,
  printExplorerReport,
} from "@/lib/explorerReport";
import {
  calculateCategoryScores,
  calculateMatchPercentages,
  createRecommendationResult,
} from "@/lib/scoringEngine";
import { useSessionAnswers } from "@/lib/useSessionAnswers";

export default function ReportPage() {
  const { session, answers, isReady, updateSession } = useSessionAnswers();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const pending = useRef(false);
  const categoryScores = calculateCategoryScores(answers);
  const categoryPercentages = calculateMatchPercentages(categoryScores);
  const result = createRecommendationResult(
    categoryPercentages,
    answers,
    courses,
  );
  const report = buildExplorerReport(session, answers, result);

  async function downloadAgain() {
    if (!isReady || pending.current) return;
    pending.current = true;
    setDownloading(true);
    setDownloadError("");
    try {
      await downloadExplorerReport(report);
      updateSession({ reportDownloaded: true, reportDate: report.date });
    } catch {
      setDownloadError("Your report could not be downloaded. Please try again.");
    } finally {
      pending.current = false;
      setDownloading(false);
    }
  }

  return (
    <JourneyAccess session={session} isReady={isReady} requires={["interests", "skills", "academic"]}><main className="report-screen game-ui-screen explorer-map-screen relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-beige sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(45,191,184,0.22), transparent 32%), radial-gradient(circle at 80% 85%, rgba(212,160,23,0.16), transparent 30%)",
        }}
      />

      <Card className="map-paper relative max-w-2xl rounded-xl text-center">
        <div
          className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold/60 bg-gold/15 text-2xl text-gold"
          aria-hidden="true"
        >
          <svg className="report-compass" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" /><path className="report-compass-needle" d="M32 10 L39 32 L32 54 L25 32 Z" fill="#b68124" /><circle cx="32" cy="32" r="4" fill="#1b2a4a" /></svg>
        </div>

        {/* 64 — Heading */}
        <Localized as="h1" className="mt-6 font-serif text-3xl leading-tight text-[#3b261c] text-balance sm:text-4xl md:text-5xl">
          Your Explorer Report Is Ready
        </Localized>

        {/* 65 — Supporting text */}
        <Localized as="p" className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#604532] sm:text-base">
          {session.reportDownloaded ? "Your Explorer Report has been downloaded." : "Your Explorer Report is ready to download."}
        </Localized>

        <Localized as="div" className="mt-8 grid gap-3 sm:grid-cols-2">
          {/* 66 — Download Report button */}
          <Button
            label={downloading ? "Preparing your report…" : "Download Again"}
            onClick={downloadAgain}
            disabled={!isReady || downloading}
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
        </Localized>
        {downloadError && <Localized as="p" role="alert" className="mt-4">{downloadError}</Localized>}
        <Localized as="p" className="mx-auto mt-6 max-w-md text-sm leading-6 text-[#604532]">Keep learning, one step at a time. Your guidance counselor can help you choose where to go next.</Localized>

        {/* 68 — Back to Results button */}
        <Button
          label="Back to Results"
          href="/results"
          variant="secondary"
          className="mt-4 inline-flex w-full items-center justify-center sm:w-auto"
        />
      </Card>
    </main></JourneyAccess>
  );
}
