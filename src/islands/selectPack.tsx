import { sets } from "utils/sets.ts";
import { filterPack, filterSet } from "utils/signals.ts";
import { PackName } from "utils/types.ts";

const translations: Record<typeof sets[number]["packs"][number], string> = {
  charizard: "Glurak",
  mewtwo: "Mewtu",
  pikachu: "Pikachu",
  dialga: "Dialga",
  palkia: "Palkia",
  lunala: "Lunala",
  solgaleo: "Solgaleo",
};

export function SelectPack() {
  const currentSet = sets.find((s) => s.id === filterSet.value);
  return (
    <>
      <label>Pack:</label>
      <select
        class="filter"
        disabled={!currentSet?.packs.length}
        value={filterPack.value}
        onInput={(e) =>
          filterPack.value = e.currentTarget.value as PackName | "all"}
      >
        <option value="all">Alle</option>
        {currentSet?.packs.map((name) => (
          <option key={name} value={name}>{translations[name] || name}</option>
        ))}
      </select>
    </>
  );
}
