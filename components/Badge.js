const LARGE_ICON_CLASSES = {
  completed: "border-teal bg-teal text-navy",
  locked: "border-beige/20 bg-navy/30",
  unlocked: "border-gold bg-navy/50 text-gold",
};

const SMALL_ICON_CLASSES = {
  completed: "border-teal bg-teal text-navy",
  locked: "border-beige/20 bg-beige/5",
  unlocked: "border-gold bg-gold/15 text-gold",
};

const STATUS_CLASSES = {
  completed: "border-teal text-teal",
  locked: "border-beige/15 text-beige/45",
  unlocked: "border-gold/55 text-gold",
};

export default function Badge({
  state,
  label,
  icon,
  variant = "status",
  size = "default",
  className = "",
  ...props
}) {
  if (variant === "icon") {
    const dimensions =
      size === "small" ? "h-6 w-6 text-[0.65rem]" : "h-12 w-12 text-xl";
    const stateClasses =
      size === "small" ? SMALL_ICON_CLASSES[state] : LARGE_ICON_CLASSES[state];
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full border ${dimensions} ${stateClasses} ${className}`.trim()}
        {...props}
      >
        {icon}
      </span>
    );
  }

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider ${STATUS_CLASSES[state]} ${className}`.trim()}
      {...props}
    >
      {label}
    </span>
  );
}
