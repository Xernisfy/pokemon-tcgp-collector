import { sets } from "utils/sets.ts";
import { packs, rarities, userCards } from "utils/signals.ts";
import { Rarity } from "utils/types.ts";
import { Card } from "./card.tsx";

interface CollectionProps {
  cards: Record<string, number>;
  packs: Record<string, string>;
  rarities: Record<string, Rarity>;
}

export function Collection(props: CollectionProps) {
  userCards.value = props.cards;
  packs.value = props.packs;
  rarities.value = props.rarities;
  return (
    <div id="cards">
      {sets.reduce((p, c) => {
        for (
          let index = 0;
          index < c.cards.normal + c.cards.secret;
          ++index
        ) {
          p.push({ index, setId: c.id, setLink: c.link });
        }
        return p;
      }, [] as { index: number; setId: string; setLink: string }[]).map((
        { index, setId, setLink },
      ) => (
        <Card
          key={setId + "/" + index}
          index={index}
          setId={setId}
          setLink={setLink}
        />
      ))}
    </div>
  );
}
