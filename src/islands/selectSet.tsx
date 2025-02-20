import { sets } from "utils/sets.ts";
import { filterPack, filterSet } from "utils/signals.ts";
import { SetId } from "utils/types.ts";

export function SelectSet() {
  return (
    <>
      <label>Set:</label>
      <select
        class="filter"
        value={filterSet.value}
        onInput={(e) => {
          filterSet.value = e.currentTarget.value as SetId | "all";
          filterPack.value = "all";
        }}
      >
        <option value="all">Alle</option>
        {sets.map(({ id, name }) => <option value={id}>{name}</option>)}
      </select>
    </>
  );
}
