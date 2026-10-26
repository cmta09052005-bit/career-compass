import master from "../data/v2/courses-master.json" with { type: "json" };
import details from "../data/v2/course-details.json" with { type: "json" };
import schools from "../data/v2/schools.json" with { type: "json" };
import byCourse from "../data/v2/schools-by-course.json" with { type: "json" };
import salarySources from "../data/v2/salary-sources.json" with { type: "json" };
import { sortSchoolsByProximity } from "./schoolProximity.js";
const masters = new Map(master.map(course => [course.id, course]));
const schoolMap = new Map(schools.map(school => [school.id, school]));
const SCHOOL_FLAG_NOTES = { partial: "Partial program list", "weak-source": "Limited source reliability", outdated: "Information may be outdated", unverified: "Confirm program availability", "derived-location": "Location inferred from the town name", "new-program": "New program; confirm availability" };
export function schoolNotes(school) {
  return school.flags.filter(flag => flag !== "derived-location" || school.type === "community-college").map(flag => SCHOOL_FLAG_NOTES[flag]).filter(Boolean);
}
export function schoolLabel(school) {
  const parts=[];
  for (const value of [school.school,school.campus,school.location,school.province]) {
    if (!value) continue;
    if (!parts.length) { parts.push(value); continue; }
    const seen=parts.flatMap(part=>part.split(/\s+-\s+|,\s*/)).map(part=>part.trim().toLocaleLowerCase("en"));
    const segments=value.split(/\s+-\s+|,\s*/);
    const additions=segments.filter(part=>!seen.includes(part.trim().toLocaleLowerCase("en")));
    if (additions.length) parts.push(additions.length === segments.length ? value : additions.join(", "));
  }
  return parts.join(" - ");
}
export const getCourseMaster = id => masters.get(id) || null;
export const getCourseDetails = id => details[id] || null;
export const getCourseCareers = id => details[id]?.careers || [];
export const getCourseCareerNotes = id => details[id]?.careerNotes || [];
export const getCourseSchools = id => sortSchoolsByProximity((byCourse[id] || []).map(schoolId => schoolMap.get(schoolId)).filter(school => school?.courseIds.includes(id)), id);
export const getSalarySources = () => salarySources;
export function getCourseData(id) {
  const course = getCourseMaster(id);
  return course ? { ...course, ...getCourseDetails(id), careers: getCourseCareers(id), careerNotes: getCourseCareerNotes(id), schools: getCourseSchools(id), salarySources } : null;
}
