import items from "../../data/v2/items.json" with { type: "json" };

const ids = (rows) => new Set(rows.map((row) => row.id));
const banks = {
  certificates: ids(items.certificates.filter((row) => row.scored)),
  subjects: ids(items.oldSubjects), strands: ids(items.strands),
  electives: ids(items.electives.filter((row) => row.scored)),
  bestSubjects: ids(items.coreSubjects),
};
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function validate(answers, section = null) {
  const errors = [];
  const error = (code, path, message) => errors.push({ code, path, message });
  const record = (value, path, keys) => {
    if (!object(value)) { error(value === undefined ? "REQUIRED" : "TYPE", path, "Expected an object."); return false; }
    for (const key of keys) if (!Object.hasOwn(value, key)) error("REQUIRED", `${path}.${key}`, "Required scoring field must be an own property.");
    for (const key of Object.keys(value)) if (!keys.includes(key)) error("UNKNOWN_KEY", `${path}.${key}`, "Unknown scoring key.");
    return true;
  };
  const selection = (value, path, allowed, min, max) => {
    if (!Array.isArray(value)) { error(value === undefined ? "REQUIRED" : "TYPE", path, "Expected an array."); return; }
    if (value.length < min || value.length > max) error("COUNT", path, `Choose ${min} to ${max} items.`);
    if (new Set(value).size !== value.length) error("DUPLICATE", path, "Selections must be distinct.");
    value.forEach((id, i) => { if (!allowed.has(id)) error("UNKNOWN_ID", `${path}[${i}]`, "Unknown or unscored item ID."); });
  };
  if (!object(answers)) return { valid: false, errors: [{ code: "TYPE", path: "$", message: "Expected an answers object." }] };
  if (!section) {
    for (const key of ["route", "interests", "skills", "certificates", "gwa"]) if (!Object.hasOwn(answers, key)) error("REQUIRED", key, "Missing scoring field.");
    if (["old", "new"].includes(answers.route) && !Object.hasOwn(answers, answers.route)) error("REQUIRED", answers.route, "Missing active route block.");
  }
  if ((!section || section === "academic") && !["old", "new"].includes(answers.route)) error("RANGE", "route", 'Expected "old" or "new".');
  const questions = items.interests.map((row) => row.id);
  if ((!section || section === "interests") && record(answers.interests, "interests", questions)) {
    for (const id of questions) if (!["A", "B", "C", "D"].includes(answers.interests[id])) error(answers.interests[id] === undefined ? "REQUIRED" : "RANGE", `interests.${id}`, "Expected A, B, C or D.");
  }
  const skills = items.skills.map((row) => row.id);
  if ((!section || section === "skills") && record(answers.skills, "skills", skills)) {
    for (const id of skills) {
      const value = answers.skills[id];
      if (typeof value !== "number" || !Number.isFinite(value)) error(value === undefined ? "REQUIRED" : "TYPE", `skills.${id}`, "Expected a finite number.");
      else if (!Number.isInteger(value)) error("INTEGER", `skills.${id}`, "Expected an integer rating.");
      else if (value < 1 || value > 5) error("RANGE", `skills.${id}`, "Expected a rating from 1 to 5.");
    }
  }
  if (!section || section === "academic") {
  selection(answers.certificates, "certificates", banks.certificates, 0, 3);
  if (typeof answers.gwa !== "number" || !Number.isFinite(answers.gwa)) error(answers.gwa === undefined ? "REQUIRED" : "TYPE", "gwa", "Expected a finite number.");
  else if (answers.gwa < 0 || answers.gwa > 100) error("RANGE", "gwa", "Expected GWA from 0 to 100 inclusive.");
  if (answers.route === "old" || answers.old !== undefined) {
    if (record(answers.old, "old", ["strand", "subjects"])) {
      if (!banks.strands.has(answers.old.strand)) error("UNKNOWN_ID", "old.strand", "Expected a STR ID, including GAS.");
      selection(answers.old.subjects, "old.subjects", banks.subjects, 1, 3);
    }
  }
  if (answers.route === "new" || answers.new !== undefined) {
    if (record(answers.new, "new", ["electives", "bestSubjects"])) {
      selection(answers.new.electives, "new.electives", banks.electives, 0, 3);
      selection(answers.new.bestSubjects, "new.bestSubjects", banks.bestSubjects, 1, 3);
    }
  }
  }
  return { valid: errors.length === 0, errors };
}

export function validateAnswers(answers) {
  return validate(answers);
}

// Each section runs the same rules without requiring unrelated answers.
export function validateSectionAnswers(answers, section) {
  if (!["interests", "skills", "academic"].includes(section)) return { valid: false, errors: [{ code: "RANGE", path: "section", message: "Unknown assessment section." }] };
  return validate(answers, section);
}

export class AnswerValidationError extends Error {
  constructor(errors) {
    super(errors.map((error) => `${error.code} at ${error.path}: ${error.message}`).join("\n"));
    this.name = "AnswerValidationError";
    this.code = "INVALID_ANSWERS";
    this.errors = errors;
  }
}

export function assertValidAnswers(answers) {
  const result = validateAnswers(answers);
  if (!result.valid) throw new AnswerValidationError(result.errors);
}
