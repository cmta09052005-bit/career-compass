import { writeFile } from "node:fs/promises";
import { inventory } from "./i18n-missing.mjs";
import { translate } from "../lib/i18n/translate.js";
import ui from "../lib/i18n/fil-v2.js";
import content from "../lib/i18n/fil-v2-content.js";
const uncertain = [
  ["T1", "Limited source reliability", "Warning tone and source reliability terminology"],
  ["T1", "Which electives do you take and feel strongest in?", "Naturalness of strongest-in wording"],
  ["T1", "Trade skills (welding, electrical, automotive, drafting)", "Local technical-trade terminology"],
  ["T1", Object.keys(ui).find(x=>x.startsWith("Leadership and uniformed service")), "Certificate category terminology"],
  ["T1", Object.keys(ui).find(x=>x.includes("records, budgets")), "Long skills statement clarity"],
  ["T2", Object.keys(content).find(x=>x.startsWith("All amounts are estimated")), "Gross salary and benchmark methodology terminology"],
  ["T2", "Professional practice may require meeting applicable registration rules.", "Preserve conditional registration requirement"],
  ["T2", "after meeting applicable teacher qualification and licensure requirements", "Qualification and licensure wording"],
  ["T2", Object.keys(content).find(x=>x.startsWith("Human Services focuses")), "Institution-dependent professional scope wording"],
  ["T2", Object.keys(content).find(x=>x.startsWith("Anthropology studies")), "Technical anthropology approaches"],
];
if (uncertain.some(x=>!x[1])) throw Error("Uncertain entry source missing");
await writeFile(new URL("../docs/qa/i18n-uncertainties.json", import.meta.url), JSON.stringify(uncertain.map(([tier,english,reason])=>({tier,english,filipino:translate(english,"fil"),reason})),null,2)+"\n");
const r = await inventory();
await writeFile(new URL("../docs/i18n-missing.json", import.meta.url), JSON.stringify(r, null, 2) + "\n");
const groups = new Map();
for (const row of r.entries.filter(x => x.tier === "T1")) {
  const source = row.origins.find(x => /^(app|components)\//.test(x)) || row.origins[0];
  const group = source.replace(/:\d+$/, "").replace(/^(INT|SKL|CER|STR|SUB|ELE|COR)-?\d.*$/, "$1 assessment");
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push(row);
}
const entry = row => `\nEnglish: ${row.text}\n\nFilipino: ${translate(row.text, "fil")}\n\nStatus: ${Object.hasOwn(ui, row.text) || Object.hasOwn(content, row.text) ? "MACHINE DRAFT, owner review required" : "Catalog/grammar output; existing entries retained, all newly written wording is a MACHINE DRAFT"}.${row.text === translate(row.text, "fil") ? " Intentionally retained borrowed technical/academic term; review terminology." : ""}${uncertain.some(x=>x[1]===row.text) ? ` UNCERTAIN: ${uncertain.find(x=>x[1]===row.text)[2]}.` : ""}\n\nSources: ${row.origins.join(", ")}\n`;
let text = "# Filipino translation review\n\nAll new translations are MACHINE DRAFTS. No human approval is implied. Review each entry for naturalness and exact meaning before publication. Existing catalog files were retained. T3 terms are intentionally English, including official elective/core names, job titles, study topics, school/course names, CHED references, URLs and amounts.\n\n## Terminology needing particular review\n\n- School weak-source wording: ‘Limitado ang pagiging maaasahan ng pinagkunan’. Review tone without weakening the warning.\n- Technical skills, trade/certificate labels, and academic subject composites use common borrowed English terms. Confirm local classroom usage.\n- Course prose and licensure conditions are machine drafts, not professional or legal review. May/required and additional-training conditions must retain their source meaning.\n- Runtime templates retain numbered placeholders in this review; browser/PDF checks exercise populated forms.\n- Source salary estimates and October 2026 date are translated as supplied, without factual re-verification.\n\n## T1 by screen/source\n";
for (const [name, rows] of [...groups].sort(([a],[b]) => a.localeCompare(b))) text += `\n### ${name}\n` + rows.map(entry).join("\n");
text += "\n## T2 course prose and notes\n" + r.entries.filter(x => x.tier === "T2").map(entry).join("\n");
text += "\n## Ten least-certain entries\n\nExplicit uncertainty count: T1 5; T2 5; T3 0 (preserved by policy). All other new entries still require human review. These are judgment flags, not measured translation accuracy.\n" + uncertain.map(([tier,source,reason])=>`\n- ${tier}: ${source}\n\n  Filipino: ${translate(source,"fil")}\n\n  UNCERTAIN: ${reason}.\n`).join("");
text += `\n## Coverage totals\n\n${JSON.stringify(r.counts)}\n\nThe full preserved-term list and source locations are in i18n-missing.json.\n`;
await writeFile(new URL("../docs/i18n-review.md", import.meta.url), text);
console.log(JSON.stringify(r.counts));
