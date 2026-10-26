import { createEmptySession, normalizeSession, SESSION_SCHEMA_VERSION } from "./sessionSchema.js";

// Keep the original storage key; the saved record now declares its schema version.
export const PROGRESS_KEY = "careerCompassSession";
export const SESSION_VERSION_KEY = "careerCompassSessionVersion";
export const STORAGE_EVENT = "career-compass-storage";
const MIGRATION_KEY = "careerCompassLocalMigrationV1";
export const JOURNEY_KEYS = [
  PROGRESS_KEY, SESSION_VERSION_KEY, "careerCompassBadgeNotices", "careerCompassJourneyGuideSeen",
  "careerCompassExpeditionSeen", "careerCompassAtlasPosition",
  "careerCompassAtlasFirstWalk", "careerCompassAtlasUnlockSeen", "careerCompassAtlasTourSeen",
  "careerCompassMountainsBriefing", "careerCompassForestBriefing",
  "careerCompassValleyBriefing", "careerCompassValleyStep",
];
const PREFERENCE_KEYS = ["careerCompassLanguage", "careerCompassSound", "career-compass-awakening-v2-seen"];
const pending = new Map();
let migrated = false;

function notify(key) {
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

function migrate() {
  if (migrated || typeof window === "undefined") return;
  migrated = true;
  try {
    const marker = window.localStorage.getItem(MIGRATION_KEY);
    if (marker === "true") return;
    // Never combine an older tab's journey with progress already saved locally.
    const copyJourney = marker === "journey" || (!marker && window.localStorage.getItem(PROGRESS_KEY) === null);
    const keys = copyJourney
      ? [...JOURNEY_KEYS, ...PREFERENCE_KEYS] : PREFERENCE_KEYS;
    // Remember an interrupted migration even if the main record was already copied.
    window.localStorage.setItem(MIGRATION_KEY, copyJourney ? "journey" : "preferences");
    for (const key of keys) {
      if (pending.has(key)) continue;
      if (window.localStorage.getItem(key) !== null) continue;
      const value = window.sessionStorage.getItem(key);
      if (value !== null) {
        pending.set(key, value);
        window.localStorage.setItem(key, value);
        pending.delete(key);
      }
    }
    // This marker also prevents old tabs from resurrecting a reset journey.
    window.localStorage.setItem(MIGRATION_KEY, "true");
    for (const key of [...JOURNEY_KEYS, ...PREFERENCE_KEYS]) window.sessionStorage.removeItem(key);
  } catch {
    // Retain legacy data when storage is blocked or full; retry next page load.
    migrated = false;
  }
}

export const browserStorage = {
  getItem(key) {
    if (typeof window === "undefined") return null;
    migrate();
    if (pending.has(key)) return pending.get(key);
    try {
      const value = window.localStorage.getItem(key);
      if (value !== null || migrated) return value;
      if (JOURNEY_KEYS.includes(key) && window.localStorage.getItem(PROGRESS_KEY) !== null
        && window.localStorage.getItem(MIGRATION_KEY) !== "journey") return null;
    } catch { /* Reads can also be blocked, independently of failed writes. */ }
    if (!migrated) {
      try {
        const legacy = window.sessionStorage.getItem(key);
        if (legacy !== null) pending.set(key, legacy);
        return legacy;
      } catch { /* Storage is completely unavailable. */ }
    }
    return null;
  },
  setItem(key, value) {
    if (typeof window === "undefined") return false;
    migrate();
    const text = String(value);
    pending.set(key, text);
    try {
      window.localStorage.setItem(key, text);
      pending.delete(key);
    } catch { /* Keep the current page usable and report the unsaved change. */ }
    notify(key);
    return !pending.has(key);
  },
  removeItem(key) {
    if (typeof window === "undefined") return;
    migrate();
    pending.set(key, null);
    try {
      window.localStorage.removeItem(key);
      pending.delete(key);
    } catch { /* A failed deletion must not restore stale data on this page. */ }
    try { window.sessionStorage.removeItem(key); } catch { /* Legacy cleanup only. */ }
    notify(key);
  },
};

export function readSessionRecord() {
  let parsed;
  try {
    const raw = browserStorage.getItem(PROGRESS_KEY);
    if (!raw) return createEmptySession();
    parsed = JSON.parse(raw);
  } catch { return createEmptySession(); }
  const next = normalizeSession(parsed);
  if (parsed?.schemaVersion !== SESSION_SCHEMA_VERSION) {
    // Write v2 first so synchronous storage subscribers cannot re-run migration.
    browserStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    for (const key of JOURNEY_KEYS) if (key !== PROGRESS_KEY && key !== SESSION_VERSION_KEY) browserStorage.removeItem(key);
    browserStorage.setItem(SESSION_VERSION_KEY, String(SESSION_SCHEMA_VERSION));
  }
  // Prompt 25b keeps valid v2 answers while retiring cluster/elective best subjects.
  else if (Object.hasOwn(parsed.new || {}, "cluster") || Object.hasOwn(parsed.valleyProgress?.new || {}, "cluster") || JSON.stringify(parsed.new?.bestSubjects) !== JSON.stringify(next.new.bestSubjects)) {
    browserStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  }
  try { if (JSON.parse(browserStorage.getItem("careerCompassValleyStep"))?.step === "cluster") browserStorage.removeItem("careerCompassValleyStep"); } catch { /* Older step formats remain harmless. */ }
  return next;
}

export function hasUnsavedChanges() { return pending.size > 0; }

export function retryPendingChanges() {
  for (const [key, value] of [...pending]) {
    if (value === null) browserStorage.removeItem(key);
    else browserStorage.setItem(key, value);
  }
}

export function resetStoredJourney() {
  for (const key of JOURNEY_KEYS) browserStorage.removeItem(key);
}

export function subscribeToStorage(listener) {
  function changed(event) {
    if (event.type === "storage") {
      try { if (event.storageArea !== window.localStorage) return; } catch { return; }
      // A newer tab's change (including reset) supersedes a failed local write.
      if (event.key === null) pending.clear();
      else pending.delete(event.key);
    }
    listener(event.type === "storage" ? event.key : event.detail.key);
  }
  window.addEventListener("storage", changed);
  window.addEventListener(STORAGE_EVENT, changed);
  return () => {
    window.removeEventListener("storage", changed);
    window.removeEventListener(STORAGE_EVENT, changed);
  };
}
