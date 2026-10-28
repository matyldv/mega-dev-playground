import { mkdirSync, writeFileSync } from 'node:fs';
import { reviewReports } from '../src/lib/kb/review.ts';
import { rows, notes, tenantOf } from './data.mjs';

const review = reviewReports(rows, tenantOf);
const out = new URL('../evidence/', import.meta.url);
mkdirSync(out, { recursive: true });
writeFileSync(new URL('summary.json', out), JSON.stringify({
  snapshot: '2026-10-04',
  reviewed: '2026-10-28',
  rows: review.rows,
  uniqueReports: review.reports.length,
  duplicateRows: review.duplicates,
  intakeDisagreements: review.intakeDisagreements,
  firstReceived: review.firstReceived,
  lastReceived: review.lastReceived,
  firstMerged: review.firstMerged,
  busiestMergeDay: review.busiestMergeDay,
  months: review.months,
  groups: review.groups.map(({ reports, ...g }) => ({ ...g, count: reports.length })),
}, null, 2) + '\n');

const detail = {
  parser: {
    title: '[#4471 split] Shared month-first parser flips day-first dates',
    mechanism: 'The shared parser reads month first while these tenants write day first. This is the parser path, not the booking-v3 hint path.',
    fix: 'Make shared parsing respect the tenant date order (or an explicit unambiguous input contract). Keep month-first tenant behavior intact.',
    checks: 'Test ambiguous dates (7 April versus 4 July), unambiguous day-first dates, all affected tenant locales, and month-first controls. Reproduce the five timing-symptom reports before calling them explained.',
  },
  hint: {
    title: '[#4471 split] booking-v3 date hint contradicts day-first form parsing',
    mechanism: 'booking-v3 prints MM/DD/YYYY, so people follow a month-first hint, but the form reads the tenant’s day-first order. The affected form tenants are alder.physio (de-DE), copper.studio (es-ES), and pale.harbour (pt-PT). This needs a different fix from the shared parser.',
    fix: 'Make the booking-v3 date-field hint and parser agree with tenant date order. Do not treat a shared-parser fix as a fix for this form.',
    checks: 'Test booking-v3 display and parsing in de-DE, es-ES, and pt-PT; browser locale differing from tenant locale; booking-v2 controls; ambiguous and unambiguous dates.',
  },
};

for (const g of review.groups) {
  const ids = g.reports.map((r) => r.id).sort();
  writeFileSync(new URL(`${g.cause}-report-ids.json`, out), JSON.stringify(ids, null, 2) + '\n');
  const d = detail[g.cause];
  if (!d) throw new Error(`Unplaced cause: ${g.cause}`);
  const special = g.reports.filter((r) => notes.oneDayMove.includes(r.id));
  const examples = g.reports.filter((r) => !notes.oneDayMove.includes(r.id)).slice(0, 3)
    .map((r) => `- **${r.id}** — ${r.tenant}, ${tenantOf(r).locale}, ${tenantOf(r).form}, ${r.channel}; intake tag \`${r.meta.intakeTag}\`.\n  > ${r.body}`).join('\n');
  const tags = Object.entries(g.taggedAs).map(([tag, n]) => `\`${tag}\`: ${n}`).join('; ');
  const flagged = special.length
    ? `\n## Unresolved symptom evidence\n\n${special.length} reports are included in this count by the supplied tenant-based classifier, but their bodies contain timing/one-day-move readings. They are not an extra group or a proven timezone/DST bug. Keep them visible and request input, expected/actual dates, timezone, and reproduction:\n\n${special.map((r) => `- **${r.id}**: ${r.body}`).join('\n')}\n`
    : '';
  const body = `# ${d.title}\n\n## Scope and count\n\n**${g.reports.length} unique reports** merged into support ticket **#4471** belong to this cause in the **4 October 2026 export**. This is a snapshot, not a live count. First received: **${g.firstSeen}**; last received: **${g.lastSeen}**; affected tenants: **${g.tenants}**.\n\nDeduplicated by report ID before grouping. Across #4471 there are ${review.rows} export rows, ${review.duplicates} duplicate rows, and ${review.reports.length} unique reports. This ticket and the other cause ticket have disjoint membership and together cover every unique report.\n\n## Cause\n\n${d.mechanism}\n\nThe supplied \`causeOf\` uses tenant locale, form version, and entry channel. It does not classify by subject, browser locale, or intake tag. Intake tags within this group are ${tags}; tags are guesses, not ground truth. Unknown tenants must not be merged without investigation.\n\n## Evidence\n\n${examples}\n${flagged}\n## Remediation and checks\n\n${d.fix}\n\n${d.checks}\n\n## Audit trail and ongoing triage\n\n- Complete membership: [${g.cause}-report-ids.json](https://github.com/matyldv/mega-dev-playground/blob/main/evidence/${g.cause}-report-ids.json).\n- Signed KB review source: [4471-review](https://github.com/matyldv/mega-dev-playground/blob/main/src/routes/kb/incidents/4471-review/+page.svx).\n- Rendered review: [HTML](https://github.com/matyldv/mega-dev-playground/blob/main/rendered/kb/incidents/4471-review/index.html).\n- Decision 0002 supersedes subject-only merging; decision 0001 remains unchanged. Read bodies and match supported cause within a product. Preserve unknown or conflicting evidence separately.\n- The July merge spike is desk activity; reports were already arriving in April and continued afterward. \`known\` is not proof of one bug or a shipped fix.\n\nAuthored by **Codex (AI harness)** for S01E03, reviewed **28 October 2026**. No production fix or current queue state is claimed.\n`;
  writeFileSync(new URL(`${g.cause}-issue.md`, out), body.replaceAll('—', '—').replaceAll('’', '’').replaceAll('\n', '\n').replaceAll('\`', '`'));
}
console.log(`Evidence: ${review.reports.length} reports in ${review.groups.map((g) => `${g.cause}=${g.reports.length}`).join(', ')}; ${review.intakeDisagreements} intake disagreements.`);
