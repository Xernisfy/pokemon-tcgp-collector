import { sets } from "utils/sets.ts";
import { filterPack, filterSet } from "utils/signals.ts";
import { PackName } from "utils/types.ts";

export function SelectPack() {
  const currentSet = sets.find((s) => s.id === filterSet.value);
  return (
    <>
      <label>Pack:</label>
      <select
        class="filter"
        disabled={!currentSet?.packs.length}
        value={filterPack.value}
        onInput={(e) => filterPack.value = e.currentTarget.value as PackName | "all"}
      >
        <option value="all">Alle</option>
        {currentSet?.packs.map((name) => <option value={name}>{name}</option>)}
      </select>
    </>
  );
}
