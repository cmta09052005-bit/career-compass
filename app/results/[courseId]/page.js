import { notFound } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ScholarshipInfoBox from "@/components/ScholarshipInfoBox";
import courses from "@/data/explore-courses.json";
import YearLevelTip from "./YearLevelTip";

function studyFocus(overview) {
  const sentences = overview.match(/[^.!?]+[.!?]+/g) ?? [];
  return sentences.length > 1 ? sentences.slice(1).join(" ").trim() : overview;
}

export default async function CourseDetailPage({ params }) {
  const { courseId } = await params;
  const course = courses.find((entry) => entry.courseId === courseId);

  if (!course) notFound();

  return (
    <main className="game-ui-screen explorer-map-screen relative min-h-screen overflow-hidden px-4 py-12 text-beige sm:px-6 lg:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 12% 12%, rgba(45,191,184,0.2), transparent 28%), radial-gradient(circle at 88% 78%, rgba(212,160,23,0.16), transparent 30%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* 56 — Course title heading and Career Path label */}
        <header className="max-w-4xl">
          <p className="map-ribbon text-xs font-extrabold tracking-[0.16em] uppercase sm:text-sm">
            Discovered Career Path
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-balance sm:text-5xl md:text-6xl">
            {course.courseName}
          </h1>
          <p className="mt-3 text-sm font-semibold text-teal sm:text-base">
            {course.category} · {course.courseId}
          </p>
        </header>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* 57 — Overview section */}
          <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
            <h2 className="font-serif text-2xl">Overview</h2>
            <p className="mt-4 text-sm leading-7 text-beige/75 sm:text-base">
              {course.overview}
            </p>
          </Card>

          {/* 58 — What You'll Study section */}
          <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
            <h2 className="font-serif text-2xl">What You&apos;ll Study</h2>
            <p className="mt-4 text-sm leading-7 text-beige/75 sm:text-base">
              {studyFocus(course.overview)}
            </p>
          </Card>

          {/* 59 — Where Can You Study section */}
          <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
            <h2 className="font-serif text-2xl">Where Can You Study?</h2>
            <ul className="mt-5 space-y-3">
              {course.schools.map((school) => (
                <li
                  key={`${school.name}-${school.location}`}
                  className="rounded-xl border border-beige/15 bg-navy/35 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-beige">
                        {school.name}
                      </h3>
                      <p className="mt-1 text-sm text-beige/65">
                        {school.location}
                      </p>
                      {school.notes && (
                        <p className="mt-1 text-sm text-beige/65">
                          {school.notes}
                        </p>
                      )}
                    </div>
                    <span className="w-fit rounded-full border border-teal/45 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                      {school.type}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {course.schoolNotes.map((note) => (
              <p key={note} className="mt-4 text-sm leading-7 text-beige/75 sm:text-base">
                {note}
              </p>
            ))}
          </Card>

          {/* 60 — Where Can This Path Lead section */}
          <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
            <h2 className="font-serif text-2xl">
              Where Can This Path Lead?
            </h2>
            <ul className="mt-5 space-y-3">
              {course.careerOpportunities.map((career) => (
                <li
                  key={career.jobTitle}
                  className="rounded-xl border border-beige/15 bg-navy/35 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-beige">
                      {career.jobTitle}
                    </h3>
                    <span className="font-semibold text-gold">
                      {career.salaryRange}
                    </span>
                  </div>
                  {career.notes && (
                    <p className="mt-1 text-sm text-beige/65">
                      {career.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {/* 61 — Career Outlook source and date */}
            {(course.salarySource || course.salaryAsOf) && <div className="mt-5 border-t border-beige/15 pt-4 text-xs leading-5 text-beige/55">
              <p>Salary source: {course.salarySource}</p>
              <p>Figures as of {course.salaryAsOf}</p>
            </div>}
          </Card>
        </div>

        {/* 62 — Guidance Tips section */}
        <Card className="mt-5 max-w-none rounded-2xl border-gold/35 bg-gold/10 p-5 sm:p-7">
          <h2 className="font-serif text-2xl">Guidance Tips</h2>
          <p className="mt-4 text-sm leading-7 text-beige/80 sm:text-base">
            {course.guidanceTips}
          </p>
          <YearLevelTip />
        </Card>

        <ScholarshipInfoBox />

        <Card className="mt-5 max-w-none rounded-2xl border-gold/35 bg-navy/45 p-5 sm:p-7">
          <p className="text-xs leading-5 text-beige/55 italic">
            Sources: RA 10931 / UniFAST (unifast.gov.ph) · DOST-SEI (sei.dost.gov.ph) · TESDA (tesda.gov.ph) · CHED (ched.gov.ph). Info verified against official government sources; LGU and school-based scholarships vary by locality — confirm directly with your local government or target school.
          </p>
        </Card>

        {/* 63 — Back to Results button */}
        <div className="mt-8">
          <Button
            label="Back to Results"
            href="/results"
            variant="secondary"
            className="inline-flex w-full items-center justify-center sm:w-auto"
          />
        </div>
      </div>
    </main>
  );
}
