"use client";

import { useCallback, useEffect, useState } from "react";
import { validatedProgress } from "./assessmentValidation";
import { browserStorage, PROGRESS_KEY, resetStoredJourney, subscribeToStorage } from "./browserStorage";

/** Keep the public name and stored key compatible with existing callers. */
export const SESSION_STORAGE_KEY = PROGRESS_KEY;

export const SECTION_STATUS = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

/**
 * Default session: AssessmentAnswers fields plus intake / journey metadata.
 * @returns {CareerCompassSession}
 */
export function createEmptySession() {
  return {
    interests: {},
    skills: {},
    strand: "",
    gwa: null,
    subjects: [],
    nickname: "",
    yearLevel: "",
    avatarId: null,
    journeyProgress: {
      interests: SECTION_STATUS.NOT_STARTED,
      skills: SECTION_STATUS.NOT_STARTED,
      academic: SECTION_STATUS.NOT_STARTED,
    },
  };
}

function isBrowser() {
  return typeof window !== "undefined";
}

function readStoredSession() {
  if (!isBrowser()) return null;
  try {
    const raw = browserStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStoredSession(session) {
  if (!isBrowser()) return;
  try {
    browserStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(session),
    );
  } catch {
    // Serialization failure must not interrupt the assessment.
  }
}

function normalizeSession(parsed) {
  const empty = createEmptySession();
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return empty;

  return {
    ...empty,
    ...parsed,
    interests:
      parsed.interests && typeof parsed.interests === "object" && !Array.isArray(parsed.interests)
        ? { ...parsed.interests }
        : {},
    skills:
      parsed.skills && typeof parsed.skills === "object" && !Array.isArray(parsed.skills)
        ? { ...parsed.skills }
        : {},
    strand: typeof parsed.strand === "string" ? parsed.strand : "",
    gwa: typeof parsed.gwa === "number" && Number.isFinite(parsed.gwa) ? parsed.gwa : null,
    subjects: Array.isArray(parsed.subjects) ? parsed.subjects.filter(value => typeof value === "string") : [],
    nickname: typeof parsed.nickname === "string" ? parsed.nickname : "",
    yearLevel: typeof parsed.yearLevel === "string" ? parsed.yearLevel : "",
    avatarId: typeof parsed.avatarId === "string" ? parsed.avatarId : null,
    reportDownloaded: parsed.reportDownloaded === true,
    reportDate: typeof parsed.reportDate === "string" ? parsed.reportDate : undefined,
    courseComparison: Array.isArray(parsed.courseComparison) ? [...new Set(parsed.courseComparison.filter(id => typeof id === "string"))].slice(0, 2) : [],
    journalViews: parsed.journalViews && typeof parsed.journalViews === "object" && !Array.isArray(parsed.journalViews)
      ? Object.fromEntries(Object.entries(parsed.journalViews).map(([id, views]) => [id, Array.isArray(views) ? [...new Set(views.filter(index => Number.isInteger(index) && index >= 0 && index < 6))] : []])) : {},
    journeyProgress: Object.fromEntries(Object.keys(empty.journeyProgress).map(section => [section,
      Object.values(SECTION_STATUS).includes(parsed.journeyProgress?.[section])
        ? parsed.journeyProgress[section] : SECTION_STATUS.NOT_STARTED,
    ])),
  };
}

function mergeSession(current, patch) {
  if (!patch || typeof patch !== "object") return current;

  return {
    ...current,
    ...patch,
    interests: {
      ...current.interests,
      ...(patch.interests && typeof patch.interests === "object"
        ? patch.interests
        : {}),
    },
    skills: {
      ...current.skills,
      ...(patch.skills && typeof patch.skills === "object" ? patch.skills : {}),
    },
    subjects: Array.isArray(patch.subjects) ? patch.subjects : current.subjects,
    journeyProgress: {
      ...current.journeyProgress,
      ...(patch.journeyProgress && typeof patch.journeyProgress === "object"
        ? patch.journeyProgress
        : {}),
    },
  };
}

/**
 * @typedef {Object} CareerCompassSession
 * @property {Object<string, string>} interests
 * @property {Object<string, number>} skills
 * @property {string} strand
 * @property {number | null} gwa
 * @property {string[]} subjects
 * @property {string} nickname
 * @property {string} yearLevel
 * @property {string | null} avatarId Cosmetic explorer selection; never scored.
 * @property {{ interests: string, skills: string, academic: string }} journeyProgress
 */

/**
 * Locally saved student state. Restores from localStorage on the client,
 * auto-saves on every update, never touches storage during SSR.
 *
 * @returns {{
 *   session: CareerCompassSession,
 *   answers: { interests: Object, skills: Object, strand: string, gwa: number | null, subjects: string[] },
 *   isReady: boolean,
 *   updateSession: (patch: Partial<CareerCompassSession>) => void,
 *   resetSession: () => void,
 * }}
 */
export function useSessionAnswers() {
  const [session, setSession] = useState(createEmptySession);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;
      restore();
      setIsReady(true);
    });

    function restore() {
      const restored = normalizeSession(readStoredSession());
      setSession({ ...restored, journeyProgress: validatedProgress(restored) });
    }
    const unsubscribe = subscribeToStorage(key => {
      if (key === null || key === SESSION_STORAGE_KEY) restore();
    });
    window.addEventListener("pageshow", restore);

    return () => {
      cancelled = true;
      unsubscribe();
      window.removeEventListener("pageshow", restore);
    };
  }, []);

  const updateSession = useCallback((patch) => {
    // Read the latest saved state and write synchronously before navigation/unload.
    // Read-only hook instances never write back stale snapshots on mount.
    const next = mergeSession(normalizeSession(readStoredSession()), patch);
    const updated = { ...next, journeyProgress: validatedProgress(next) };
    writeStoredSession(updated);
    setSession(updated);
  }, []);

  const resetSession = useCallback(() => {
    resetStoredJourney();
    setSession(createEmptySession());
  }, []);

  const discardSection = useCallback((section) => {
    const current = normalizeSession(readStoredSession());
    const next = {
      ...current,
      ...(section === "academic" ? { gwa: null, subjects: [] } : { [section]: {} }),
      journeyProgress: { ...current.journeyProgress, [section]: SECTION_STATUS.NOT_STARTED },
    };
    const updated = { ...next, journeyProgress: validatedProgress(next) };
    writeStoredSession(updated);
    setSession(updated);
  }, []);

  const answers = {
    interests: session.interests,
    skills: session.skills,
    strand: session.strand,
    gwa: session.gwa,
    subjects: session.subjects,
  };

  return {
    session,
    answers,
    isReady,
    updateSession,
    resetSession,
    discardSection,
  };
}
