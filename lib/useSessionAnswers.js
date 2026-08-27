"use client";

import { useCallback, useEffect, useState } from "react";

/** Exact sessionStorage key — do not rename. */
export const SESSION_STORAGE_KEY = "careerCompassSession";

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
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStoredSession(session) {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(session),
    );
  } catch {
    // Private mode / quota — ignore; in-memory state still works.
  }
}

function clearStoredSession() {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function normalizeSession(parsed) {
  const empty = createEmptySession();
  if (!parsed || typeof parsed !== "object") return empty;

  return {
    ...empty,
    ...parsed,
    interests:
      parsed.interests && typeof parsed.interests === "object"
        ? { ...parsed.interests }
        : {},
    skills:
      parsed.skills && typeof parsed.skills === "object"
        ? { ...parsed.skills }
        : {},
    strand: typeof parsed.strand === "string" ? parsed.strand : "",
    gwa: parsed.gwa ?? null,
    subjects: Array.isArray(parsed.subjects) ? parsed.subjects : [],
    nickname: typeof parsed.nickname === "string" ? parsed.nickname : "",
    yearLevel: typeof parsed.yearLevel === "string" ? parsed.yearLevel : "",
    journeyProgress: {
      ...empty.journeyProgress,
      ...(parsed.journeyProgress && typeof parsed.journeyProgress === "object"
        ? parsed.journeyProgress
        : {}),
    },
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
 * @property {{ interests: string, skills: string, academic: string }} journeyProgress
 */

/**
 * Session-only student state. Restores from sessionStorage on the client,
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
    const stored = readStoredSession();
    if (stored) {
      setSession(normalizeSession(stored));
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    writeStoredSession(session);
  }, [isReady, session]);

  const updateSession = useCallback((patch) => {
    setSession((current) => mergeSession(current, patch));
  }, []);

  const resetSession = useCallback(() => {
    clearStoredSession();
    setSession(createEmptySession());
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
  };
}
