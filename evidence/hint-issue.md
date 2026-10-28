# [#4471 split] booking-v3 date hint contradicts day-first form parsing

## Scope and count

**33 unique reports** merged into support ticket **#4471** belong to this cause in the **4 October 2026 export**. This is a snapshot, not a live count. First received: **2026-04-17**; last received: **2026-09-22**; affected tenants: **3**.

Deduplicated by report ID before grouping. Across #4471 there are 427 export rows, 15 duplicate rows, and 412 unique reports. This ticket and the other cause ticket have disjoint membership and together cover every unique report.

## Cause

booking-v3 prints MM/DD/YYYY, so people follow a month-first hint, but the form reads the tenant’s day-first order. The affected form tenants are alder.physio (de-DE), copper.studio (es-ES), and pale.harbour (pt-PT). This needs a different fix from the shared parser.

The supplied `causeOf` uses tenant locale, form version, and entry channel. It does not classify by subject, browser locale, or intake tag. Intake tags within this group are `parser`: 15; `hint`: 18; tags are guesses, not ground truth. Unknown tenants must not be merged without investigation.

## Evidence

- **R-41230** — copper.studio, es-ES, booking-v3, form; intake tag `parser`.
  > My client came on 1 June instead of 6 January. We sorted it out.
- **R-41241** — alder.physio, de-DE, booking-v3, form; intake tag `hint`.
  > We had two people show up on 8 June. They were booked for 6 August.
- **R-41251** — pale.harbour, pt-PT, booking-v3, form; intake tag `parser`.
  > Wednesday 7 January showed as Wednesday 1 July. I moved it myself.

## Remediation and checks

Make the booking-v3 date-field hint and parser agree with tenant date order. Do not treat a shared-parser fix as a fix for this form.

Test booking-v3 display and parsing in de-DE, es-ES, and pt-PT; browser locale differing from tenant locale; booking-v2 controls; ambiguous and unambiguous dates.

## Audit trail and ongoing triage

- Complete membership: [hint-report-ids.json](https://github.com/matyldv/mega-dev-playground/blob/main/evidence/hint-report-ids.json).
- Signed KB review source: [4471-review](https://github.com/matyldv/mega-dev-playground/blob/main/src/routes/kb/incidents/4471-review/+page.svx).
- Rendered review: [HTML](https://github.com/matyldv/mega-dev-playground/blob/main/rendered/kb/incidents/4471-review/index.html).
- Decision 0002 supersedes subject-only merging; decision 0001 remains unchanged. Read bodies and match supported cause within a product. Preserve unknown or conflicting evidence separately.
- The July merge spike is desk activity; reports were already arriving in April and continued afterward. `known` is not proof of one bug or a shipped fix.

Authored by **Codex (AI harness)** for S01E03, reviewed **28 October 2026**. No production fix or current queue state is claimed.
