import { getCourseData, schoolLabel, schoolNotes } from "./courseDataV2.js";
const GROUPS = [
  { id: "bicol-public", name: "Bicol public universities and colleges", accepts: s => s.group === "bicol" && s.type === "public-suc" },
  { id: "bicol-community", name: "Bicol community colleges", accepts: s => s.group === "bicol" && s.type === "community-college" },
  { id: "bicol-private", name: "Bicol private schools", accepts: s => s.group === "bicol" && s.type === "private" },
  { id: "national", name: "National schools", accepts: s => s.group === "national" },
];
export const buildSchoolDetail = school => ({ id: school.id, school: school.school,
    ...(school.campus !== null ? { campus: school.campus } : {}),
    ...(school.location !== null ? { location: school.location } : {}),
    ...(school.province !== null ? { province: school.province } : {}),
    label: schoolLabel(school), notes: schoolNotes(school),
  });

export function buildCourseDetail(courseId) {
  const course = getCourseData(courseId);
  if (!course) return null;
  return {
    id: course.id, name: course.name, group: course.group,
    overview: course.overview, interestsStrengths: course.interestsStrengths, studyTopics: [...course.studyTopics],
    careers: course.careers.map(c => ({ title: c.jobTitle, salaryRange: c.salaryRange, notes: c.notes })),
    careerNotes: course.careerNotes.map(note => note.text),
    schools: GROUPS.map(group => ({ id: group.id, name: group.name, schools: course.schools.filter(group.accepts).map(buildSchoolDetail) })).filter(group => group.schools.length),
    chedBasis: course.chedBasis, guidanceTips: course.guidanceTips,
    salarySources: { methodology: course.salarySources.methodology, references: course.salarySources.references.map(({ label, url }) => ({ label, url })), updateNote: course.salarySources.updateNote },
  };
}
