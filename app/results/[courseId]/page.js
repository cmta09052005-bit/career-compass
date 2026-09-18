
import Localized from "@/components/Localized";
import { notFound } from "next/navigation";
import Card from "@/components/Card";
import ScholarshipInfoBox from "@/components/ScholarshipInfoBox";
import courses from "@/data/explore-courses.json";
import courseCategories from "@/data/courses.json";
import YearLevelTip from "./YearLevelTip";
import FieldJournal from "./FieldJournal";

function studyFocus(overview) {
  const sentences = overview.match(/[^.!?]+[.!?]+/g) ?? [];
  return sentences.length > 1 ? sentences.slice(1).join(" ").trim() : overview;
}

export default async function CourseDetailPage({ params }) {
  const { courseId } = await params;
  const course = courses.find(entry => entry.courseId === courseId);
  if (!course) notFound();
  const categoryCode = courseCategories.find(entry => entry.courseId === courseId)?.category;

  return <FieldJournal key={courseId} course={{ courseId, courseName: course.courseName, category: course.category }} categoryCode={categoryCode}>
    <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
            <Localized as="h2" className="font-serif text-2xl">Overview</Localized>
            <Localized as="p" className="mt-4 text-sm leading-7 text-beige/75 sm:text-base">
              {course.overview}
            </Localized>
          </Card>

    <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
            <Localized as="h2" className="font-serif text-2xl">What You&apos;ll Study</Localized>
            <Localized as="p" className="mt-4 text-sm leading-7 text-beige/75 sm:text-base">
              {studyFocus(course.overview)}
            </Localized>
          </Card>

    <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
            <Localized as="h2" className="font-serif text-2xl">Where Can You Study?</Localized>
            <Localized as="ul" className="mt-5 space-y-3">
              {course.schools.map((school) => (
                <li
                  key={`${school.name}-${school.location}`}
                  className="rounded-xl border border-beige/15 bg-navy/35 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <Localized as="div">
                      <Localized as="h3" className="font-semibold text-beige">
                        {school.name}
                      </Localized>
                      <Localized as="p" className="mt-1 text-sm text-beige/65">
                        {school.location}
                      </Localized>
                      {school.notes && (
                        <Localized as="p" className="mt-1 text-sm text-beige/65">
                          {school.notes}
                        </Localized>
                      )}
                    </Localized>
                    <Localized as="span" className="w-fit rounded-full border border-teal/45 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                      {school.type}
                    </Localized>
                  </div>
                </li>
              ))}
            </Localized>
            {course.schoolNotes.map((note) => (
              <Localized as="p" key={note} className="mt-4 text-sm leading-7 text-beige/75 sm:text-base">
                {note}
              </Localized>
            ))}
          </Card>

    <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
            <Localized as="h2" className="font-serif text-2xl">
              Where Can This Path Lead?
            </Localized>
            <Localized as="ul" className="mt-5 space-y-3">
              {course.careerOpportunities.map(career => (
                <Localized as="li" key={career.jobTitle} className="journal-job">
                  {career.notes ? <details>
                    <summary><Localized as="span" className="journal-job-title">{career.jobTitle}</Localized><Localized as="span" className="journal-salary">{career.salaryRange}</Localized></summary>
                    <Localized as="p" className="journal-job-notes">{career.notes}</Localized>
                  </details> : <div className="journal-job-summary"><Localized as="span" className="journal-job-title">{career.jobTitle}</Localized><Localized as="span" className="journal-salary">{career.salaryRange}</Localized></div>}
                </Localized>
              ))}
            </Localized>

            {/* 61 — Career Outlook source and date */}
            {(course.salarySource || course.salaryAsOf) && <div className="mt-5 border-t border-beige/15 pt-4 text-xs leading-5 text-beige/55">
              <Localized as="p">Salary source: {course.salarySource}</Localized>
              <Localized as="p">Figures as of {course.salaryAsOf}</Localized>
            </div>}
          </Card>

    <Card className="mt-5 max-w-none rounded-2xl border-gold/35 bg-gold/10 p-5 sm:p-7">
          <Localized as="h2" className="font-serif text-2xl">Guidance Tips</Localized>
          <Localized as="p" className="mt-4 text-sm leading-7 text-beige/80 sm:text-base">
            {course.guidanceTips}
          </Localized>
          <YearLevelTip />
        </Card>
    <div className="journal-aid-content"><ScholarshipInfoBox />
    <Card className="mt-5 max-w-none rounded-2xl border-gold/35 bg-navy/45 p-5 sm:p-7">
          <Localized as="p" className="text-xs leading-5 text-beige/55 italic">
            Sources: RA 10931 / UniFAST (unifast.gov.ph) · DOST-SEI (sei.dost.gov.ph) · TESDA (tesda.gov.ph) · CHED (ched.gov.ph). Info verified against official government sources; LGU and school-based scholarships vary by locality, confirm directly with your local government or target school.
          </Localized>
        </Card></div>
  </FieldJournal>;
}
