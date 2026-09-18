"use client";

import Localized from "@/components/Localized";
import Badge from "@/components/Badge";

export default function ProgressIndicator({
  items,
  completedCount,
  variant = "sections",
}) {
  if (variant === "mini") {
    return (
      <Localized as="div"
        aria-label={`${completedCount} of ${items.length} questions completed`}
        className="game-mini-progress flex items-center gap-2"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax={items.length}
        aria-valuenow={completedCount}
      >
        {items.map((item) => (
          <span
            key={item.id}
            className={`h-2 flex-1 rounded-full transition-colors ${
              item.state === "completed" ? "bg-gold" : "bg-beige/20"
            }`}
            aria-hidden="true"
          />
        ))}
      </Localized>
    );
  }

  return (
    <Localized as="section"
      aria-label={`Compass Points: ${completedCount} of ${items.length} sections completed`}
      className="game-progress-panel map-wood-bar mt-6 p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <Localized as="h2" className="font-serif text-lg text-beige">Compass Points</Localized>
        <Localized as="span" className="game-counter rounded-md bg-gold px-3 py-1 text-sm font-bold text-navy">
          {completedCount} / {items.length} complete
        </Localized>
      </div>
      <Localized as="ol" className="mt-3 grid gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 text-xs text-beige/75"
          >
            <Badge
              state={item.state}
              icon={item.icon}
              variant="icon"
              size="small"
              aria-hidden="true"
            />
            <Localized as="span">
              {item.label}: {item.status}
            </Localized>
          </li>
        ))}
      </Localized>
    </Localized>
  );
}
