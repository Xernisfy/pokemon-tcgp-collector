import { useSignal } from "@preact/signals";

export function HeaderToggle() {
  const state = useSignal(false);
  return (
    <button
      id="header-toggle"
      type="button"
      onClick={() => {
        state.value = !state.value;
        document.getElementById("header-items")?.classList.toggle("collapsed");
      }}
    >
      {state.value ? "⌄" : "⌃"}
    </button>
  );
}
