"use client";

import { useCallback, useEffect, useState } from "react";
import { validatedProgress } from "./assessmentValidation";
import { createEmptySession, normalizeSession, mergeSession, discardSessionSection } from "./sessionSchema.js";
import { browserStorage, PROGRESS_KEY, SESSION_VERSION_KEY, readSessionRecord, resetStoredJourney, subscribeToStorage } from "./browserStorage";

/** Keep the public name and stored key compatible with existing callers. */
export const SESSION_STORAGE_KEY = PROGRESS_KEY;

export { createEmptySession, SECTION_STATUS } from "./sessionSchema.js";

function isBrowser() {
  return typeof window !== "undefined";
}

function readStoredSession() {
  if (!isBrowser()) return null;
  try {
    return readSessionRecord();
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
    browserStorage.setItem(SESSION_VERSION_KEY, String(session.schemaVersion));
  } catch {
    // Serialization failure must not interrupt the assessment.
  }
}

/**
 * @typedef {Object} CareerCompassSession
 * @property {Object<string, string>} interests
 * @property {Object<string, number>} skills
 * @property {2} schemaVersion
 * @property {11 | 12 | null} gradeLevel
 * @property {string | null} pilotSchoolId
 * @property {"old" | "new" | null} route
 * @property {string[]} certificates
 * @property {{ strand: string | null, subjects: string[] }} old
 * @property {{ electives: string[], bestSubjects: string[] }} new
 * @property {Object} valleyProgress Explicit answers, including empty selections.
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
    const next = discardSessionSection(current, section);
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
