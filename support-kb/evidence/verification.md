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
- The later engineering update closes #4471 on 5 October 2026 with different
  outcomes: parser fixed; hint won't fix because booking-v3 was retired. The
  signed review now preserves both the historical counts and this later update.

## Automated checks

`npm test`: nine tests covering publication paths, engineering outcomes, membership, intake disagreement, tenant
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
and every flagged symptom report.

The initial KB was published in commit d7f2c52 using an explicit AI-harness
identity rather than publishing the student's configured work email. The course
accepted the tickets, then rejected closing both as completed. An approved
read-only check found no new GitHub issue comments. Reloading the Challenge page
revealed the engineering update that appeared after the first submission.

The student separately approved reopening hint issue #2 and closing it again as
not planned, with a public explanation citing form retirement. The parser keeps
its completed reason because the engineering update marks it fixed.

Commit 52cb253 published the engineering-outcome correction. The course still
rejected the ticket closure. An individually approved read of parser issue #1
showed that its only comment closed the investigation without recording the
desk's parser fix. A separately approved correction comment now records the
5 October fix and the 379-report scope.

The next submission advanced to a different rejection: the course could not
find the KB page. Commit 336c5c8 moved the project from `support-kb/` to the
repository root and added direct README links. This did not resolve the course's
page-discovery rejection. The subsequent proposed issue-body edit was declined
and did not run.

Nine tests and the build pass after the move. The review source, its rendered
HTML, and accepted decision 0001 are byte-for-byte identical to their
pre-move versions. The restarted localhost preview displays the review,
both issue links, the engineering outcomes, and desk ref DR-8V74-D6B5.

The student requested restoration of the original `support-kb/` paths.
The project, build outputs, evidence generator, and README links now use that
layout again. No GitHub issue changes are needed to restore their original
links. The engineering-outcome corrections are preserved.
All nine tests and the build pass in the restored location. The review source,
rendered review, evidence generator, and accepted decision 0001 match their
versions in commit 52cb253 byte for byte. A fresh browser tab displays the
restored localhost review.

This restoration is local and requires approval before publication. The
Challenge remains unsolved.
