<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { reviewReports } from '#lib/kb/review';
  import { tenantOf } from '#lib/kb/locales';
  import type { Report } from '#lib/kb/causes';
  const review = reviewReports(reports as Report[], tenantOf);
</script>

<p>
  Reports first arrived on {review.firstReceived}, but the first recorded merges
  happened on {review.firstMerged}.
  The busiest merge day was {review.busiestMergeDay?.[0]}, with
  <strong>{review.busiestMergeDay?.[1]}</strong> merges.
  A merge spike is desk activity, not proof that the product broke that day.
  The separate received series shows reports before that spike and after it.
</p>
<table>
  <thead><tr><th>Month</th><th>Received</th><th>Merged into #4471</th></tr></thead>
  <tbody>{#each review.months as m (m.month)}<tr><td>{m.month}</td><td>{m.received}</td><td>{m.merged}</td></tr>{/each}</tbody>
</table>
<p>Dates and counts above describe the export only. They do not show current queue size, a shipped fix, or incident resolution.</p>
