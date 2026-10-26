export const MAX_PICKS = 3;
export const valleySteps = route => route === "old" ? ["strand", "subjects", "gwa", "certificates"] : route === "new" ? ["electives", "bestSubjects", "gwa", "certificates"] : [];

export function togglePicks(values, id, noneSelected = false) {
  if (id === null) return { values: [], confirmed: !noneSelected, limited: false };
  if (values.includes(id)) {
    const next = values.filter(value => value !== id);
    return { values: next, confirmed: next.length > 0, limited: false };
  }
  if (values.length >= MAX_PICKS) return { values, confirmed: true, limited: true };
  return { values: [...values, id], confirmed: true, limited: false };
}

export function validUiGwa(value) {
  const text = String(value ?? "");
  return /^\d+(?:\.\d{1,2})?$/.test(text) && Number(text) >= 60 && Number(text) <= 100;
}

export function valleyPatch(session, step, value, confirmed) {
  const shared = ["gwa", "certificates"].includes(step);
  return {
    ...(shared ? { [step]: value } : { [session.route]: { [step]: value } }),
    valleyProgress: shared ? { [step]: confirmed } : { [session.route]: { [step]: confirmed } },
    journeyProgress: { academic: "In Progress" },
  };
}

export function stepComplete(session, step) {
  const value = ["gwa", "certificates"].includes(step) ? session[step] : session[session.route]?.[step];
  const confirmed = ["gwa", "certificates"].includes(step) ? session.valleyProgress?.[step] : session.valleyProgress?.[session.route]?.[step];
  if (!confirmed) return false;
  if (step === "gwa") return validUiGwa(value);
  if (step === "strand") return Boolean(value);
  return Array.isArray(value) && value.length <= MAX_PICKS && (["electives", "certificates"].includes(step) || value.length > 0);
}
