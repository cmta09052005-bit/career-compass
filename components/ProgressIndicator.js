import Badge from "@/components/Badge";

export default function ProgressIndicator({ items, completedCount }) {
  return (
    <section
      aria-label={`Compass Points: ${completedCount} of ${items.length} sections completed`}
      className="mt-6 rounded-2xl border border-beige/15 bg-navy/45 p-4 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-lg">Compass Points</h2>
        <span className="text-sm font-semibold text-gold">
          {completedCount} / {items.length} complete
        </span>
      </div>
      <ol className="mt-3 grid gap-2 sm:grid-cols-3">
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
            <span>
              {item.label}: {item.status}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
