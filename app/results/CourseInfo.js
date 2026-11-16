"use client";

import { createElement as h } from "react";
import Link from "next/link.js";

// Plain React rendering also lets Node tests exercise the actual visible links.
export default function CourseInfo({ course, info, hint, onLeave, t = value => value }) {
  const item = (label, text, tab, title = t(text)) => h("div", { className: "course-info-item", key: tab },
    h("span", { className: "course-info-label" }, t(label)),
    h(Link, { href: `/results/${course.id}#${tab}`, prefetch: false, onNavigate: onLeave, onClick: event => event.stopPropagation(), title, "aria-label": tab === "overview" ? t(`${label} for ${course.name}: ${text}`) : `${t(label)}: ${text}` }, tab === "overview" ? t(text) : text));
  const { names, hasMore, title } = info.careerPreview;
  return h("div", { className: "course-info" },
    h("div", { className: "course-info-links" },
      item("Overview", info.overview, "overview"),
      info.school ? item("Schools", info.schoolPreview.names.join(", ") + (info.schoolPreview.hasMore ? ", ..." : ""), "schools", info.schoolTitle) : h("div", { className: "course-info-item" }, t("No school on our list yet")),
      item("Careers", names.length ? names.join(", ") + (hasMore ? ", ..." : "") : t("Careers"), "careers", title || t("Careers"))),
    hint && h("p", { className: "course-match-hint", title: t(hint.text) }, t(`Matched on ${hint.field}: ${hint.text}`)));
}
