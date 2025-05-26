import { isDuplicate } from "utils/sets.ts";
import {
  filterObtained,
  filterPack,
  filterRarity,
  filterSet,
  packs,
  rarities,
  user,
  userCards,
} from "utils/signals.ts";
import { Rarity } from "utils/types.ts";
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
  const currentRarity = rarities.value[key];
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
      filterRarity.value !== "all" && filterRarity.value !== currentRarity
    ) {
      if (filterRarity.value === "group-Normal") {
        if (
          !(["🔷", "🔷🔷", "🔷🔷🔷", "🔷🔷🔷🔷"] as Rarity[]).includes(
            currentRarity,
          )
        ) return true;
      } else if (filterRarity.value === "group-Geheim") {
        if (
          !(["⭐", "⭐⭐", "⭐⭐⭐", "👑", "✨", "✨✨"] as Rarity[]).includes(
            currentRarity,
          )
        ) return true;
      } else return true;
    }
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
