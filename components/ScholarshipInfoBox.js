import Card from "@/components/Card";

const SCHOLARSHIPS = [
  "RA 10931 (Free Higher Education) — Free tuition and other school fees at all SUCs (State Universities/Colleges) and CHED-recognized LUCs (Local Universities/Colleges), regardless of course. Applicable to all.",
  "CHED Tertiary Education Subsidy (TES) — Cash assistance (~₱20,000/year at public schools, up to ₱60,000/year at private schools) for students who need financial help. Applicable to all courses, public or private school. Apply through your school's registrar or scholarship office.",
  "DOST-SEI Scholarship — Full scholarship (tuition + monthly allowance), but only for Science, Math, Engineering, IT, and Architecture-related courses. Not covered: Business, Education, Fine Arts, and most Health courses. Check sei.dost.gov.ph to see if your course qualifies.",
  "TESDA Scholarships — Free or low-cost short courses (e.g., Computer Systems Servicing, Visual Graphic Design, Architectural Drafting) that can be a first step if a 4-year degree isn't within reach yet. Applicable to all — can also be taken as an extra certification while studying.",
  "Local Government (LGU) Scholarships — Many provinces, cities, and barangays run their own scholarship programs. Applicable to all courses — but requirements vary, so check with your Sangguniang Panlalawigan/Panlungsod or municipal office.",
  "School-Based/Private Scholarships — Many private schools offer their own grants or discounts (academic, financial-need-based, or sibling discounts). Applicable to all — ask directly at your target school's financial aid office.",
];

export default function ScholarshipInfoBox() {
  return (
    <Card className="mt-5 max-w-none rounded-2xl border-gold/35 bg-navy/45 p-5 sm:p-7">
      <h2 className="font-serif text-2xl">Possible Scholarships &amp; Financial Aid</h2>
      <p className="mt-4 text-sm leading-7 text-beige/80 sm:text-base">
        Don&apos;t worry if your budget is tight — there&apos;s help available before you even have to think about stopping your studies:
      </p>
      <ul className="mt-5 list-disc space-y-4 pl-5 text-sm leading-7 text-beige/80 marker:text-gold sm:text-base">
        {SCHOLARSHIPS.map((scholarship) => (
          <li key={scholarship}>{scholarship}</li>
        ))}
      </ul>
      <p className="mt-5 rounded-xl border border-gold/35 bg-gold/10 p-4 text-sm leading-7 text-beige/80 italic sm:text-base">
        Note: Not every scholarship applies to every course — DOST-SEI, for example, is only for Science/Tech/Engineering/Architecture-related courses. But RA 10931, TES, TESDA, and LGU scholarships are open to almost all students regardless of course.
      </p>
      <p className="mt-5 border-t border-beige/15 pt-4 text-xs leading-5 text-beige/55">
        Reminder: The information on this page is only a starting guide. For the most up-to-date and complete details — whether about the course overview, where to study, or possible jobs — also search online or ask the school directly (in person or by phone), since requirements, curricula, and scholarship offers can change year to year.
      </p>
    </Card>
  );
}
