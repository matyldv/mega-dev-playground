<script lang="ts">
  import update from '#lib/data/engineering-update.json';
  import links from '#lib/data/issue-links.json';

  const format = (iso: string) => new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(iso));
</script>

<section aria-labelledby="engineering-outcome">
  <h2 id="engineering-outcome">Engineering update — {format(update.closedAt)}</h2>
  <p>
    The desk closed #{update.ticket} on {format(update.closedAt)}.
    The <a href={update.source}>course's engineering update</a>, checked on
    {format(update.observedAt)}, gives different outcomes for the two causes:
  </p>
  <table>
    <thead><tr><th>Cause / ticket</th><th>Desk outcome</th><th>Evidence</th><th>Required GitHub closure reason</th></tr></thead>
    <tbody>
      {#each update.outcomes as outcome (outcome.cause)}
        <tr>
          <td><a href={links[outcome.cause as keyof typeof links] ?? ''}>{outcome.cause}</a></td>
          <td><strong>{outcome.status}</strong></td>
          <td>{outcome.detail}</td>
          <td><code>{outcome.githubReason}</code></td>
        </tr>
      {/each}
    </tbody>
  </table>
  <p>
    The hint was not fixed: its form was retired. Do not present retirement as a
    successful hint fix or close that ticket as completed. The parser's fixed
    outcome comes from the desk's update, not from code changes in this repository.
    Neither outcome changes the historical report counts.
  </p>
</section>
