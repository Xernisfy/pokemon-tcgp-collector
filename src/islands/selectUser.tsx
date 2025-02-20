import { IS_BROWSER } from "denoland/fresh/src/runtime/utils.ts";
import { user } from "utils/signals.ts";

interface SelectUserProps {
  users: string[];
}

export function SelectUser(props: SelectUserProps) {
  if (IS_BROWSER && !user.value) {
    user.value = new URLSearchParams(location.search).get("user") || "Hase";
  }
  return (
    <select
      class="filter"
      value={user.value}
      onInput={(e) => user.value = e.currentTarget.value}
    >
      {props.users.map((option) => <option value={option}>{option}</option>)}
    </select>
  );
}
