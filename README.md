# S01E03 — what it shows

Investigation of the MEGA.dev support KB export for ticket #4471.

- Original export: `support-kb/src/`; report and tenant data are unchanged.
- Signed review: `support-kb/src/routes/kb/incidents/4471-review/+page.svx`.
- Replacement decision: `support-kb/src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx`.
- GitHub issue drafts and report membership: `support-kb/evidence/`.
- Rendered pages: `support-kb/rendered/`.

The KB is a **4 October 2026 snapshot**, reviewed on **28 October 2026**. It is not
a live connection to the support desk. Product fixes have not been applied.

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
