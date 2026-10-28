# S01E03 — what it shows

Investigation of the MEGA.dev support KB export for ticket #4471.

## Deliverables

- [Signed review source (.svx)](support-kb/src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered review (standalone HTML)](support-kb/rendered/kb/incidents/4471-review/index.html)
- Desk view: [review screenshot](support-kb/evidence/review-preview.jpg) and [signature screenshot](support-kb/evidence/review-signature-preview.jpg)
- Tickets: [parser, 379 reports](https://github.com/matyldv/mega-dev-playground/issues/1) and [form hint, 33 reports](https://github.com/matyldv/mega-dev-playground/issues/2)
- [Replacement decision 0002](support-kb/src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx)
- [Evidence and report membership](support-kb/evidence/)
- [KB conventions](support-kb/README.md)

The KB project uses the original `support-kb/` layout:
`support-kb/src/routes/kb/` contains its pages, and `support-kb/rendered/kb/`
contains their compiled desk views. Report and tenant data are unchanged.
These paths also match the links in the GitHub issues.

The report data is a **4 October 2026 snapshot**, reviewed on **28 October 2026**.
The signed review also includes the course's **5 October 2026 engineering
update**: the parser was fixed; the booking-v3 form was retired, so the hint
was not fixed. It is not a live connection to the support desk. This repository
contains the investigation and KB changes, not production product code.

## Reproduce

```sh
cd support-kb
npm ci --ignore-scripts
npm test
npm run evidence
npm run build
npm run dev -- --host 127.0.0.1
```

Open `/kb/incidents/4471-review/`. Build renders the real Svelte/mdsvex pages,
including computed tables, the timeline, the index, and the signature-derived
desk reference. Standalone HTML snapshots include the compiled CSS and need no
JavaScript; the local site also provides the interactive dedupe explorer.

No GitHub mutation is part of these scripts.
