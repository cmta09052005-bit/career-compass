import Localized from "@/components/Localized";
import { notFound } from "next/navigation";
import Card from "@/components/Card";
import ScholarshipInfoBox from "@/components/ScholarshipInfoBox";
import master from "@/data/v2/courses-master.json";
import { buildCourseDetail } from "@/lib/courseDetailModel";
import YearLevelTip from "./YearLevelTip";
import FieldJournal from "./FieldJournal";

export const dynamicParams = false;
export function generateStaticParams() { return master.map(({ id }) => ({ courseId: id })); }
export default async function CourseDetailPage({ params }) {
  const { courseId } = await params;
  const course = buildCourseDetail(courseId);
  if (!course) notFound();
  return <FieldJournal key={courseId} course={{ courseId: course.id, courseName: course.name, group: course.group }}>
    <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
      <Localized as="h2" className="font-serif text-2xl">Overview</Localized>
      <Localized as="p" className="mt-4 text-sm leading-7 text-beige/75 sm:text-base">{course.overview}</Localized>
      <Localized as="h3" className="mt-5 font-semibold">Interests and strengths</Localized>
      <Localized as="p" className="mt-2 text-sm leading-7">{course.interestsStrengths}</Localized>
      <Localized as="p" className="mt-4 text-sm">{course.group}</Localized>
      <Localized as="p" className="mt-2 text-xs">CHED basis: {course.chedBasis}</Localized>
    </Card>
    <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
      <Localized as="h2" className="font-serif text-2xl">What You&apos;ll Study</Localized>
      <ul className="mt-4 list-disc space-y-3 pl-5">{course.studyTopics.map((topic,index)=><Localized as="li" key={index}>{index===course.studyTopics.length-1?topic.replace(/\.$/,""):topic}</Localized>)}</ul>
    </Card>
    <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
      <Localized as="h2" className="font-serif text-2xl">Where Can You Study?</Localized>
      {course.schools.map(group=><section key={group.id} className="mt-5"><Localized as="h3" className="font-semibold">{group.name}</Localized><ul className="mt-3 space-y-3">{group.schools.map(school=><li key={school.id} className="rounded-xl border border-beige/15 bg-navy/35 p-4"><Localized as="h4" className="font-semibold">{school.label}</Localized>{school.notes.map(note=><Localized as="p" key={note} className="mt-1 text-sm">{note}</Localized>)}</li>)}</ul></section>)}
      <Localized as="p" className="mt-5 text-sm leading-7">School lists are not complete. Confirm programs, campus availability and admission requirements with the school.</Localized>
    </Card>
    <Card className="max-w-none rounded-2xl border-beige/20 bg-navy/45 p-5 sm:p-7">
      <Localized as="h2" className="font-serif text-2xl">Where Can This Path Lead?</Localized>
      <ul className="mt-5 space-y-3">{course.careers.map((career,index)=><Localized as="li" key={index} className="journal-job">{career.notes?<details><summary><Localized as="span" className="journal-job-title">{career.title}</Localized><Localized as="span" className="journal-salary">{career.salaryRange}</Localized></summary><Localized as="p" className="journal-job-notes">{career.notes}</Localized></details>:<div className="journal-job-summary"><Localized as="span" className="journal-job-title">{career.title}</Localized><Localized as="span" className="journal-salary">{career.salaryRange}</Localized></div>}</Localized>)}</ul>
      {course.careerNotes.map((note,index)=><Localized as="p" key={index} className="mt-4 text-sm leading-7">{note}</Localized>)}
      <Localized as="p" className="mt-5 text-xs leading-5">Salary estimates: Jobstreet Philippines career salary benchmarks. Updated October 2026.</Localized>
      <details className="journal-salary-method mt-4"><Localized as="summary">How these salaries were estimated</Localized><Localized as="p" className="mt-3 text-sm leading-7">{course.salarySources.methodology}</Localized><ul className="mt-3 space-y-2">{course.salarySources.references.map(source=><li key={source.url}><Localized as="a" href={source.url} target="_blank" rel="noopener noreferrer" className="underline">{source.label}</Localized></li>)}</ul><Localized as="p" className="mt-3 text-xs leading-5">{course.salarySources.updateNote}</Localized></details>
    </Card>
    <Card className="mt-5 max-w-none rounded-2xl border-gold/35 bg-gold/10 p-5 sm:p-7"><Localized as="h2" className="font-serif text-2xl">Guidance Tips</Localized><Localized as="p" className="mt-4 text-sm leading-7 text-beige/80 sm:text-base">{course.guidanceTips}</Localized><YearLevelTip /></Card>
    <div className="journal-aid-content"><ScholarshipInfoBox />
    <Card className="mt-5 max-w-none rounded-2xl border-gold/35 bg-navy/45 p-5 sm:p-7">
          <Localized as="p" className="text-xs leading-5 text-beige/55 italic">
            Sources: RA 10931 / UniFAST (unifast.gov.ph) · DOST-SEI (sei.dost.gov.ph) · TESDA (tesda.gov.ph) · CHED (ched.gov.ph). Info verified against official government sources; LGU and school-based scholarships vary by locality, confirm directly with your local government or target school.
          </Localized>
        </Card></div>
  </FieldJournal>;
}
