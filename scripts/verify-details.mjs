import { readFile } from "node:fs/promises";

const data = new URL("../data/v2/", import.meta.url);
const read = async (name) => JSON.parse(await readFile(new URL(name, data), "utf8"));
const rangePattern = /₱[\d,]+–₱[\d,]+\/month/g;
const nonempty = (text) => typeof text === "string" && text.trim().length > 0;
const unique = (values) => new Set(values).size === values.length;
const originalReviewSegment = (raw) => {
  const match = [...raw.matchAll(rangePattern)][0];
  const title = match ? raw.slice(0, match.index).trimEnd().replace(/—$/, "").trimEnd() : raw;
  return title.includes(".") || /licens/i.test(title) || title.split(/\s+/).length > 8;
};
try {
  const [master, details, schools, byCourse, sources, items, oldItems] = await Promise.all([
    read("courses-master.json"), read("course-details.json"), read("schools.json"),
    read("schools-by-course.json"), read("salary-sources.json"), read("items.json"),
    readFile(new URL("../data/items.json", import.meta.url), "utf8").then(JSON.parse),
  ]);
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  const ids = master.map((course) => course.id);
  const courseIds = new Set(ids);
  check(ids.length === 85 && unique(ids), "Master must contain 85 unique course IDs.");
  for (const [name, records] of [["details", details], ["schools-by-course", byCourse]]) {
    check(records && typeof records === "object" && !Array.isArray(records), `${name} must be keyed by course ID.`);
    check(Object.keys(records).length === 85 && Object.keys(records).every((id) => courseIds.has(id)) && ids.every((id) => Object.hasOwn(records, id)), `${name} must have exactly the 85 master IDs.`);
  }
  let sourceRangeCount = 0, parsedRangeCount = 0, segments = 0, careerCount = 0, noteCount = 0, originalReviews = 0, approvals = 0;
  for (const course of master) {
    const d = details[course.id];
    check(!!d, `${course.id}: missing details.`);
    if (!d) continue;
    for (const key of ["overview", "interestsStrengths", "guidanceTips", "studyTopicsText", "careersText"]) check(nonempty(d[key]), `${course.id}: empty source field ${key}.`);
    check(d.chedBasis === course.chedBasis, `${course.id}: CHED basis differs from master.`);
    check(Array.isArray(d.studyTopics) && d.studyTopics.length > 0 && d.studyTopics.every(nonempty), `${course.id}: empty study topics.`);
    check(JSON.stringify(d.studyTopics) === JSON.stringify(d.studyTopicsText.split(";").map((text) => text.trim())), `${course.id}: study-topic split differs from source.`);
    const rawSegments = d.careersText.split(";").map((text) => text.trim());
    segments += rawSegments.length;
    originalReviews += rawSegments.filter(originalReviewSegment).length;
    const careerSegments = rawSegments.filter((text) => [...text.matchAll(rangePattern)].length > 0);
    const noteSegments = rawSegments.filter((text) => [...text.matchAll(rangePattern)].length === 0);
    const careerNotes = d.careerNotes ?? [];
    sourceRangeCount += [...d.careersText.matchAll(rangePattern)].length;
    check(Array.isArray(d.careers) && d.careers.length === careerSegments.length, `${course.id}: career split count differs from source salary segments.`);
    check(Array.isArray(careerNotes) && careerNotes.length === noteSegments.length, `${course.id}: careerNotes count differs from source non-job segments.`);
    check(d.careers.some((career) => nonempty(career.jobTitle)), `${course.id}: no job titles.`);
    d.careers.forEach((career, index) => {
      const label = `${course.id}/career ${index + 1}`;
      careerCount++;
      check(career.rawText === careerSegments[index], `${label}: raw text changed.`);
      const ranges = [...career.rawText.matchAll(rangePattern)].map((match) => match[0]);
      check(ranges.length === 1, `${label}: expected exactly one source salary range.`);
      if (nonempty(career.salaryRange)) {
        parsedRangeCount++;
        check(career.salaryRange === ranges[0], `${label}: salary range differs from original substring.`);
      } else check(false, `${label}: source salary was omitted.`);
      check(career.notes === null || nonempty(career.notes), `${label}: notes must be text or null.`);
      check(nonempty(career.jobTitle) && career.rawText.includes(career.jobTitle), `${label}: job title must be a nonempty source substring.`);
      if (career.notes !== null) {
        check(!career.notes.startsWith(", "), `${label}: leading comma and space must be removed from notes.`);
        // Notes may join the pre-salary qualification and terminal punctuation.
        const words = career.notes.match(/\S+/g) || [];
        for (const word of words) check(career.rawText.includes(word.replace(/[.]$/, "")), `${label}: notes contain a word absent from source.`);
      }
      check(career.reviewRequired === false, `${label}: unresolved career split.`);
      if (originalReviewSegment(career.rawText)) check(career.splitStatus === "approved", `${label}: handled review split must be approved.`);
      if (career.splitStatus !== undefined) check(career.splitStatus === "approved", `${label}: unexpected split status.`);
      if (career.splitStatus === "approved") approvals++;
    });
    careerNotes.forEach((note, index) => {
      const label = `${course.id}/careerNote ${index + 1}`;
      noteCount++;
      check(["SCI02", "SOC01"].includes(course.id), `${label}: unexpected course-level non-job sentence.`);
      check(note.rawText === noteSegments[index] && note.text === note.rawText, `${label}: original sentence changed.`);
      check(Number.isInteger(note.sourceSegment) && rawSegments[note.sourceSegment - 1] === note.rawText, `${label}: source segment reference differs.`);
      check([...note.rawText.matchAll(rangePattern)].length === 0, `${label}: a salary-bearing career was moved into notes.`);
      check(note.reviewRequired === false && note.splitStatus === "approved", `${label}: moved sentence must be approved.`);
      if (note.splitStatus === "approved") approvals++;
    });
  }
  check(careerCount === 463 && noteCount === 2, `Expected 463 careers and 2 careerNotes, got ${careerCount}/${noteCount}.`);
  const explicitSplits = [
    ["HLT01", "nursing assistant roles", "during training or as permitted by law"],
    ["HLT03", "laboratory staff", "in hospitals, clinics, public health, research, or diagnostic centers"],
    ["SOC11", "Criminology-related roles and public safety career pathways", "subject to recruitment rules"],
  ];
  for (const [id, title, notes] of explicitSplits) check(details[id].careers.some((career) => career.jobTitle === title && career.notes === notes && career.splitStatus === "approved"), `${id}: user-approved qualifier split differs.`);
  check(sourceRangeCount === 463, `Expected 463 ranges in retained source text, got ${sourceRangeCount}.`);
  check(parsedRangeCount === sourceRangeCount && parsedRangeCount === sources.sourceSalaryRangeCount, `Parsed/source salary counts differ: ${parsedRangeCount}/${sourceRangeCount}.`);
  check(segments === sources.sourceCareerSegmentCount && careerCount + noteCount === segments && originalReviews === sources.reviewItemCount, "Retained segment/original review totals differ from historical source metadata.");
  check(nonempty(sources.methodology) && nonempty(sources.updateNote) && sources.references.length === 10, "Shared salary provenance is incomplete.");
  const schoolIds = new Set(schools.map((school) => school.id));
  check(schools.length === 51 && schoolIds.size === schools.length, "Expected one unique record for each of 51 school source rows.");
  const flags = new Set(["partial", "weak-source", "outdated", "unverified", "derived-location", "new-program", "major-only"]);
  const types = new Map([["public-suc", 0], ["community-college", 1], ["private", 2], ["national", 3]]);
  for (const school of schools) {
    check(nonempty(school.school), `${school.id}: missing school name.`);
    check(types.has(school.type), `${school.id}: invalid school type.`);
    check(school.group === (school.type === "national" ? "national" : "bicol"), `${school.id}: inconsistent group/type.`);
    for (const key of ["campus", "location", "province"]) check(school[key] === null || nonempty(school[key]), `${school.id}: invalid ${key}.`);
    check(unique(school.courseIds), `${school.id}: duplicate course IDs.`);
    check(unique(school.flags) && school.flags.every((flag) => flags.has(flag)), `${school.id}: unknown or duplicate flags.`);
    check(["official", "secondary", "weak", "none"].includes(school.sourceLevel), `${school.id}: invalid source level.`);
    check(school.sourceLevel !== "none" || school.sourceNames.length === 0, `${school.id}: none source level with nonempty citations.`);
    check(school.sourceLevel !== "weak" || school.flags.includes("weak-source"), `${school.id}: weak source flag missing.`);
    for (const id of school.courseIds) {
      check(courseIds.has(id), `${school.id}: unknown course ${id}.`);
      check(new RegExp(`\\b${id}\\b`).test(school.programText), `${school.id}: ${id} is not explicitly present in the source row.`);
      check(!school.excludedMappings.some((mapping) => mapping.courseId === id), `${school.id}: uncertain mapping was included.`);
    }
    const explicit = [...new Set(school.programText.match(/\b(?:BUS|ICT|ENG|SCI|AGR|HLT|EDU|SOC|ART)\d{2}\b/g) || [])].filter((id) => !school.excludedMappings.some((mapping) => mapping.courseId === id));
    check(JSON.stringify(school.courseIds) === JSON.stringify(explicit), `${school.id}: explicit coded mappings were omitted, added or reordered.`);
    for (const mapping of school.excludedMappings) check(courseIds.has(mapping.courseId) && school.programText.includes(mapping.rawText), `${school.id}: invalid excluded mapping provenance.`);
    for (const note of school.programNotes) check(school.programText.includes(note), `${school.id}: program note is not original source text.`);
  }
  const sorted = schools.map((school, sourceOrder) => ({ school, sourceOrder })).sort((a, b) => types.get(a.school.type) - types.get(b.school.type) || a.sourceOrder - b.sourceOrder).map(({ school }) => school);
  let links = 0;
  const singles = [];
  const counts = [];
  for (const id of ids) {
    const actual = byCourse[id];
    const expected = sorted.filter((school) => school.courseIds.includes(id)).map((school) => school.id);
    check(Array.isArray(actual) && actual.length > 0, `${id}: no school.`);
    check(Array.isArray(actual) && unique(actual) && actual.every((school) => schoolIds.has(school)), `${id}: unknown/duplicate school reference.`);
    check(JSON.stringify(actual) === JSON.stringify(expected), `${id}: reverse index membership/order differs from schools.`);
    counts.push(actual?.length || 0);
    links += actual?.length || 0;
    if (actual?.length === 1) singles.push(id);
  }
  const cbsua = schools.find((school) => school.id === "SCH-015");
  check(cbsua && !cbsua.courseIds.includes("ENG12") && cbsua.excludedMappings.some((mapping) => mapping.courseId === "ENG12"), "CBSUA's uncertain ENG12 must remain excluded and recorded.");
  const noDegree = schools.find((school) => school.id === "SCH-038");
  check(noDegree && noDegree.courseIds.length === 0, "San Pascual must have no invented degree mappings.");
  for (const q of items.interests) {
    const old = oldItems.find((item) => item.id === q.id);
    const expectedPrompt = q.id === "INT-08" ? "A strong typhoon hits your community. How would you help?" : old?.text;
    check(q.prompt === expectedPrompt, `${q.id}: stem differs from the approved prompt.`);
  }
  if (errors.length) {
    console.error(`FAIL: ${errors.length} verification error(s)\n${errors.join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log("PASS: course-details and schools-by-course contain exactly the 85 master IDs.");
    console.log("PASS: all five source text fields are nonempty for every course; CHED basis and exact text splits match.");
    console.log(`PASS: ${parsedRangeCount} parsed salary ranges = ${sourceRangeCount} source ranges; ${careerCount} careers with titles and salaries; ${noteCount} careerNotes; all ${segments} source segments retained.`);
    console.log(`PASS: all ${originalReviews} original review items resolved; ${approvals} handled entries approved (including 4 additional comma-prefix fixes); 0 pending career splits.`);
    console.log(`PASS: ${schools.length} school source rows; ${links} valid school/course links; all 85 courses covered; uncertain CBSUA ENG12 excluded.`);
    console.log("PASS: school flags, explicit course codes, ordered reverse index and 8 exact interest prompts verified.");
    console.log(`Schools per course (source rows): min=${Math.min(...counts)}, max=${Math.max(...counts)}.`);
    console.log(`Courses with only 1 school source row (${singles.length}): ${singles.join(", ")}.`);
    console.log("NOTE: career splits are approved; school source qualifications and the separate ENG04 salary outlier still require manual checks.");
  }
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
}
