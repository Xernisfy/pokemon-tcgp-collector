import { filterObtained } from "utils/signals.ts";

const values = [["obtained", "Ja"], [
  "unobtained",
  "Nein",
]] as const;

export function SelectObtained() {
  return (
    <>
      <label>Im Besitz:</label>
      <select
        class="filter"
        value={filterObtained.value}
        onInput={(e) =>
          filterObtained.value = e.currentTarget.value as typeof values[number][0]}
      >
        <option value="all">Alle</option>
        {values.map(([option, text]) => <option value={option}>{text}</option>)}
      </select>
    </>
  );
}
