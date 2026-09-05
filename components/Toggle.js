export default function Toggle({
  label,
  enabled,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`game-toggle flex w-full items-center justify-between rounded-lg border border-beige/15 px-3 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal ${className}`.trim()}
    >
      {label}
      <span className="text-teal">{enabled ? "On" : "Off"}</span>
    </button>
  );
}
