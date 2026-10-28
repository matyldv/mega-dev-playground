import { groupByCause, uniqueById, type Report, type Tenant } from './causes.ts';

export function reviewReports(rows: Report[], tenantOf: (r: Report) => Tenant | undefined) {
  const reports = uniqueById(rows).filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(reports, tenantOf);
  const intakeDisagreements = groups.reduce(
    (n, g) => n + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0,
  );
  const months = [...new Set(reports.map((r) => r.receivedAt.slice(0, 7)))].sort().map((month) => ({
    month,
    received: reports.filter((r) => r.receivedAt.startsWith(month)).length,
    merged: reports.filter((r) => r.mergedAt?.startsWith(month)).length,
  }));
  const mergeDays = new Map<string, number>();
  for (const r of reports) {
    if (r.mergedAt) {
      const day = r.mergedAt.slice(0, 10);
      mergeDays.set(day, (mergeDays.get(day) ?? 0) + 1);
    }
  }
  const busiestMergeDay = [...mergeDays].sort((a, b) => b[1] - a[1])[0] ?? null;
  const firstMerged = [...mergeDays.keys()].sort()[0] ?? null;
  const receivedDays = reports.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    rows: rows.length,
    duplicates: rows.length - uniqueById(rows).length,
    reports, groups, intakeDisagreements, months, busiestMergeDay, firstMerged,
    firstReceived: receivedDays[0] ?? null,
    lastReceived: receivedDays.at(-1) ?? null,
  };
}
