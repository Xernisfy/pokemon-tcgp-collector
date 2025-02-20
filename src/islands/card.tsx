import { sets } from "utils/sets.ts";
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
  const userCardsKey = `${user.value}/${props.setId}/${props.index}`;
  const currentCount = userCards.value[userCardsKey] || 0;
  const currentPack = packs.value[`${props.setId}/${props.index}`];
  function update() {
    fetch(`/api/count/${user.value}/${props.setId}/${props.index}`, {
      method: "PUT",
      body: userCards.value[userCardsKey].toString(),
    });
  }
  function shouldHide() {
    if (filterSet.value !== "all" && filterSet.value !== props.setId) {
      return true;
    }
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
    >
      <img
        class="cardImage"
        style={`filter: ${currentCount > 0 ? "none" : "grayscale(100%)"};`}
        loading="lazy"
        src={`/api/image/${props.setId}/${props.index}`}
      />{" "}
      <div class="counter">{currentCount}</div>{" "}
      <div class="index">{(props.index + 1).toString().padStart(3, "0")}</div>
      {" "}
      <Pack name={currentPack} setLink={props.setLink} />
    </div>
  );
}
