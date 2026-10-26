// Explicit grammar for runtime labels. Personal names and factual values stay intact.
import { filterOptions } from "../courseSearch.js";
const summaryOptions = filterOptions();
function filterSummary(value, t) {
  const banks = { "Course group": "groups", "School type": "schoolTypes", Location: "locations" };
  return value.split("; ").map(section => {
    const colon = section.indexOf(": "), label = section.slice(0, colon);
    const bank = summaryOptions[banks[label]];
    if (colon < 0 || !bank) return section;
    let rest = section.slice(colon + 2), labels = [];
    while (rest) {
      const option = [...bank].sort((a,b)=>b.label.length-a.label.length).find(o=>rest === o.label || rest.startsWith(o.label + ", "));
      if (!option) return section;
      labels.push(t(option.label)); rest = rest.slice(option.label.length).replace(/^, /, "");
    }
    return `${t(label)}: ${labels.join(", ")}`;
  }).join("; ");
}
export const patterns = [
  [/^(Academic|TechPro): (.+)$/, (m, t) => `${t(m[1])}: ${t(m[2])}`],
  [/^Show all (\d+) courses$/, m => `Ipakita ang lahat ng ${m[1]} kurso`],
  [/^Rank #(\d+)$/, m => `Ranggo #${m[1]}`],
  [/^(\d+) courses?$/, m => `${m[1]} kurso`],
  [/^Downloading (\d+)%$/, m => `Dina-download: ${m[1]}%`],
  [/^Prepared for (.+)$/, m => `Inihanda para kay ${m[1]}`],
  [/^(Overview|School|Career) for (.+?): (.+)$/, (m, t) => `${t(m[1])} para sa ${m[2]}: ${t(m[3])}`],
  [/^Matched on (.+?): (.+)$/, (m, t) => `Nagtugma sa ${{name:"kurso",group:"pangkat",career:"trabaho",topic:"paksa"}[m[1]] || t(m[1])}: ${t(m[2])}`],
  [/^(Public SUC|Community college|Private), (.+)$/, (m, t) => `${t(m[1])}, ${m[2]}`],
  [/^On our list: (.+)$/, (m, t) => `Nasa listahan namin: ${filterSummary(m[1], t)}`],
  [/^(.+) uses the new curriculum\.$/, m => `${m[1]} ay gumagamit ng bagong curriculum.`],
  [/^Assessment (\d+) of (\d+): (.+)$/, (m, t) => `Pagtatasa ${m[1]} sa ${m[2]}: ${t(m[3])}`],
  [/^(.+) — (.+)\. Open journey list$/, (m, t) => `${t(m[1])}; ${t(m[2])}. Buksan ang listahan ng paglalakbay`],
  [/^(.+): not yet earned$/, (m, t) => `${t(m[1])}: hindi pa nakamit`],
  [/^Compare (.+)$/, m => `Ihambing ang ${m[1]}`],
  [/^Choose Your Explorer, (.+)$/, m => `Piliin ang Iyong Manlalakbay, ${m[1]}`],
  [/^(.+), your$/, m => `${m[1]}, ang iyong`],
  [/^Step (\d+) of (\d+)$/, m => `Hakbang ${m[1]} sa ${m[2]}`],
  [/^(\d+) of (\d+) (.*)$/, (m, t) => `${m[1]} sa ${m[2]} ${t(m[3])}`],
  [/^Show (.+)$/, (m, t) => `Ipakita: ${t(m[1])}`],
  [/^Chapter (\d+): (.+)$/, (m, t) => `Kabanata ${m[1]}: ${t(m[2])}`],
  [/^(.+), an ink-and-parchment explorer portrait$/, (m, t) => `${t(m[1])}, larawan ng manlalakbay sa estilong tinta sa pergamino`],
  [/^Relative match strength, ranked (\d+)$/, m => `Antas ng pagtutugma, ranggo ${m[1]}`],
  [/^See All (\d+) Courses$/, m => `Tingnan ang Lahat ng ${m[1]} Kurso`],
  [/^Complete all required answers in (.+) before continuing\. Your map shows the next available region\.$/, (m, t) => `Kumpletuhin ang lahat ng kailangang sagot sa ${t(m[1])} bago magpatuloy. Makikita sa mapa ang susunod na rehiyon.`],
  [/^Finish (.+) to earn this\.$/, (m, t) => `Tapusin ang ${t(m[1])} upang makamit ito.`],
  [/^Finish (.+) first$/, (m, t) => `Tapusin muna ang ${t(m[1])}`],
  [/^Locked, finish (.+) first\.$/, (m, t) => `Naka-lock; tapusin muna ang ${t(m[1])}.`],
  [/^Walking to (.+)…$/, (m, t) => `Naglalakad patungo sa ${t(m[1])}…`],
  [/^Locate (.+)$/, (m, t) => `Hanapin ang ${t(m[1])}`],
  [/^Enter (.+) →$/, (m, t) => `Pumasok sa ${t(m[1])} →`],
  [/^(.+) earned$/, (m, t) => `Nakamit ang ${t(m[1])}`],
  [/^(.+) is your next region\.$/, (m, t) => `${t(m[1])} ang susunod mong rehiyon.`],
  [/^REGION (\d+) · (.+)$/, (m, t) => `REHIYON ${m[1]} · ${t(m[2])}`],
  [/^Career Compass  \|  Page (\d+) of (\d+)$/, m => `Career Compass  |  Pahina ${m[1]} sa ${m[2]}`],
  [/^Career Compass \| Page (\d+) of (\d+)$/, m => `Career Compass  |  Pahina ${m[1]} sa ${m[2]}`],
  [/^Prepared for (.+) \| (.+)$/, m => `Inihanda para kay ${m[1]}  |  ${m[2]}`],
  [/^Supporting answers for (.+)$/, (m, t) => `Mga sagot na batayan para sa ${t(m[1])}`],
  [/^Rank #(\d+): (.+)$/, m => `Ranggo #${m[1]}: ${m[2]}`],
  [/^Academic: Strand: (.+) \| GWA: (.+) \| Subjects: (.+)$/, (m, t) => `Akademiko: Strand: ${t(m[1])} | GWA: ${t(m[2])} | Mga Asignatura: ${t(m[3])}`],
];
