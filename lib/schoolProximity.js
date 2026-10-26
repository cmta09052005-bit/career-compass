import locations from "../data/school-locations.json" with { type: "json" };

export const SCHOOL_DISTANCE_NOTE = "Approximate straight-line distances from Polangui Municipal Hall. Schools without a verified campus distance follow the distance-ordered schools.";
const validPoint = point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite) && Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180;
export function straightLineKm(from, to) {
  if (!validPoint(from) || !validPoint(to)) return null;
  const radians = degrees => degrees * Math.PI / 180;
  const [lat1, lon1] = from.map(radians), [lat2, lon2] = to.map(radians);
  const a = Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
}
export function schoolDistanceKm(school, courseId) {
  const point = locations.schools[school?.id];
  if (point?.unresolvedCourses?.includes(courseId)) return null;
  return straightLineKm(locations.origin.coordinates, school?.coordinates ?? point?.coordinates);
}
export function sortSchoolsByProximity(schools = [], courseId) {
  return schools.map((school, index) => ({ school, index, distance: schoolDistanceKm(school, courseId) }))
    .sort((a, b) => (a.distance === null) - (b.distance === null) || (a.distance ?? 0) - (b.distance ?? 0) || a.index - b.index)
    .map(({ school }) => school);
}
export function schoolDistanceLabel(school, courseId) {
  const distance = schoolDistanceKm(school, courseId);
  return distance === null ? "Campus distance not verified" : `About ${distance.toFixed(1)} km from Polangui`;
}
