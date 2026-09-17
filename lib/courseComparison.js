export const COMPARISON_LIMIT_NOTICE = "You can compare only 2 courses at once. Deselect one before adding another.";
export function toggleCourseComparison(current = [], courseId) {
  return current.includes(courseId)
    ? current.filter(id => id !== courseId)
    : current.length < 2 ? [...current, courseId] : current;
}
