"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CourseMatch from "./CourseMatch";
import CelebrationEffects from "@/components/CelebrationEffects";
import { playSound } from "@/lib/sound";
import "@/components/celebrations.css";
import "./results.css";
import usePopupState from "@/components/usePopupState";
import { buildExplorerReport, downloadExplorerReport } from "@/lib/explorerReport";
import Button from "@/components/Button";
import JourneyAccess from "@/components/JourneyAccess";
import Card from "@/components/Card";
import courses from "@/data/courses.json";
import {
  calculateCategoryScores,
  calculateMatchPercentages,
  createRecommendationResult,
  formatMatchPercent,
} from "@/lib/scoringEngine";
import { useSessionAnswers } from "@/lib/useSessionAnswers";
import { toggleCourseComparison } from "@/lib/courseComparison";

export default function ResultsPage() {
  const router = useRouter();
  const mapDialog = useRef(null);
  const [confirmMap, setConfirmMap] = usePopupState(false, ".results-map-dialog .popup-card");
  useEffect(() => {
    if (confirmMap) mapDialog.current?.showModal();
    else mapDialog.current?.close();
  }, [confirmMap]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [filters, setFilters] = useState([]);
  const [compareOpen, setCompareOpen] = usePopupState(false, ".results-compare-dialog .popup-card");
  const compareDialog = useRef(null);
  const compareButton = useRef(null);
  const [downloadCelebration, setDownloadCelebration] = useState(false);
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (compareOpen) compareDialog.current?.showModal();
    else if (compareDialog.current?.open) { compareDialog.current.close(); compareButton.current?.focus(); }
  }, [compareOpen]);
  const { session, answers, isReady, updateSession } = useSessionAnswers();
  const comparison = session.courseComparison || [];
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const downloadPending = useRef(false);
  const categoryScores = calculateCategoryScores(answers);
  const categoryPercentages = calculateMatchPercentages(categoryScores);
  const result = createRecommendationResult(
    categoryPercentages,
    answers,
    courses,
  );
  const topCourses = result.topCourses.map((match) => ({
    ...match,
    details: courses.find((course) => course.courseId === match.courseId),
  }));
  const displayedCourses = showAllCourses
    ? topCourses
    : topCourses.slice(0, 4);
  const categories = [...new Set(displayedCourses.map(course => course.categoryName))];
  const strongest = displayedCourses[0]?.calculatedCourseMatchPercent || 0;
  const weakest = displayedCourses.at(-1)?.calculatedCourseMatchPercent || 0;
  const comparedCourses = comparison.map(id => topCourses.find(course => course.courseId === id)).filter(Boolean);

  function toggleComparison(id) {
    updateSession({ courseComparison: toggleCourseComparison(comparison, id) });
  }

  async function downloadReport() {
    if (!isReady || downloadPending.current) return;
    downloadPending.current = true;
    setDownloading(true);
    setDownloadCelebration(true);
    playSound("badge", { volume: .48 });
    setDownloadError("");
    try {
      const report = buildExplorerReport(session, answers, result);
      await new Promise(resolve => window.setTimeout(resolve, 320));
      if (!mounted.current) return;
      await downloadExplorerReport(report);
      updateSession({ reportDownloaded: true, reportDate: report.date });
      router.push("/report");
    } catch {
      setDownloadError("Your report could not be downloaded. Please try again.");
    } finally {
      downloadPending.current = false;
      if (mounted.current) { setDownloading(false); setDownloadCelebration(false); }
    }
  }

  if (!isReady) {
    return (
      <JourneyAccess session={session} isReady={isReady} requires={["interests", "skills", "academic"]}><main className="results-screen game-ui-screen explorer-map-screen relative flex min-h-screen items-center justify-center px-4 text-beige">
        <p role="status" className="text-sm tracking-[0.18em] text-gold uppercase">
          Restoring your career map...
        </p>
      </main></JourneyAccess>
    );
  }

  return (
    <JourneyAccess session={session} isReady={isReady} requires={["interests", "skills", "academic"]}><main className="results-screen game-ui-screen explorer-map-screen relative min-h-screen overflow-hidden px-4 py-12 text-beige sm:px-6 lg:py-16">
      <button className="trail-exit popup-close" aria-label="Close results" onClick={() => setConfirmMap(true)}>×</button>
      <dialog ref={mapDialog} className="trail-exit-dialog results-map-dialog" aria-labelledby="results-map-title" onCancel={(event) => { event.preventDefault(); setConfirmMap(false); }}>
        <Card variant="popup" className="popup-card">
          <button className="popup-close" aria-label="Close dialog" onClick={() => setConfirmMap(false)}>×</button>
          <h2 id="results-map-title">Go back to your map?</h2>
          <p>Your results are still here. You can come back to them anytime this session, unless you restart or close this tab.</p>
          {!session.reportDownloaded && <p className="mt-3 text-sm">You haven&apos;t downloaded your report yet.</p>}
          <div className="popup-actions"><Button label="Stay" autoFocus variant="secondary" onClick={() => setConfirmMap(false)} /><Button label="Back to Map" onClick={() => setConfirmMap(false, () => router.push("/journey"))} /></div>
        </Card>
      </dialog>
      <dialog ref={compareDialog} className="trail-exit-dialog results-compare-dialog" aria-labelledby="compare-title" onCancel={event => { event.preventDefault(); setCompareOpen(false); }}>
        <Card variant="popup" className="popup-card">
          <button className="popup-close" aria-label="Close comparison" autoFocus onClick={() => setCompareOpen(false)}>×</button>
          <h2 id="compare-title">Compare your paths</h2>
          <div className="course-comparison">{comparedCourses.map(course => <section key={course.courseId}>
            <h3>{course.courseName}</h3><p>{course.categoryName}</p>
            <p className="comparison-score">{formatMatchPercent(course.finalCourseMatchPercent)}% match</p>
            {course.details?.overview && <p>{course.details.overview}</p>}
          </section>)}</div>
        </Card>
      </dialog>
      {comparison.length === 2 && <div className="results-compare-bar"><Button ref={compareButton} label="Compare selected courses" onClick={() => setCompareOpen(true)} /><span role="status">2 courses selected</span></div>}
      {downloadCelebration && <div className="results-download-seal" role="status"><CelebrationEffects><Image src="/icons/career-compass/compass-download.svg" width={116} height={116} alt="" /></CelebrationEffects><p>Your journey, ready to keep</p></div>}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 8%, rgba(45,191,184,0.22), transparent 30%), radial-gradient(circle at 90% 70%, rgba(212,160,23,0.16), transparent 32%)",
        }}
      />

      <div className="assessment-scroll relative mx-auto max-w-6xl" role="region" aria-label="Your course recommendations" tabIndex={0}>
        <header className="mx-auto max-w-3xl text-center">
          {/* 49 — Heading */}
          <h1 className="font-serif text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
            Your Career Map
          </h1>

          {/* 50 — Supporting subtext */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-beige/75 sm:text-base">
            These courses match your answers most closely. Open a course to see what you would study.
          </p>
        </header>

        {/* 52 — Ranked course card list */}
        <section className="mt-8" aria-labelledby="recommended-paths-heading">
          <h2
            id="recommended-paths-heading"
            className="text-center font-serif text-2xl sm:text-3xl"
          >
            Your Top Course Matches
          </h2>
          <div className="course-filters" role="group" aria-label="Focus course categories">
            {categories.map(category => <button key={category} type="button" aria-pressed={filters.includes(category)} onClick={() => setFilters(current => current.includes(category) ? current.filter(value => value !== category) : [...current, category])}>{category}</button>)}
            {filters.length > 0 && <button type="button" onClick={() => setFilters([])}>Clear filter</button>}
          </div>
          <p className="course-strength-note">The compass arcs show relative match strength within this list.</p>
          <div className="mt-5 grid grid-cols-1 gap-4">
            {displayedCourses.map((course, index) => (
              <CourseMatch key={course.courseId} course={course} rank={index + 1}
                strength={strongest === weakest ? 95 : 30 + 65 * (course.calculatedCourseMatchPercent - weakest) / (strongest - weakest)}
                strongestCategory={result.strongestCategory}
                dimmed={filters.length > 0 && !filters.includes(course.categoryName)}
                selected={comparison.includes(course.courseId)} onCompare={() => toggleComparison(course.courseId)} />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              label={showAllCourses ? "Show Top 4 Only" : `See All ${topCourses.length} Courses`}
              onClick={() => { setShowAllCourses(current => !current); setFilters([]); }}
              variant="secondary"
              className="inline-flex w-full items-center justify-center sm:w-auto"
            />
          </div>
        </section>

        {/* 53 — Guidance disclaimer */}
        <aside className="mx-auto mt-10 max-w-3xl rounded-2xl border border-teal/30 bg-teal/10 p-5 text-center text-sm leading-6 text-beige/80">
          These matches can help you compare courses. Talk to your guidance
          counselor about what&apos;s right for you.
        </aside>

        <p className="results-download-note mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-beige/70">
          Download your report before closing this tab. Your answers will be cleared.
        </p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          {/* 54 — Back to Journey Map button */}
          <Button
            label="Back to Journey Map"
            onClick={() => setConfirmMap(true)}
            variant="secondary"
            className="inline-flex w-full items-center justify-center sm:w-auto"
          />
          {/* 55 — Download My Explorer Report button */}
          <Button
            label={<><Image src="/icons/career-compass/compass-download.svg" width={30} height={30} alt="" />{downloading ? "Preparing your report…" : "Download My Explorer Report"}</>}
            onClick={downloadReport}
            disabled={downloading || !isReady}
            className="inline-flex w-full items-center justify-center sm:w-auto"
          />
        </div>
        {downloadError && <p role="alert" className="mt-4 text-center">{downloadError}</p>}
      </div>
    </main></JourneyAccess>
  );
}
