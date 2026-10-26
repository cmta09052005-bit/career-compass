import { fromSession } from "./scoringV2/fromSession.js";
import { rankCourses } from "./scoringV2/rank.js";
import { getCourseMaster } from "./courseDataV2.js";
export function buildRecommendations(session) {
  const result = fromSession(session);
  if (!result.ok) return { ok: false, ranked: [], errors: result.errors };
  return { ok: true, ranked: rankCourses(result.answers).map((course, index) => ({ ...course, group: getCourseMaster(course.id).group, rank: index + 1 })), errors: [] };
}
// DRAFT visual rule. The same full ranking supplies the anchors in either list view.
export function arcStrength(course, ranked) {
  const first = ranked[0]?.total, fifth = ranked[4]?.total;
  if (first === fifth) return 95;
  return Math.max(15, Math.min(95, 30 + 65 * (course.total - fifth) / (first - fifth)));
}
export function resultLabels(course) {
  return { rank: `Rank #${course.rank}`, title: course.name, group: course.group, arc: "Relative match strength", tooltip: "Arc shows relative strength among these matches" };
}
