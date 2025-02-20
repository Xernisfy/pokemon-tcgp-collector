import { filterRarity } from "utils/signals.ts";
import { Rarity } from "utils/types.ts";

export const rarities = [["normal", "Normal"], ["secret", "Selten"]] as const;

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
        {rarities.map(([option, text]) => <option value={option}>{text}
        </option>)}
      </select>
    </>
  );
}
