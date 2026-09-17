export default function Toggle({
  label,
  enabled,
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      {...props}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      className={`game-toggle flex w-full items-center justify-between rounded-lg border border-beige/15 px-3 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal ${className}`.trim()}
    >
      {label}
      <span className="toggle-state" aria-hidden="true"><span>{enabled ? "On" : "Off"}</span><span className="toggle-track"><span className="toggle-knob" /></span></span>
    </button>
  );
}
