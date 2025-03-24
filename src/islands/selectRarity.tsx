import { filterRarity } from "utils/signals.ts";
import { Rarity } from "utils/types.ts";
import { rarityValues } from "utils/const.ts";

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
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </>
  );
}
