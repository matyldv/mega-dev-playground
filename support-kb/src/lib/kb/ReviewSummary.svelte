<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import links from '#lib/data/issue-links.json';
  import { reviewReports } from '#lib/kb/review';
  import { tenantOf } from '#lib/kb/locales';
  import type { Report } from '#lib/kb/causes';

  const review = reviewReports(reports as Report[], tenantOf);
  const names = {
    parser: 'Shared parser reads day-first input as month-first',
    hint: 'booking-v3 hint says MM/DD/YYYY in day-first tenants',
    unplaced: 'Unplaced — investigate before merging',
  };
</script>

<p>
  The export has <strong>{review.rows}</strong> rows, including
  <strong>{review.duplicates}</strong> repeated rows.
  After deduplication by report ID, <strong>{review.reports.length}</strong> reports
  remain in #4471, received from {review.firstReceived} to {review.lastReceived}.
  Tenant locale, channel, and booking-form version place them in
  <strong>{review.groups.length}</strong> cause groups.
</p>
<table>
  <thead><tr><th>Problem / ticket</th><th>Reports</th><th>Tenant count</th><th>First → last received</th></tr></thead>
  <tbody>
    {#each review.groups as g (g.cause)}
      <tr>
        <td>
          {#if links[g.cause as keyof typeof links]}
            <a href={links[g.cause as keyof typeof links] ?? ''}>{names[g.cause]}</a>
          {:else}
            {names[g.cause]} <small>(local issue draft)</small>
          {/if}
        </td>
        <td><strong>{g.reports.length}</strong></td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>
<p>
  Intake tags disagree with the tenant-based cause in <strong>{review.intakeDisagreements}</strong>
  reports. Browser locale and intake tags are not the routing authority.
  The cause table below shows the conflicting tags rather than hiding them.
</p>

<style>
  small { display: block; color: var(--muted); }
  td:first-child { min-width: 220px; }
</style>
