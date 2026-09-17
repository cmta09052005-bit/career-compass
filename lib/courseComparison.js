// Selection order is retained so a third course replaces the oldest selection.
export function toggleCourseComparison(current = [], courseId) {
  return current.includes(courseId)
    ? current.filter(id => id !== courseId)
    : [...current.slice(-1), courseId];
}
