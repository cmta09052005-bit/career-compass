import { forwardRef } from "react";

const VARIANT_CLASSES = {
  panel:
    "w-full max-w-4xl rounded-[2rem] border border-gold/35 bg-navy/55 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-8 md:p-10",
  island:
    "group flex min-h-52 w-full flex-col items-center justify-center rounded-[45%_55%_48%_52%/55%_42%_58%_45%] border-2 px-7 py-8 text-center shadow-xl transition-[border-color,background-color,box-shadow,transform] duration-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.98]",
  processing: "w-full max-w-xl text-center",
};

const ISLAND_STATE_CLASSES = {
  completed:
    "border-teal bg-teal/20 shadow-[0_0_36px_rgba(45,191,184,0.2)]",
  locked:
    "cursor-not-allowed border-beige/15 bg-slate-700/55 text-beige/45 grayscale",
  unlocked:
    "border-gold/70 bg-gold/15 shadow-[0_0_40px_rgba(212,160,23,0.18)] hover:border-gold hover:bg-gold/20",
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
