"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import courses from "@/data/courses.json";
import {
calculateCategoryScores,
calculateMatchPercentages,
createRecommendationResult,
formatMatchPercent,
} from "@/lib/scoringEngine";
import { useSessionAnswers } from "@/lib/useSessionAnswers";

export default function ResultsPage() {
const [showAllCourses, setShowAllCourses] = useState(false);
const { answers, isReady } = useSessionAnswers();

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
: topCourses.slice(0, 5);

if (!isReady) {
return ( <main className="explorer-map-screen relative flex min-h-screen items-center justify-center px-4 text-beige"> <p
       role="status"
       className="text-sm tracking-[0.18em] text-gold uppercase"
     >
Restoring your career map... </p> </main>
);
}

return ( <main className="explorer-map-screen relative min-h-screen overflow-hidden px-4 py-12 text-beige sm:px-6 lg:py-16">
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
        These courses are ranked from strongest to weakest match based on
        your interests, skills, and academic profile.
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

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {displayedCourses.map((course, index) => (
          <Card
            key={course.courseId}
            as="article"
            className="flex max-w-none flex-col rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-teal uppercase">
                  Rank #{index + 1}
                </p>

                <h3 className="mt-2 font-serif text-xl leading-tight sm:text-2xl">
                  {course.courseId} – {course.courseName}
                </h3>

                <span className="mt-3 inline-flex rounded-full border border-teal/30 bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal">
                  {course.categoryName}
                </span>
              </div>

              <span
                className="shrink-0 rounded-full border border-gold/55 bg-gold/10 px-3 py-1 text-sm font-bold text-gold"
                title={
                  course.displayTieAdjustment
                    ? `Calculated match: ${formatMatchPercent(course.calculatedCourseMatchPercent)}%. Display separated by hundredths to distinguish tied ranks.`
                    : `Calculated match: ${formatMatchPercent(course.calculatedCourseMatchPercent)}%.`
                }
              >
                {formatMatchPercent(course.finalCourseMatchPercent)}%
              </span>
            </div>

            <Button
              label="Explore This Course"
              href={`/results/${course.courseId}`}
              variant="secondary"
              className="mt-6 inline-flex w-full items-center justify-center sm:w-fit"
            />
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          label={showAllCourses ? "Show Top 5 Only" : "See All 24 Courses"}
          onClick={() => setShowAllCourses((current) => !current)}
          variant="secondary"
          className="inline-flex w-full items-center justify-center sm:w-auto"
        />
      </div>
    </section>

    {result.strongestCategory ? (
      <aside className="mx-auto mt-8 max-w-3xl rounded-2xl border border-beige/15 bg-navy/35 p-4 text-center text-sm text-beige/70">
        Your strongest field was{" "}
        <span className="font-semibold text-beige">
          {result.strongestCategory.label}
        </span>{" "}
        at {result.strongestCategory.percentage}%. This is supporting
        context; your ranked courses above are the primary result.
      </aside>
    ) : null}

    {/* 53 — Guidance disclaimer */}
    <aside className="mx-auto mt-10 max-w-3xl rounded-2xl border border-teal/30 bg-teal/10 p-5 text-center text-sm leading-6 text-beige/80">
      This is a guidance tool, not a final decision — talk to your guidance
      counselor about what&apos;s right for you.
    </aside>

    <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-beige/70">
      Download your report before closing this tab — your answers are not
      saved anywhere else.
    </p>

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
        href="/report"
        className="inline-flex w-full items-center justify-center sm:w-auto"
      />
    </div>
  </div>
</main>

);
}
