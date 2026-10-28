# Verification — 28 October 2026

## Findings

- 427 export rows, 15 repeated rows, 412 unique report IDs. Repeated rows agree.
- Classify from tenant locale, booking-form version, and entry channel:
  **379 parser**, **33 hint**, with exhaustive, disjoint membership.
- 38 intake tags disagree with the tenant-based grouping.
- Five desk-note timing/one-day-move reports remain visible inside the parser
  count. No timezone or third implementation cause is established.
- First received 1 April; first merged 2 July. The 2 July batch contains 184
  reports. Arrivals continue through the 4 October snapshot.
- Accepted decision 0001 and all exported report/tenant/desk-note data match
  SHA-256 hashes from the original ZIP.

## Automated checks

`npm test`: seven passing tests covering membership, intake disagreement, tenant
configuration, merge/non-merge behavior, unknown causes, symptom notes, timeline,
signature generation, and protected export files.

`npm run evidence`: regenerates counts, both issue drafts, and full membership lists.

`npm run build`: compiles the actual Svelte/mdsvex pages and server-renders all
six pages as standalone HTML with compiled CSS. Non-blocking mdsvex sourcemap
warnings do not affect the displayed HTML.

## Browser checks

- Signed review displays computed 379/33 groups, 412 unique reports, 38 intake
  disagreements, the received/merged timeline, all five flagged report bodies,
  and a signature-derived desk reference.
- Index discovers both newly added pages through its existing glob.
- Same subject / same tenant (alder.physio) / different channel (form vs app):
  **different causes — keep apart**.
- Different subjects / same tenant (kettle.books) / app vs email:
  **same cause — merge**.
- Screenshots in this directory show the review and the interactive triage state.

## Tooling

Dependencies are pinned and install lifecycle scripts were disabled. The initial
latest-version install hit npm's release-age protection; that protection was
not disabled. Patched compatible Svelte and Vite versions removed the reported
high/moderate findings. npm still reports four low-severity findings in development
dependencies. The preview binds only to 127.0.0.1; it is not deployed.

## Publication state

Each `gh` command requires the student's separate approval. Approved read-only
checks confirmed the signed-in account, public repository, enabled issues,
admin access, and no pre-existing issues.

The student separately approved creation of parser issue #1:
https://github.com/matyldv/mega-dev-playground/issues/1

The student separately approved creation of hint issue #2:
https://github.com/matyldv/mega-dev-playground/issues/2

`src/lib/data/issue-links.json` records both returned issue URLs. The rendered
pages were rebuilt and checked for both live links, the derived desk reference,
and every flagged symptom report. Seven tests pass.

At this verification checkpoint, the KB files have not been pushed. Publication
requires the student's separate approval. The Git author will use an explicit
AI-harness identity rather than publish the student's configured work email.
