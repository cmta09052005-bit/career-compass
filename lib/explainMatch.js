import items from "../data/v2/items.json" with { type: "json" };
import links from "../data/v2/links.json" with { type: "json" };
export function explainMatch(course, answers) {
  const link = links[typeof course === "string" ? course : course.id];
  if (!link) return null;
  const text = (bank, ids) => bank.filter(item => ids.includes(item.id)).map(item => item.text);
  const selected = items.interests.flatMap(q => q.options.filter(option => option.id === `${q.id}-${answers.interests[q.id]}`));
  const best = answers.new?.bestSubjects || [];
  const electives = items.electives.filter(item => item.scored);
  return {
    interests: selected.filter(option => link.interests.includes(option.id)).map(option => option.text),
    skills: items.skills.filter(item => link.skills.includes(item.id)).map(item => ({ text: item.text, rating: answers.skills[item.id] })),
    subjects: answers.route === "old" ? text(items.oldSubjects, answers.old.subjects.filter(id => link.oldSubjects.includes(id))) : [],
    electives: answers.route === "new" ? text(electives, answers.new.electives.filter(id => link.electives.includes(id))) : [],
    coreSubjects: answers.route === "new" ? text(items.coreSubjects, best.filter(id => id === link.coreSubject)) : [],
    certificates: text(items.certificates, answers.certificates.filter(id => link.certificates.includes(id))),
    strand: answers.route === "old" && answers.old.strand === link.strand ? items.strands.find(item => item.id === link.strand)?.text : null,
  };
}
export function evidenceLines(evidence) {
  return [...new Set([...evidence.interests, ...evidence.subjects, ...evidence.electives, ...evidence.coreSubjects, ...evidence.certificates, ...evidence.skills.map(item => item.text), ...[evidence.strand].filter(Boolean)])].filter(text => text.length <= 110).sort((a,b) => a.length - b.length).slice(0,3);
}
