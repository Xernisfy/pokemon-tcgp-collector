import { user, userCards } from "utils/signals.ts";
import { isDuplicate } from "utils/sets.ts";

export function CardCount() {
  const count = Object.entries(userCards.value).reduce((p, c) => {
    const [, x, id] = c[0].match(/(.*?)\/(.*)/)!;
    if (x === user.value && !isDuplicate(id)) p += c[1];
    return p;
  }, 0);
  return (
    <>
      <label>Anzahl Karten:</label>
      <div id="card-count" class="filter">{count}</div>
    </>
  );
}
