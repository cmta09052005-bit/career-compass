import { ICON_PATHS } from "@/lib/itemIconsV2";

export default function StatementIcon({ icon = "neutral" }) {
  return <svg className="forest-statement-icon" data-icon={icon} viewBox="0 0 100 112" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON_PATHS[icon] || ICON_PATHS.neutral} /></svg>;
}
