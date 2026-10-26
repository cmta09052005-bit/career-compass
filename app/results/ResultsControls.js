"use client";

import { useEffect, useRef, useState } from "react";
import Localized from "@/components/Localized";
import Button from "@/components/Button";
import { countLabel } from "@/lib/courseSearch";

export default function ResultsControls({ query, onQuery, filters, onFilter, sort, onSort, onClear, options, count, summary, topFiveShown }) {
  const [expanded, setExpanded] = useState(false);
  const [menu, setMenu] = useState(null);
  const controls = useRef(null);
  useEffect(() => {
    const close = event => { if (!controls.current?.contains(event.target)) setMenu(null); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return <div className="results-toolbar" ref={controls} onKeyDown={event => {
    if (event.key === "Escape" && menu) { event.stopPropagation(); setMenu(null); controls.current.querySelector(`[data-filter="${menu}"]`)?.focus(); }
  }}>
    <div className="results-search-row">
      <Localized as="label" className="results-query">Search courses<input type="search" value={query} placeholder="Course, group, career or topic" onChange={event => onQuery(event.target.value)} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onQuery(""); } }} /></Localized>
      <Localized as="label" className="results-sort">Sort courses<select aria-label="Sort courses" value={sort} onChange={event => onSort(event.target.value)}><option value="best">Best match first</option><option value="lowest">Lowest match first</option><option value="az">A to Z</option></select></Localized>
      <Button label="Filters" variant="secondary" className="results-filter-toggle" aria-expanded={expanded} aria-controls="results-filter-panels" onClick={() => { setExpanded(!expanded); setMenu(null); }} />
      <Button label="Clear all" variant="secondary" className="results-clear" onClick={() => { setMenu(null); onClear(); }} />
    </div>
    <div className="results-filter-panels" id="results-filter-panels" data-expanded={expanded}>
      {[["groups", "Course group"], ["schoolTypes", "School type on our list"], ["locations", "Location on our list"]].map(([key, label]) => <details key={key} open={menu === key} className="results-filter-group">
        <Localized as="summary" data-filter={key} onClick={event => { event.preventDefault(); setMenu(menu === key ? null : key); }}>{label}{filters[key].length ? ` (${filters[key].length})` : ""}</Localized>
        <Localized as="div" className="results-filter-menu" role="group" aria-label={label}>{options[key].map((option, i) => <Localized as="label" key={option.id} htmlFor={`results-${key}-${i}`}><input id={`results-${key}-${i}`} type="checkbox" checked={filters[key].includes(option.id)} onChange={() => onFilter(key, option.id)} />{option.label}</Localized>)}</Localized>
      </details>)}
    </div>
    <div className="results-filter-status"><Localized as="p" role="status" aria-live="polite" aria-atomic="true">{countLabel(count)}{topFiveShown ? ", top 5 shown" : ""}</Localized>{summary && <Localized as="p" className="results-active-filters" title={summary}>{summary}</Localized>}</div>
  </div>;
}
