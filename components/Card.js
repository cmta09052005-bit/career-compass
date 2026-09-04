import { forwardRef } from "react";

const VARIANT_CLASSES = {
  panel:
    "game-panel w-full max-w-4xl border border-gold/35 bg-navy/55 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-8 md:p-10",
  island:
    "game-panel game-slot-card journey-island-card group flex min-h-64 w-full flex-col items-center justify-center border-2 px-8 py-10 text-center shadow-xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-gold",
  processing: "game-panel w-full max-w-xl text-center",
};

const ISLAND_STATE_CLASSES = {
  completed:
    "border-[#3f7566] bg-[#d8c58f] text-[#35241b] shadow-[0_0_36px_rgba(45,191,184,0.2)]",
  locked:
    "cursor-not-allowed border-[#6f6257] bg-[#776b61]/75 text-[#e8d6bd]/65 grayscale",
  unlocked:
    "border-[#c99757] bg-[#f0d0a5] text-[#35241b] shadow-[0_0_40px_rgba(212,160,23,0.24)] hover:-translate-y-1 hover:border-gold hover:bg-[#ffe1b9]",
};

const Card = forwardRef(function Card(
  {
    as: Component = "section",
    variant = "panel",
    state,
    className = "",
    children,
    ...props
  },
  ref,
) {
  const stateClasses = variant === "island" ? ISLAND_STATE_CLASSES[state] : "";
  const classes = `${VARIANT_CLASSES[variant]} ${stateClasses} ${className}`.trim();

  return (
    <Component ref={ref} className={classes} {...props}>
      {children}
    </Component>
  );
});

export default Card;
