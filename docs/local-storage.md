# Local progress persistence

Career Compass saves one journey per browser profile and site origin using
localStorage, without an account or server-side storage. Reloading, closing a
tab, and reopening the browser retain the saved journey on the same device.
Clearing site data or using a different browser/profile does not retain it.
Private browsing and browser storage restrictions can limit persistence.

## Persisted state

- The existing `careerCompassSession` record keeps intake information, answers,
  validated completion flags, course comparisons, journal exploration history,
  and report download metadata. Results are still calculated from the answers.
- Existing separate keys keep journey briefings, guide and achievement notices,
  Atlas position, and the academic form step.
- Language, sound, and the already-seen introduction are browser preferences.
- Animation state, open dialogs, hover/drag state, validation messages, and
  temporary download state remain in memory. Assessment screens continue to
  derive their initial question from the saved answers.

## Compatibility and clearing

`lib/browserStorage.js` retains the original keys and value formats. Existing
sessionStorage data is migrated on first access. An existing local journey wins
over a legacy tab's journey; older journey notices are not mixed into it.
A migration marker allows interrupted migration to resume and prevents stale
legacy tabs from resurrecting a journey after restart. The remaining references
to sessionStorage are compatibility reads and cleanup, not ongoing persistence.

Updates are saved synchronously before navigation. Storage subscriptions keep
mounted readers and other tabs current; mounting a reader never writes an older
snapshot back over the saved record. Malformed records are normalized, and
completion remains subject to the existing assessment validation.

Restart Assessment clears the journey record and all related journey keys,
including comparisons, journal history, and report metadata. It keeps language,
sound, and introduction preferences. Explicitly leaving a trail still discards
that section's answers after confirmation. Ordinary navigation, tab closure,
and report download do not clear answers.

When a write or deletion fails, the current page retains the latest state in
memory, displays a saving warning, and warns on leaving. Pending changes retry
on focus and before leaving. These changes are not promised to survive closure
until the browser accepts the save.

## Verification

- `node --test lib/*.test.js lib/i18n/*.test.js` covers storage migration,
  interruption recovery, reset, blocked storage, notifications, and the existing
  scoring, validation, comparison, and translation regressions.
- Browser checks use an isolated Edge profile: refresh, closing/reopening a tab,
  fully closing/relaunching the browser, Home continuation, partial assessment
  restoration, academic step restoration, completion, comparisons, journal
  history, PDF download, language restoration, cross-tab edits and restart,
  explicit section discard, malformed records, and blocked saving.
- This change does not add offline/PWA support or revise the manuscript.
