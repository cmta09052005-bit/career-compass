import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CourseInfo from "../app/results/CourseInfo.js";
import master from "../data/v2/courses-master.json" with { type: "json" };
import { buildSearchIndex, searchCourses, countLabel, activeFilterLabel, filterOptions, cardInfoFor } from "./courseSearch.js";
import { resultLabels } from "./recommendations.js";
import { translate } from "./i18n/translate.js";
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
  const course = { id: "TEST", name: "Test", overview: "Exact existing sentence.", schools: [], careers: ["An exact career title with many words"] };
  const html = renderToStaticMarkup(h(CourseInfo, { course, info: cardInfoFor(course) }));
  assert.ok(html.includes("No school on our list yet")); assert.ok(!html.includes("#schools"));
  assert.ok(html.includes("An exact career title with many words"));
  assert.equal((html.match(/<a /g) || []).length, 2);
});

test("one careers link shows up to two full titles in both languages", () => {
  const long = "An exact career title with many words";
  const cases = [
    [[long], long, long],
    [[long, "Staff nurse"], `Staff nurse, ${long}`, `Staff nurse; ${long}`],
    [[long, "Staff nurse", "Research nurse"], `Staff nurse, ${long}, ...`, `Staff nurse; ${long}; Research nurse`],
  ];
  for (const [careers, expected, title] of cases) {
    const course = { id: "TEST", name: "Test", overview: "Overview text", schools: [], careers };
    const info = cardInfoFor(course);
    for (const [language, label] of [["en", "Careers"], ["fil", "Mga Trabaho"]]) {
      const html = renderToStaticMarkup(h(CourseInfo, { course, info, t: value => translate(value, language) }));
      const links = [...html.matchAll(/<a\b(?=[^>]*\bhref="\/results\/TEST#careers")[^>]*\btitle="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
      assert.equal(links.length, 1);
      assert.equal(links[0][1], title);
      assert.equal(links[0][2], expected);
      assert.ok(html.includes(`>${label}</span>`));
    }
  }
});

test("school and career links can wrap, with CSS ellipsis reserved for the overview", async () => {
  const css = await readFile(new URL("../app/results/results.css", import.meta.url), "utf8");
  assert.match(css, /\.course-info a\s*\{[^}]*overflow-wrap:anywhere/);
  const linkRules = [...css.matchAll(/(\.course-info a[^{}]*)\{([^{}]*)\}/g)];
  const truncating = linkRules.filter(([, , styles]) => /text-overflow\s*:\s*ellipsis|white-space\s*:\s*nowrap/.test(styles));
  assert.deepEqual(truncating.map(([, selector]) => selector.trim()), ['.course-info a[href$="#overview"]']);
});

test("the school link shows up to three names in proximity order in both languages", () => {
  const course = { id: "TEST", name: "Test", overview: "Overview text", careers: ["Career text"] };
  const far = { id: "SCH-039", school: "University of the Philippines Diliman", shortName: "UP Diliman" };
  const near = { id: "SCH-007", school: "Bicol University Polangui", shortName: "BU Polangui" };
  const fallback = { id: "SCH-040", school: "University of the Philippines Los Baños" };
  const fourth = { id: "extra", school: "Fourth School", shortName: "Fourth" };
  const cases = [
    [[near], "BU Polangui"],
    [[far, near], "BU Polangui, UP Diliman"],
    [[far, near, fourth], "BU Polangui, UP Diliman, Fourth"],
    [[far, near, fallback, fourth], "BU Polangui, University of the Philippines Los Baños, UP Diliman, ..."],
  ];
  for (const [schools, expected] of cases) {
    const info = cardInfoFor({ ...course, schools });
    assert.equal(info.school.id, near.id);
    for (const [language, label] of [["en", "Schools"], ["fil", "Mga Paaralan"]]) {
      const html = renderToStaticMarkup(h(CourseInfo, { course, info, t: value => translate(value, language) }));
      const links = [...html.matchAll(/<a\b(?=[^>]*\bhref="\/results\/TEST#schools")[^>]*\btitle="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
      assert.equal(links.length, 1);
      assert.equal(links[0][2], expected);
      assert.equal(links[0][1].split("; ")[0], near.school);
      for (const school of schools) assert.ok(links[0][1].includes(school.school));
      assert.ok(html.includes(`>${label}</span>`));
    }
  }
});

test("school filters retain the selected school first, with other course schools following", () => {
  const course = index.find(({ id }) => id === "ICT01");
  const filters = { schoolTypes: ["private"] };
  const info = cardInfoFor(course, filters);
  assert.notEqual(info.school.id, "SCH-007");
  assert.equal(info.schoolPreview.names[0], course.schools.find(({ id }) => id === info.school.id).shortName);
  assert.equal(info.schoolPreview.names[1], "BU Polangui");
});
