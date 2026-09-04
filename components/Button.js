import Link from "next/link";

const VARIANT_CLASSES = {
  primary:
    "game-button game-button-primary min-h-12 border border-gold bg-gold px-8 py-3 text-sm uppercase text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal",
  secondary:
    "game-button game-button-secondary min-h-12 border border-teal/65 bg-teal/10 px-6 py-3 text-sm font-semibold text-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40",
  "cta-glow":
    "game-button game-button-primary inline-flex items-center justify-center border border-gold/70 bg-gold/15 px-7 py-3 font-sans text-xs tracking-[0.2em] text-beige uppercase sm:px-8 sm:text-sm",
  "map-primary":
    "game-button game-button-primary min-h-12 justify-center px-8 py-3 text-sm font-extrabold uppercase tracking-[0.12em] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-45",
  "map-secondary":
    "game-button game-button-secondary min-h-12 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.1em] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-teal disabled:cursor-not-allowed disabled:opacity-45",
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  href,
  className = "",
  type = "button",
  ...props
}) {
  const classes = `${VARIANT_CLASSES[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {label}
    </button>
  );
}
