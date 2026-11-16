import { getCourseData, schoolLabel, schoolNotes } from "./courseDataV2.js";
import { TYPE_LABELS } from "./courseSearch.js";
export const buildSchoolDetail = school => ({ id: school.id, school: school.school,
    ...(school.campus !== null ? { campus: school.campus } : {}),
    ...(school.location !== null ? { location: school.location } : {}),
    ...(school.province !== null ? { province: school.province } : {}),
    label: schoolLabel(school), notes: schoolNotes(school), typeLabel: TYPE_LABELS[school.type],
  });

export function buildCourseDetail(courseId) {
  const course = getCourseData(courseId);
  if (!course) return null;
  return {
    id: course.id, name: course.name, group: course.group,
    overview: course.overview, interestsStrengths: course.interestsStrengths, studyTopics: [...course.studyTopics],
    careers: course.careers.map(c => ({ title: c.jobTitle, salaryRange: c.salaryRange, notes: c.notes })),
    careerNotes: course.careerNotes.map(note => note.text),
    schools: course.schools.map(buildSchoolDetail),
    chedBasis: course.chedBasis, guidanceTips: course.guidanceTips,
    salarySources: { methodology: course.salarySources.methodology, references: course.salarySources.references.map(({ label, url }) => ({ label, url })), updateNote: course.salarySources.updateNote },
  };
}
