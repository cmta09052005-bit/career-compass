import { createEmptySession, mergeSession, normalizeSession } from "../../lib/sessionSchema.js";
import { valleySteps, valleyPatch } from "../../lib/valleySelection.js";
import { fromSession } from "../../lib/scoringV2/fromSession.js";
export function sessionFor(answers,nickname="QA replay") {
  let session=mergeSession(createEmptySession(),{gradeLevel:12,route:answers.route,nickname,avatarId:"wanderer",reportDate:"October 26, 2026",interests:answers.interests,skills:answers.skills});
  for(const step of valleySteps(answers.route))session=mergeSession(session,valleyPatch(session,step,["gwa","certificates"].includes(step)?answers[step]:answers[answers.route][step],true));
  session=normalizeSession({...session,journeyProgress:{interests:"Completed",skills:"Completed",academic:"Completed"}});
  const adapted=fromSession(session);if(!adapted.ok)throw Error(JSON.stringify(adapted.errors));return session;
}
