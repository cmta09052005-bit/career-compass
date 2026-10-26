import items from "../data/v2/items.json" with { type: "json" };
import { resolveRoute } from "./routeResolution.js";

export const SESSION_SCHEMA_VERSION = 2;
export const SECTION_STATUS = { NOT_STARTED: "Not Started", IN_PROGRESS: "In Progress", COMPLETED: "Completed" };
const record = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const coreIds = new Set(items.coreSubjects.map(item => item.id));
const list = (value) => Array.isArray(value) ? [...value] : [];

export function emptyValleyProgress() {
  return { gwa: false, certificates: false, old: { strand: false, subjects: false }, new: { electives: false, bestSubjects: false } };
}

export function createEmptySession() {
  return {
    schemaVersion: SESSION_SCHEMA_VERSION, gradeLevel: null, pilotSchoolId: null, route: null,
    interests: {}, skills: {}, certificates: [], gwa: null,
    old: { strand: null, subjects: [] }, new: { electives: [], bestSubjects: [] },
    valleyProgress: emptyValleyProgress(),
    // Temporary empty compatibility fields for the deferred Valley screen only.
    strand: "", subjects: [], nickname: "", yearLevel: "", avatarId: null,
    reportDownloaded: false, reportDate: undefined, courseComparison: [], journalViews: {},
    journeyProgress: { interests: SECTION_STATUS.NOT_STARTED, skills: SECTION_STATUS.NOT_STARTED, academic: SECTION_STATUS.NOT_STARTED },
  };
}

export function normalizeSession(parsed) {
  const empty = createEmptySession();
  if (!record(parsed)) return empty;
  const identity = {
    nickname: typeof parsed.nickname === "string" ? parsed.nickname : typeof parsed.name === "string" ? parsed.name : "",
    avatarId: typeof parsed.avatarId === "string" ? parsed.avatarId : null,
    yearLevel: typeof parsed.yearLevel === "string" ? parsed.yearLevel : "",
    ...(typeof parsed.name === "string" ? { name: parsed.name } : {}),
  };
  // v1 answers and completion state cannot be reinterpreted as v2 evidence.
  if (parsed.schemaVersion !== SESSION_SCHEMA_VERSION) return { ...empty, ...identity };
  const flags = parsed.valleyProgress;
  const normalized = {
    ...empty, ...parsed, ...identity, schemaVersion: SESSION_SCHEMA_VERSION,
    gradeLevel: [11, 12].includes(parsed.gradeLevel) ? parsed.gradeLevel : null,
    pilotSchoolId: null,
    route: ["old", "new"].includes(parsed.route) ? parsed.route : null,
    interests: record(parsed.interests) ? { ...parsed.interests } : {},
    skills: record(parsed.skills) ? { ...parsed.skills } : {}, certificates: list(parsed.certificates),
    gwa: typeof parsed.gwa === "number" && Number.isFinite(parsed.gwa) ? parsed.gwa : null,
    old: { strand: typeof parsed.old?.strand === "string" ? parsed.old.strand : null, subjects: list(parsed.old?.subjects) },
    new: { electives: list(parsed.new?.electives), bestSubjects: list(parsed.new?.bestSubjects).filter(id => coreIds.has(id)) },
    valleyProgress: {
      gwa: flags?.gwa === true, certificates: flags?.certificates === true,
      old: { strand: flags?.old?.strand === true, subjects: flags?.old?.subjects === true },
      new: { electives: flags?.new?.electives === true, bestSubjects: flags?.new?.bestSubjects === true && list(parsed.new?.bestSubjects).some(id => coreIds.has(id)) },
    },
    strand: typeof parsed.strand === "string" ? parsed.strand : "", subjects: list(parsed.subjects),
    reportDownloaded: parsed.reportDownloaded === true,
    reportDate: typeof parsed.reportDate === "string" ? parsed.reportDate : undefined,
    courseComparison: Array.isArray(parsed.courseComparison) ? [...new Set(parsed.courseComparison.filter(id => typeof id === "string"))].slice(0, 2) : [],
    journalViews: record(parsed.journalViews) ? Object.fromEntries(Object.entries(parsed.journalViews).map(([id, views]) => [id, Array.isArray(views) ? [...new Set(views.filter(index => Number.isInteger(index) && index >= 0 && index < 6))] : []])) : {},
    journeyProgress: Object.fromEntries(Object.keys(empty.journeyProgress).map(section => [section, Object.values(SECTION_STATUS).includes(parsed.journeyProgress?.[section]) ? parsed.journeyProgress[section] : SECTION_STATUS.NOT_STARTED])),
  };
  if (normalized.route === "new" && !normalized.valleyProgress.new.bestSubjects && normalized.journeyProgress.academic === SECTION_STATUS.COMPLETED) normalized.journeyProgress.academic = SECTION_STATUS.IN_PROGRESS;
  normalized.route = resolveRoute({ ...normalized, chosenRoute: normalized.route }).route;
  return normalized;
}

export function mergeSession(current, patch) {
  if (!record(patch)) return current;
  const contextChanged = (Object.hasOwn(patch, "gradeLevel") && patch.gradeLevel !== current.gradeLevel);
  const chosenRoute = Object.hasOwn(patch, "route") ? patch.route : contextChanged ? null : current.route;
  const next = normalizeSession({
    ...current, ...patch, route: chosenRoute,
    interests: { ...current.interests, ...(record(patch.interests) ? patch.interests : {}) },
    skills: { ...current.skills, ...(record(patch.skills) ? patch.skills : {}) },
    old: { ...current.old, ...(record(patch.old) ? patch.old : {}) },
    new: { ...current.new, ...(record(patch.new) ? patch.new : {}) },
    valleyProgress: {
      ...current.valleyProgress, ...patch.valleyProgress,
      old: { ...current.valleyProgress.old, ...patch.valleyProgress?.old },
      new: { ...current.valleyProgress.new, ...patch.valleyProgress?.new },
    },
    journeyProgress: { ...current.journeyProgress, ...patch.journeyProgress },
  });
  if (current.route && current.route !== next.route) {
    const empty = createEmptySession();
    next[current.route] = empty[current.route];
    next.valleyProgress[current.route] = empty.valleyProgress[current.route];
    const active = next.route ? next[next.route] : {};
    const hasActiveAnswers = Object.values(active).some(value => Array.isArray(value) ? value.length > 0 : value !== null && value !== "");
    const hasSharedAnswers = next.gwa !== null || next.certificates.length > 0 || next.valleyProgress.gwa || next.valleyProgress.certificates;
    next.journeyProgress.academic = hasActiveAnswers || hasSharedAnswers ? SECTION_STATUS.IN_PROGRESS : SECTION_STATUS.NOT_STARTED;
  }
  return next;
}

export function discardSessionSection(current, section) {
  const empty = createEmptySession();
  return {
    ...current,
    ...(section === "academic" ? { gwa: null, certificates: [], old: empty.old, new: empty.new, valleyProgress: empty.valleyProgress, subjects: [], strand: "" } : { [section]: {} }),
    journeyProgress: { ...current.journeyProgress, [section]: SECTION_STATUS.NOT_STARTED },
  };
}
export function sessionAnswerFields(session) {
  return {
    route: session.route, interests: session.interests, skills: session.skills,
    certificates: session.certificates, gwa: session.gwa,
    ...(["old", "new"].includes(session.route) ? { [session.route]: session[session.route] } : {}),
  };
}

