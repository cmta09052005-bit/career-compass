"use client";

import { useRouter } from "next/navigation";
import {
  SECTION_STATUS,
  useSessionAnswers,
} from "@/lib/useSessionAnswers";

export default function JourneySectionPlaceholder({
  sectionId,
  title,
  path,
}) {
  const router = useRouter();
  const { session, isReady, updateSession } = useSessionAnswers();
  const isCompleted =
    session.journeyProgress[sectionId] === SECTION_STATUS.COMPLETED;

  function completeSection() {
    updateSession({
      journeyProgress: { [sectionId]: SECTION_STATUS.COMPLETED },
    });
    router.push("/journey");
  }

  return (
    <main className="game-ui-screen relative isolate flex min-h-svh flex-1 items-center justify-center overflow-hidden bg-navy px-5 py-12 text-beige">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(145deg,#121a2e_0%,#1b2a4a_55%,#31536a_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-50 [background-image:radial-gradient(circle_at_50%_35%,rgba(212,160,23,0.2),transparent_34%)]"
      />

      <section className="w-full max-w-2xl rounded-3xl border border-gold/35 bg-navy/65 p-6 text-center shadow-2xl backdrop-blur-md sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal">
          {path}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-beige sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-beige/85 sm:text-base">
          This assessment section is still a placeholder. Use the completion
          control below to verify the guided Journey Map flow.
        </p>

        <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/journey")}
            className="min-h-12 rounded-full border border-teal/70 bg-teal/10 px-6 py-3 text-sm font-semibold text-beige transition-[border-color,background-color,transform] duration-150 hover:border-teal hover:bg-teal/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.97]"
          >
            Back to Journey Map
          </button>
          <button
            type="button"
            onClick={completeSection}
            disabled={!isReady}
            className="min-h-12 rounded-full border border-gold bg-gold px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-navy transition-[background-color,transform] duration-150 hover:bg-[#e2b52f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal active:scale-[0.97] disabled:cursor-wait disabled:opacity-50"
          >
            {isCompleted ? "Return to Journey Map" : "Complete Section"}
          </button>
        </div>
      </section>
    </main>
  );
}
