# [#4471 split] Shared month-first parser flips day-first dates

## Scope and count

**379 unique reports** merged into support ticket **#4471** belong to this cause in the **4 October 2026 export**. This is a snapshot, not a live count. First received: **2026-04-01**; last received: **2026-10-04**; affected tenants: **11**.

Deduplicated by report ID before grouping. Across #4471 there are 427 export rows, 15 duplicate rows, and 412 unique reports. This ticket and the other cause ticket have disjoint membership and together cover every unique report.

## Cause

The shared parser reads month first while these tenants write day first. This is the parser path, not the booking-v3 hint path.

The supplied `causeOf` uses tenant locale, form version, and entry channel. It does not classify by subject, browser locale, or intake tag. Intake tags within this group are `parser`: 356; `hint`: 23; tags are guesses, not ground truth. Unknown tenants must not be merged without investigation.

## Evidence

- **R-41200** — harbour.dental, en-GB, booking-v2, app; intake tag `parser`.
  > Our 7 April reminder went out on 4 July. Is this a joke. It is not April Fools where we are.
- **R-41201** — harbour.dental, en-GB, booking-v2, app; intake tag `parser`.
  > Sorry. 4 July went out on 7 April. I have been up since five.
- **R-41203** — lantern.row, cs-CZ, booking-v2, app; intake tag `parser`.
  > Booked for 2 December. The invite says 12 February.

## Unresolved symptom evidence

5 reports are included in this count by the supplied tenant-based classifier, but their bodies contain timing/one-day-move readings. They are not an extra group or a proven timezone/DST bug. Keep them visible and request input, expected/actual dates, timezone, and reproduction:

- **R-41202**: Invite says Tuesday 12 May. Calendar says Monday 11 May. My client turned up on the Monday. We had coffee.
- **R-41209**: Every booking in June is one day off. Only June. Why only June.
- **R-41236**: The invite arrived before I made the booking. I would like to know how.
- **R-41344**: Client in Lisbon got Tuesday. Client in Toronto got Monday. Same meeting. We held it twice.
- **R-41620**: Tuesday 6 October showed as Monday. I moved it myself. I have stopped reporting these but my colleague says it helps you.

## Remediation and checks

Make shared parsing respect the tenant date order (or an explicit unambiguous input contract). Keep month-first tenant behavior intact.

Test ambiguous dates (7 April versus 4 July), unambiguous day-first dates, all affected tenant locales, and month-first controls. Reproduce the five timing-symptom reports before calling them explained.

## Audit trail and ongoing triage

- Complete membership: [parser-report-ids.json](https://github.com/matyldv/mega-dev-playground/blob/main/evidence/parser-report-ids.json).
- Signed KB review source: [4471-review](https://github.com/matyldv/mega-dev-playground/blob/main/src/routes/kb/incidents/4471-review/+page.svx).
- Rendered review: [HTML](https://github.com/matyldv/mega-dev-playground/blob/main/rendered/kb/incidents/4471-review/index.html).
- Decision 0002 supersedes subject-only merging; decision 0001 remains unchanged. Read bodies and match supported cause within a product. Preserve unknown or conflicting evidence separately.
- The July merge spike is desk activity; reports were already arriving in April and continued afterward. `known` is not proof of one bug or a shipped fix.

Authored by **Codex (AI harness)** for S01E03, reviewed **28 October 2026**. No production fix or current queue state is claimed.
