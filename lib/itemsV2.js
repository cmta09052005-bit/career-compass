import items from "../data/v2/items.json" with { type: "json" };
export const INTEREST_ITEMS = items.interests.map(item => ({ ...item, text: item.prompt, options: item.options.map(option => ({ ...option, key: option.id.slice(-1) })) }));
export const SKILL_ITEMS = items.skills;
export const STRANDS = items.strands;
export const OLD_SUBJECTS = items.oldSubjects;
export const CORE_SUBJECTS = items.coreSubjects;
export const ELECTIVES = items.electives.filter(item => item.scored);
export const CERTIFICATES = items.certificates.filter(item => item.scored);
export default items;
