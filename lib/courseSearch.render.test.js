import test from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CourseInfo from "../app/results/CourseInfo.js";
import master from "../data/v2/courses-master.json" with { type: "json" };
import { buildSearchIndex, searchCourses, countLabel, activeFilterLabel, filterOptions } from "./courseSearch.js";
import { resultLabels } from "./recommendations.js";
const index = buildSearchIndex(), ranked = master.map((c, i) => ({ ...c, rank: i + 1 }));
test("actual card info renders safe student strings with query/filter combinations and true ranks", () => {
  for (const options of [{ query: "nurse" }, { query: "teacher", sort: "lowest" }, { filters: { schoolTypes: ["private"], locations: ["province:Albay"] }, sort: "az" }, { filters: { groups: ["Computing"], locations: ["group:bicol"] } }, { filters: { schoolTypes: filterOptions().schoolTypes.map(t => t.id) } }]) {
    const courses = searchCourses(ranked, index, options);
    assert.ok(courses.length);
    const html = renderToStaticMarkup(h("div", null, h("p", null, countLabel(courses.length)), h("p", null, activeFilterLabel(options.filters || {})), ...courses.map(c => h("article", { key: c.id }, h("p", null, resultLabels(c).rank), h("h3", null, c.name), h(CourseInfo, { course: c, info: c.info, hint: options.query ? c.searchMatch.hint : null })))));
    const text = html.replace(/<[^>]+>/g, " ").replace(/Rank #\d+/g, "");
    assert.doesNotMatch(text, /%|\b(?:score|points|rating)\s*[:=]?\s*\d|\b\d+(?:\.\d+)?\s*(?:points|percent)\b/i);
    assert.doesNotMatch(html, /<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<(?:a|button|input|select)\b/i);
    for (const c of courses) { assert.ok(html.includes(`Rank #${c.rank}`)); for (const tab of ["overview", "schools", "careers"]) assert.ok(html.includes(`/results/${c.id}#${tab}`)); }
  }
});
test("missing-school info is a neutral non-link and source titles are not shortened", () => {
  const html = renderToStaticMarkup(h(CourseInfo, { course: { id: "TEST", name: "Test" }, info: { overview: "Exact existing sentence.", school: null, job: "An exact career title with many words" } }));
  assert.ok(html.includes("No school on our list yet")); assert.ok(!html.includes("#schools"));
  assert.ok(html.includes("An exact career title with many words"));
  assert.equal((html.match(/<a /g) || []).length, 2);
});
