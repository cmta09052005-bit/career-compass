import { readFile } from 'node:fs/promises';

const root = new URL('../data/v2/', import.meta.url);
const read = async (name) => JSON.parse(await readFile(new URL(name, root), 'utf8'));
try {
  const [courses, items, links, changes] = await Promise.all([
    read('courses-master.json'), read('items.json'), read('links.json'), read('applied-changes.json'),
  ]);
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  const unique = (values) => new Set(values).size === values.length;
  check(courses.length === 85 && unique(courses.map((c) => c.id)), 'Master must contain 85 unique course IDs');
  const courseIds = new Set(courses.map((c) => c.id));
  check(Object.keys(links).length === 85, 'Expected 85 course link records');
  for (const id of Object.keys(links)) check(courseIds.has(id), `Unknown course ${id}`);
  const banks = {
    interests: items.interests.flatMap((q) => q.options), skills: items.skills,
    oldSubjects: items.oldSubjects, certificates: items.certificates.filter((x) => x.scored),
    strand: items.strands.filter((x) => x.scored), coreSubject: items.coreSubjects,
    electives: items.electives.filter((x) => x.scored),
  };
  const expected = { interests: 32, skills: 15, oldSubjects: 19, certificates: 13, strand: 9, coreSubject: 4, electives: 70 };
  const ids = {};
  for (const [bank, rows] of Object.entries(banks)) {
    ids[bank] = new Set(rows.map((r) => r.id));
    check(rows.length === expected[bank] && ids[bank].size === rows.length, `${bank}: invalid item count or duplicate IDs`);
  }
  check(items.interests.length === 8 && items.interests.every((q) => q.options.length === 4), 'Expected 8 interest groups of 4');
  check(items.strands.length === 10, 'Expected 10 strands');
  const allItemIds = Object.values(items).filter(Array.isArray).flatMap((rows) => rows.flatMap((x) => [x.id, ...(x.options || []).map((option) => option.id)]));
  check(unique(allItemIds), 'Item IDs must be globally unique');
  const best = items.bestSubjects.coreSubjectIds;
  check(best.length === 4 && unique(best), 'Expected 4 unique core-subject choices');
  for (const id of items.bestSubjects.coreSubjectIds) check(ids.coreSubject.has(id), `Unknown best core ${id}`);
  for (const value of [0, 74.99, 75, 79.5, 80, 84.99, 85, 89.5, 90, 94.5, 95, 100]) {
    const tiers = items.gwaTiers.filter((tier) => (tier.lowerInclusive === null || value >= tier.lowerInclusive) && (value < tier.upperExclusive || (tier.upperInclusive === true && value === tier.upperExclusive)));
    check(tiers.length === 1, `GWA ${value}: expected exactly one tier`);
  }
  const counts = { interests: 2, skills: 2, oldSubjects: 2, certificates: 2, strand: 1, coreSubject: 1, electives: 5 };
  const strands = {};
  const electives = Object.fromEntries(banks.electives.map((x) => [x.id, 0]));
  for (const course of courses) {
    const row = links[course.id];
    check(!!row, `Missing links for ${course.id}`);
    if (!row) continue;
    for (const [bank, count] of Object.entries(counts)) {
      const values = ['strand', 'coreSubject'].includes(bank) ? [row[bank]] : row[bank];
      check(Array.isArray(values) && values.length === count && unique(values), `${course.id}: expected ${count} unique ${bank} links`);
      if (!Array.isArray(values)) continue;
      for (const value of values) check(ids[bank].has(value), `${course.id}: unknown/unscored ${bank} ID ${value}`);
    }
    check(new Set((row.interests || []).map((id) => id.slice(0, 6))).size === 2, `${course.id}: interests must belong to 2 questions`);
    strands[row.strand] = (strands[row.strand] || 0) + 1;
    for (const id of row.electives || []) electives[id] = (electives[id] || 0) + 1;
  }
  const target = { 'Academic STEM': 17, 'Academic ABM': 11, 'Academic HUMSS': 20, 'Academic GAS': 0, 'TVL ICT': 7, 'TVL Home Economics': 5, 'TVL Agri-Fishery Arts': 7, 'TVL Industrial Arts': 9, 'Arts and Design': 7, Sports: 2 };
  for (const strand of items.strands) check((strands[strand.id] || 0) === target[strand.text], `${strand.text}: expected ${target[strand.text]}, got ${strands[strand.id] || 0}`);
  const total = Object.values(electives).reduce((sum, n) => sum + n, 0);
  check(total === 425, `Expected 425 elective links, got ${total}`);
  for (const [id, n] of Object.entries(electives)) check(n > 0, `Elective ${id} has no courses`);
  check(changes.length === 22 && unique(changes.map((x) => x.courseId)), 'Expected all 22 Appendix B course replacements');
  for (const change of changes) {
    check(courseIds.has(change.courseId), `Unknown changed course ${change.courseId}`);
    for (const id of [...change.removed, ...change.added]) check(ids.electives.has(id), `Unknown change elective ${id}`);
    for (const id of change.removed) check(!links[change.courseId]?.electives.includes(id), `${change.courseId}: removed elective still present ${id}`);
    for (const id of change.added) check(links[change.courseId]?.electives.includes(id), `${change.courseId}: added elective absent ${id}`);
  }
  if (errors.length) {
    console.error(`FAIL: ${errors.length} verification error(s)\n${errors.join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log('PASS: 85 unique courses; all referenced IDs exist.');
    console.log('PASS: every course has 2 interests in different questions, 2 skills, 2 old subjects, 2 certificates, 1 non-GAS strand, 1 core subject, 5 electives.');
    console.log('PASS: Appendix A strand totals 17/11/20/7/5/7/9/7/2; GAS 0.');
    console.log('PASS: 425 elective links; all 70 scored rows covered; all 22 Appendix B replacements applied.');
    console.log('NOTE: 8 interest question prompts are NOT DETERMINED in the supplied rubric; structural verification does not establish content completeness or Rank 1 reachability.');
  }
} catch (error) {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
}
