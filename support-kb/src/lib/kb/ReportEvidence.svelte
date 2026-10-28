<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, causeOf, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const flagged = uniqueById(reports as Report[]).filter((r) => notes.oneDayMove.includes(r.id));
</script>

<p>
  <strong>{flagged.length}</strong> reports are flagged by desk notes as one-day-move
  readings. The supplied classifier places them in the parser group; they are
  already included in that count, not extra reports or a third confirmed cause.
  Their bodies do not establish timezone, DST, or any other implementation fault.
  Keep this uncertainty attached to the reports and request original input,
  expected date, actual date, timezone, and a reproducible case.
</p>
<ul>
  {#each flagged as r (r.id)}
    <li>
      <strong>{r.id}</strong> · {r.tenant} · {r.channel} · filed as {causeOf(r, tenantOf(r))}
      <blockquote>{r.body}</blockquote>
    </li>
  {/each}
</ul>
