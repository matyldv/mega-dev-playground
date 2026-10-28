import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { causeOf, sameCause, uniqueById, dayFirst } from '../src/lib/kb/causes.ts';
import { reviewReports } from '../src/lib/kb/review.ts';
import { deskRef } from '../src/lib/kb/desk-ref.ts';
import { rows, notes, tenants, tenantOf } from '../scripts/data.mjs';

const review = reviewReports(rows, tenantOf);

test('repository README links to the root-level signed page and desk views', () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  for (const path of [
    'src/routes/kb/incidents/4471-review/+page.svx',
    'rendered/kb/incidents/4471-review/index.html',
    'evidence/review-preview.jpg',
    'evidence/review-signature-preview.jpg',
  ]) {
    assert.ok(readme.includes(`](${path})`), `Missing direct link: ${path}`);
    assert.ok(readFileSync(new URL(`../${path}`, import.meta.url)).length > 0, path);
  }
});

test('later engineering update distinguishes a fixed parser from a retired form', () => {
  const update = JSON.parse(readFileSync(new URL('../src/lib/data/engineering-update.json', import.meta.url), 'utf8'));
  assert.equal(update.closedAt, '2026-10-05');
  assert.deepEqual(update.outcomes.map((o) => [o.cause, o.status, o.githubReason]), [
    ['parser', 'FIXED', 'completed'],
    ['hint', "WON'T FIX", 'not_planned'],
  ]);
  assert.equal(update.outcomes[0].detail, 'fix(dates): parse dd/mm for eu locales');
  assert.equal(update.outcomes[1].detail, 'booking-v3 form retired');
});

test('overlap deduplication yields exhaustive, disjoint cause membership', () => {
  assert.equal(rows.length, 427);
  assert.equal(uniqueById(rows).length, 412);
  assert.equal(review.duplicates, 15);
  assert.deepEqual(Object.fromEntries(review.groups.map((g) => [g.cause, g.reports.length])), { parser: 379, hint: 33 });
  const ids = review.groups.flatMap((g) => g.reports.map((r) => r.id));
  assert.equal(ids.length, 412);
  assert.equal(new Set(ids).size, 412);
  for (const r of rows) assert.ok(ids.includes(r.id));
  for (const r of rows) assert.deepEqual(r, review.reports.find((x) => x.id === r.id));
});

test('tenant configuration, not intake tags or browser locale, determines cause', () => {
  assert.equal(review.intakeDisagreements, 38);
  const r = review.reports.find((r) => r.id === 'R-41230');
  assert.equal(r.meta.intakeTag, 'parser');
  assert.equal(causeOf(r, tenantOf(r)), 'hint');
  assert.ok(dayFirst('de-DE'));
  assert.ok(!dayFirst('en-US'));
  assert.equal(causeOf({ channel: 'form' }, { locale: 'en-US', form: 'booking-v3' }), null);
});

test('subjects are neither sufficient nor necessary; unknown causes stay separate', () => {
  const alder = tenants.get('alder.physio');
  const kettle = tenants.get('kettle.books');
  assert.equal(sameCause({ channel: 'form' }, alder, { channel: 'app' }, alder), false);
  assert.equal(sameCause({ channel: 'app' }, kettle, { channel: 'email' }, kettle), true);
  assert.equal(sameCause({ channel: 'email' }, undefined, { channel: 'email' }, undefined), false);
});

test('five flagged symptom reports remain visible and counted once in parser', () => {
  const parserIds = new Set(review.groups.find((g) => g.cause === 'parser').reports.map((r) => r.id));
  assert.equal(notes.oneDayMove.length, 5);
  for (const id of notes.oneDayMove) assert.ok(parserIds.has(id));
});

test('received timeline distinguishes the backlog merge from report arrivals', () => {
  assert.equal(review.firstReceived, '2026-04-01');
  assert.equal(review.firstMerged, '2026-07-02');
  assert.deepEqual(review.busiestMergeDay, ['2026-07-02', 184]);
  assert.equal(review.months.reduce((n, m) => n + m.received, 0), 412);
  assert.equal(review.months.reduce((n, m) => n + m.merged, 0), 412);
  assert.equal(review.months.find((m) => m.month === '2026-04').merged, 0);
});

test('signature produces a deterministic, nonempty desk reference', () => {
  const signature = 'Codex | S01E03 | matyldv/mega-dev-playground | 2026-10-28';
  assert.match(deskRef(signature), /^DR-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
  assert.equal(deskRef(signature), deskRef(` ${signature} `));
});

test('accepted decision 0001 and exported data remain byte-for-byte unchanged', () => {
  const hashes = JSON.parse(readFileSync(new URL('../evidence/export-sha256.json', import.meta.url), 'utf8'));
  const files = [
    'src/routes/kb/decisions/0001-dedupe-by-subject/+page.svx',
    'src/lib/data/reports-4471.json',
    'src/lib/data/desk-notes.json',
    ...[...tenants.keys()].map((handle) => `src/lib/data/tenants/${handle}.json`),
  ];
  for (const file of files) {
    const actual = readFileSync(new URL(`../${file}`, import.meta.url));
    assert.equal(createHash('sha256').update(actual).digest('hex'), hashes[file], file);
  }
});
