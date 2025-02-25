import { isDuplicate, sets } from "utils/sets.ts";
import {
  filterObtained,
  filterPack,
  filterRarity,
  filterSet,
  packs,
  user,
  userCards,
} from "utils/signals.ts";
import { Pack } from "./pack.tsx";

interface CardProps {
  setId: string;
  setLink: string;
  index: number;
}

export function Card(props: CardProps) {
  const key = props.setId + "/" + props.index;
  const userCardsKey = user.value + "/" + key;
  const currentCount = userCards.value[userCardsKey] || 0;
  const currentPack = packs.value[key];
  function update() {
    fetch(`/api/count/${user.value}/${key}`, {
      method: "PUT",
      body: userCards.value[userCardsKey].toString(),
    });
  }
  function shouldHide() {
    if (filterSet.value !== "all" && filterSet.value !== props.setId) {
      return true;
    }
    if (/*filterSet.value === 'all' &&*/ isDuplicate(key)) return true;
    if (filterPack.value !== "all" && filterPack.value !== currentPack) {
      return true;
    }
    if (
      filterRarity.value === "normal" &&
      props.index >= sets.find((s) => s.id === props.setId)!.cards.normal
    ) return true;
    if (
      filterRarity.value === "secret" &&
      props.index < sets.find((s) => s.id === props.setId)!.cards.normal
    ) return true;
    if (filterObtained.value === "obtained" && currentCount === 0) return true;
    if (filterObtained.value === "unobtained" && currentCount > 0) return true;
    if (filterObtained.value === "tradable") {
      const tradeUser = user.value === "Hase" ? "Bär" : "Hase";
      const tradeCount = userCards.value[tradeUser + "/" + key] || 0;
      if (currentCount === 0 && tradeCount === 0) return true;
      if (currentCount === 1 || tradeCount === 1) return true;
      if (currentCount > 0 && tradeCount > 0) return true;
    }
    return false;
  }
  return (
    <div
      class="card"
      hidden={shouldHide()}
      onClick={() => {
        userCards.value = {
          ...userCards.value,
          [userCardsKey]: currentCount + 1,
        };
        update();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        userCards.value = {
          ...userCards.value,
          [userCardsKey]: Math.max(currentCount - 1, 0),
        };
        update();
      }}
      data-id={key}
    >
      <img
        class="card-image"
        style={`filter: ${currentCount > 0 ? "none" : "grayscale(100%)"};`}
        loading="lazy"
        src={`/api/image/${key}`}
      />{" "}
      <div class="counter">{currentCount}</div>{" "}
      <div class="index">{(props.index + 1).toString().padStart(3, "0")}</div>
      {" "}
      <Pack name={currentPack} setLink={props.setLink} />
    </div>
  );
}
