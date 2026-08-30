import Link from "next/link";

const VARIANT_CLASSES = {
  primary:
    "min-h-12 rounded-full border border-gold bg-gold px-8 py-3 text-sm uppercase text-navy hover:bg-[#e2b52f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal",
  secondary:
    "min-h-12 rounded-full border border-teal/65 bg-teal/10 px-6 py-3 text-sm font-semibold text-beige transition-[border-color,background-color,transform] duration-150 hover:border-teal hover:bg-teal/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40",
  "cta-glow":
    "inline-flex items-center justify-center rounded-full border border-gold/70 bg-gold/15 px-7 py-3 font-sans text-xs tracking-[0.2em] text-beige uppercase transition-[box-shadow,transform,background-color] duration-200 ease-out hover:bg-gold/25 hover:shadow-[0_0_28px_rgba(212,160,23,0.55)] active:scale-[0.97] sm:px-8 sm:text-sm",
  "map-primary":
    "map-ribbon min-h-12 justify-center px-8 py-3 text-sm font-extrabold uppercase tracking-[0.12em] transition-[filter,transform] duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-45",
  "map-secondary":
    "map-paper-soft min-h-12 rounded-lg px-6 py-3 text-sm font-extrabold uppercase tracking-[0.1em] transition-[transform,filter] duration-150 hover:brightness-105 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-teal active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45",
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
