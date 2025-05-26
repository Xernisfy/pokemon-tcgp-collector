import { rarityValues } from "utils/const.ts";
import { filterRarity } from "utils/signals.ts";
import { Rarity } from "utils/types.ts";

export function SelectRarity() {
  return (
    <>
      <label>Seltenheit:</label>
      <select
        class="filter"
        value={filterRarity.value}
        onInput={(e) => filterRarity.value = e.currentTarget.value as Rarity}
      >
        <option value="all">Alle</option>
        {rarityValues.map((option) => (
          <option
            key={option}
            value={option}
            class={option.startsWith("group-") ? "group" : undefined}
          >
            {option.replace("group-", "")}
          </option>
        ))}
      </select>
    </>
  );
}
