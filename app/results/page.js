"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import courses from "@/data/courses.json";
import { downloadExplorerReport } from "@/lib/explorerReport";
import {
  calculateCategoryScores,
  calculateCourseMatches,
  calculateMatchPercentages,
  rankResults,
} from "@/lib/scoringEngine";
import { useSessionAnswers } from "@/lib/useSessionAnswers";

function overviewExcerpt(overview) {
  if (!overview) return "Explore this course and the paths it can open.";
  const firstSentence = overview.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
  return firstSentence || overview;
}

export default function ResultsPage() {
  const router = useRouter();
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
      ).map((match) => ({
        ...match,
        details: courses.find(
          (course) => course.courseId === match.courseId,
        ),
      }))
    : [];

  function downloadReport() {
    downloadExplorerReport({
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
    });
    router.push("/report");
  }

  if (!isReady) {
    return (
      <main className="explorer-map-screen relative flex min-h-screen items-center justify-center px-4 text-beige">
        <p role="status" className="text-sm tracking-[0.18em] text-gold uppercase">
          Restoring your career map...
        </p>
      </main>
    );
  }

  return (
    <main className="explorer-map-screen relative min-h-screen overflow-hidden px-4 py-12 text-beige sm:px-6 lg:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 8%, rgba(45,191,184,0.22), transparent 30%), radial-gradient(circle at 90% 70%, rgba(212,160,23,0.16), transparent 32%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="mx-auto max-w-3xl text-center">
          {/* 49 — Heading */}
          <h1 className="font-serif text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
            Your Career Map
          </h1>

          {/* 50 — Supporting subtext */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-beige/75 sm:text-base">
            Based on your journey, these paths may be worth exploring.
          </p>

          {/* 51 — Top Match label */}
          <section className="map-paper mt-8 rounded-xl px-5 py-6 sm:px-8">
            <p className="map-ribbon text-xs font-extrabold tracking-[0.16em] uppercase">
              Top Match
            </p>
            <div className="mt-2 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <h2 className="font-serif text-2xl text-[#3b261c] text-balance sm:text-3xl">
                {topCategory.label}
              </h2>
              <span className="rounded-full bg-gold px-4 py-1.5 text-lg font-bold text-navy">
                {topCategory.percentage}%
              </span>
            </div>
          </section>
        </header>

        {/* 52 — Ranked course card list */}
        <section className="mt-10" aria-labelledby="recommended-paths-heading">
          <h2
            id="recommended-paths-heading"
            className="font-serif text-2xl sm:text-3xl"
          >
            Recommended Paths
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {rankedCourses.map((course, index) => (
              <Card
                key={course.courseId}
                as="article"
                className="flex max-w-none flex-col rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-teal uppercase">
                      Path {index + 1}
                    </p>
                    <h3 className="mt-2 font-serif text-xl leading-tight sm:text-2xl">
                      {course.courseName}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full border border-gold/55 bg-gold/10 px-3 py-1 text-sm font-bold text-gold">
                    {course.matchPercentage}%
                  </span>
                </div>
                <p className="mt-4 flex-1 text-sm leading-6 text-beige/70">
                  {overviewExcerpt(course.details?.overview)}
                </p>
                <Button
                  label="Explore This Course"
                  href={`/results/${course.courseId}`}
                  variant="secondary"
                  className="mt-6 inline-flex w-full items-center justify-center sm:w-fit"
                />
              </Card>
            ))}
          </div>
        </section>

        {/* 53 — Guidance disclaimer */}
        <aside className="mx-auto mt-10 max-w-3xl rounded-2xl border border-teal/30 bg-teal/10 p-5 text-center text-sm leading-6 text-beige/80">
          This is a guidance tool, not a final decision — talk to your guidance
          counselor about what&apos;s right for you.
        </aside>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          {/* 54 — Back to Journey Map button */}
          <Button
            label="Back to Journey Map"
            href="/journey"
            variant="secondary"
            className="inline-flex w-full items-center justify-center sm:w-auto"
          />
          {/* 55 — Download My Explorer Report button */}
          <Button
            label="Download My Explorer Report"
            onClick={downloadReport}
            className="inline-flex w-full items-center justify-center sm:w-auto"
          />
        </div>
      </div>
    </main>
  );
}
