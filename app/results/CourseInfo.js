"use client";

import { createElement as h } from "react";
import Link from "next/link.js";

// Plain React rendering also lets Node tests exercise the actual visible links.
export default function CourseInfo({ course, info, hint, onLeave, t = value => value }) {
  const item = (label, text, tab) => h("div", { className: "course-info-item", key: tab },
    h("span", { className: "course-info-label" }, t(label)),
    h(Link, { href: `/results/${course.id}#${tab}`, prefetch: false, onNavigate: onLeave, onClick: event => event.stopPropagation(), title: t(text), "aria-label": t(`${label} for ${course.name}: ${text}`) }, t(text)));
  return h("div", { className: "course-info" },
    h("div", { className: "course-info-links" },
      item("Overview", info.overview, "overview"),
      info.school ? item("School", info.school.label, "schools") : h("div", { className: "course-info-item" }, t("No school on our list yet")),
      item("Career", info.job || "Careers", "careers")),
    hint && h("p", { className: "course-match-hint", title: t(hint.text) }, t(`Matched on ${hint.field}: ${hint.text}`)));
}
