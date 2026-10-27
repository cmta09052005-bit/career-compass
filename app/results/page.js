"use client";

import Localized from "@/components/Localized";
import { useLanguage } from "@/components/LanguageProvider";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { getCourseData, schoolNotes, schoolLabel } from "@/lib/courseDataV2";
import { buildRecommendations, arcStrength } from "@/lib/recommendations";
import { useSessionAnswers } from "@/lib/useSessionAnswers";
import { COMPARISON_LIMIT_NOTICE, toggleCourseComparison } from "@/lib/courseComparison";
import { buildSearchIndex, searchCourses, filterOptions, activeFilterLabel, hasFilters, words, EMPTY_FILTERS } from "@/lib/courseSearch";
import ResultsControls from "./ResultsControls";

const SEARCH_INDEX = buildSearchIndex();
const FILTER_OPTIONS = filterOptions();

export default function ResultsPage() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const mapDialog = useRef(null);
  const [confirmMap, setConfirmMap] = usePopupState(false, ".results-map-dialog .popup-card");
  useEffect(() => {
    if (confirmMap) mapDialog.current?.showModal();
    else mapDialog.current?.close();
  }, [confirmMap]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("best");
  const [controlsKey, setControlsKey] = useState(0);
  const resultsScroll = useRef(null);
  function clearExploration() { setQuery(""); setFilters(EMPTY_FILTERS); setSort("best"); setShowAllCourses(false); }
  function leaveResults() { clearExploration(); setControlsKey(current => current + 1); }
  useEffect(() => {
    const restore = event => { if (event.persisted) { setQuery(""); setFilters(EMPTY_FILTERS); setSort("best"); setShowAllCourses(false); setControlsKey(current => current + 1); } };
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);
  useEffect(() => { resultsScroll.current?.scrollTo({ top: 0, behavior: "instant" }); }, [query, filters, sort]);
  const [comparisonNotice, setComparisonNotice] = useState("");
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
  const { session, isReady, updateSession } = useSessionAnswers();
  const comparison = session.courseComparison || [];
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const downloadPending = useRef(false);
  const result = useMemo(() => buildRecommendations(session), [session]);
  const topCourses = result.ranked;
  const matchingCourses = useMemo(() => searchCourses(topCourses, SEARCH_INDEX, { query, filters, sort }), [topCourses, query, filters, sort]);
  const exploring = words(query).length > 0 || hasFilters(filters) || sort !== "best";
  const displayedCourses = exploring || showAllCourses ? matchingCourses : matchingCourses.slice(0, 5);
  const activeComparison = comparison.filter(id => topCourses.some(course => course.id === id));
  const comparedCourses = activeComparison.map(id => ({ ...topCourses.find(course => course.id === id), details: getCourseData(id) }));

  function toggleComparison(id) {
    if (!activeComparison.includes(id) && activeComparison.length >= 2) { setComparisonNotice(COMPARISON_LIMIT_NOTICE); return; }
    setComparisonNotice("");
    updateSession({ courseComparison: toggleCourseComparison(activeComparison, id) });
  }

  async function downloadReport() {
    if (!isReady || downloadPending.current) return;
    downloadPending.current = true;
    setDownloading(true);
    setDownloadCelebration(true);
    playSound("badge", { volume: .48 });
    setDownloadError("");
    try {
      const report = buildExplorerReport(session, language);
      const celebrationBeat = new Promise(resolve => window.setTimeout(resolve, 950));
      if (!mounted.current) return;
      await downloadExplorerReport(report);
      updateSession({ reportDownloaded: true, reportDate: report.date });
      await celebrationBeat;
      if (!mounted.current) return;
      leaveResults();
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
        <Localized as="p" role="status" className="text-sm tracking-[0.18em] text-gold uppercase">
          Restoring your career map...
        </Localized>
      </main></JourneyAccess>
    );
  }

  return (
    <JourneyAccess session={session} isReady={isReady} requires={["interests", "skills", "academic"]}><Localized as="main" className="results-screen game-ui-screen explorer-map-screen relative min-h-screen overflow-hidden px-4 py-12 text-beige sm:px-6 lg:py-16">
      <dialog ref={mapDialog} className="trail-exit-dialog results-map-dialog" aria-labelledby="results-map-title" onCancel={(event) => { event.preventDefault(); setConfirmMap(false); }}>
        <Card variant="popup" className="popup-card">
          <Localized as="button" className="popup-close" aria-label="Close dialog" onClick={() => setConfirmMap(false)}>×</Localized>
          <Localized as="h2" id="results-map-title">Go back to your map?</Localized>
          <Localized as="p">Your results are saved in this browser on this device until you restart your journey or clear this site&apos;s browser data.</Localized>
          {!session.reportDownloaded && <Localized as="p" className="mt-3 text-sm">You haven&apos;t downloaded your report yet.</Localized>}
          <div className="popup-actions"><Button label="Stay" autoFocus variant="secondary" onClick={() => setConfirmMap(false)} /><Button label="Back to Map" onClick={() => setConfirmMap(false, () => { leaveResults(); router.push("/journey"); })} /></div>
        </Card>
      </dialog>
      <dialog ref={compareDialog} className="trail-exit-dialog results-compare-dialog" aria-labelledby="compare-title" onCancel={event => { event.preventDefault(); setCompareOpen(false); }}>
        <Card variant="popup" className="popup-card">
          <Localized as="button" className="popup-close" aria-label="Close comparison" autoFocus onClick={() => setCompareOpen(false)}>×</Localized>
          <Localized as="h2" id="compare-title">Compare your paths</Localized>
          <Localized as="div" className="course-comparison">{comparedCourses.map(course => <Localized as="section" key={course.id}>
            <Localized as="h3">{course.name}</Localized><Localized as="p">{course.group}</Localized>
            <Localized as="p" className="comparison-score">Rank #{course.rank}</Localized>
            <Localized as="h4">Overview</Localized><Localized as="p">{course.details.overview}</Localized>
            <Localized as="h4">Careers</Localized><ul>{course.details.careers.map((career, index) => <li key={index}>{career.jobTitle}: {career.salaryRange}{career.notes ? ` (${t(career.notes)})` : ""}</li>)}</ul>
            {course.details.careerNotes.map((note,index) => <p key={index}>{note.text}</p>)}
            <Localized as="h4">Schools</Localized><ul>{course.details.schools.map(school => <li key={school.id}>{schoolLabel(school)}{schoolNotes(school).length > 0 && <small>{schoolNotes(school).map(t).join("; ")}</small>}</li>)}</ul><p>School lists are not complete. Confirm programs with the school.</p>
          </Localized>)}</Localized>
        </Card>
      </dialog>
      {activeComparison.length === 2 && <div className="results-compare-bar"><Button ref={compareButton} label="Compare selected courses" onClick={() => setCompareOpen(true)} /><Localized as="span" role="status">2 courses selected</Localized></div>}
      {comparisonNotice && <Localized as="p" className="results-comparison-notice" role="alert">{comparisonNotice}</Localized>}
      {downloadCelebration && <div className="results-download-seal" role="status"><CelebrationEffects><Localized as={Image} src="/icons/career-compass/compass-download.svg" width={116} height={116} alt="" /></CelebrationEffects><Localized as="p">Your journey, ready to keep</Localized></div>}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 8%, rgba(45,191,184,0.22), transparent 30%), radial-gradient(circle at 90% 70%, rgba(212,160,23,0.16), transparent 32%)",
        }}
      />

      <Localized as="div" ref={resultsScroll} className="assessment-scroll relative mx-auto max-w-6xl" role="region" aria-label="Your course recommendations" tabIndex={0}>
        <Localized as="button" className="trail-exit popup-close" aria-label="Close results" onClick={() => setConfirmMap(true)}>×</Localized>
        <Localized as="header" className="mx-auto max-w-3xl text-center">
          {/* 49 — Heading */}
          <Localized as="h1" className="font-serif text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
            Your Career Map
          </Localized>
          {session.route === "old" && session.old.strand === "STR-04" && <Localized as="p" className="results-strand">GAS has no linked courses. Your matches come from your interests, skills, subjects and certificates & achievements.</Localized>}

          {/* 50 — Supporting subtext */}
          <Localized as="p" className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-beige/75 sm:text-base">
            Start with your top 5 matches, with all 85 courses to explore.
          </Localized>
        </Localized>

        <ResultsControls key={controlsKey} query={query} onQuery={setQuery} filters={filters} onFilter={(key, id) => setFilters(current => ({ ...current, [key]: current[key].includes(id) ? current[key].filter(value => value !== id) : [...current[key], id] }))} sort={sort} onSort={setSort} onClear={clearExploration} options={FILTER_OPTIONS} count={matchingCourses.length} summary={activeFilterLabel(filters, FILTER_OPTIONS)} topFiveShown={!exploring && !showAllCourses} />

        {/* 52 — Ranked course card list */}
        <section className="mt-8" aria-labelledby="recommended-paths-heading">
          <Localized as="h2"
            id="recommended-paths-heading"
            className="text-left font-serif text-2xl sm:text-3xl"
          >
            {exploring || showAllCourses ? "Your Course Matches" : "Your Top Course Matches"}
          </Localized>
          <Localized as="p" className="course-strength-note">The compass arcs show relative match strength.</Localized>
          <Localized as="div" className="mt-5 grid grid-cols-1 gap-4">
            {displayedCourses.map((course) => (
              <CourseMatch key={course.id} course={course} rank={course.rank}
                strength={arcStrength(course, topCourses)}
                selected={activeComparison.includes(course.id)} onCompare={() => toggleComparison(course.id)} onLeave={leaveResults} showHint={words(query).length > 0} />
            ))}
          </Localized>
          {!displayedCourses.length && <Localized as="p" className="results-empty">No courses on our list match. Try another search or clear the filters.</Localized>}
          {!exploring && <div className="mt-6 flex justify-center">
            <Button
              label={showAllCourses ? "Show top 5 only" : "Show all 85 courses"}
              onClick={() => setShowAllCourses(current => !current)}
              variant="secondary"
              className="inline-flex w-full items-center justify-center sm:w-auto"
            />
          </div>}
        </section>

        {/* 53 — Guidance disclaimer */}
        <Localized as="aside" className="mx-auto mt-10 max-w-3xl rounded-2xl border border-teal/30 bg-teal/10 p-5 text-center text-sm leading-6 text-beige/80">
          These matches can help you compare courses. Talk to your guidance
          counselor about what&apos;s right for you.
        </Localized>

        <Localized as="p" className="results-download-note mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-beige/70">
          Your answers are saved in this browser. Download your report to keep a separate copy.
        </Localized>

        <Localized as="div" className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          {/* 54 — Back to Journey Map button */}
          <Button
            label="Back to Journey Map"
            onClick={() => setConfirmMap(true)}
            variant="secondary"
            className="inline-flex w-full items-center justify-center sm:w-auto"
          />
          {/* 55 — Download My Explorer Report button */}
          <Button
            label={<><Localized as={Image} src="/icons/career-compass/compass-download.svg" width={30} height={30} alt="" />{downloading ? "Preparing your report…" : "Download My Explorer Report"}</>}
            onClick={downloadReport}
            disabled={downloading || !isReady}
            className="inline-flex w-full items-center justify-center sm:w-auto"
          />
        </Localized>
        {downloadError && <Localized as="p" role="alert" className="mt-4 text-center">{downloadError}</Localized>}
      </Localized>
    </Localized></JourneyAccess>
  );
}
