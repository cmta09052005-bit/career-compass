const ICON_PATHS = {
  C1: "M18 18h64v44H18z M10 72h80 M40 62v10 M60 62v10 M43 30l-9 9 9 9 M57 30l9 9-9 9",
  C2: "M40 15h20l3 12 10 6 12-3 10 18-9 9v12l9 9-10 17-12-3-10 6-3 12H40l-3-12-10-6-12 3L5 78l9-9V57l-9-9 10-18 12 3 10-6z M50 42a20 20 0 1 0 0 40 20 20 0 0 0 0-40",
  C3: "M14 33h72v48H14z M36 33V21h28v12 M14 48q36 20 72 0 M44 49h12v14H44z",
  C4: "M50 28Q30 14 14 22v50q18-8 36 6 18-14 36-6V22q-16-8-36 6v50 M24 34l16 5 M24 46l16 5 M60 39l16-5 M60 51l16-5",
  C5: "M50 22c-10-16-32-8-32 12 0 24 32 44 32 44s32-20 32-44c0-20-22-28-32-12z M50 38v22 M39 49h22",
  C6: "M40 58L74 16q4-4 9 1t0 9L52 69z M40 58q-16-3-15 14 0 10-11 14 29 7 38-17z M37 67q-6 10-12 12",
};

export default function StatementIcon({ category }) {
  return <svg className="forest-statement-icon" data-category={category} viewBox="0 0 100 112" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON_PATHS[category]} /></svg>;
}
