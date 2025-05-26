import { sets } from "utils/sets.ts";
import { filterSet, packs, user, userCards } from "utils/signals.ts";
import { PackName, SetId } from "utils/types.ts";

type RarityDistr = Record<"normal" | "secret", [number, number]>;

interface ProgressBarProps {
  distr: RarityDistr;
  pack: string;
}

function ProgressBar(props: ProgressBarProps) {
  const [nc, nm] = props.distr.normal;
  const [sc, sm] = props.distr.secret;
  return (
    <div title={props.pack}>
      <div class="progress-bar" data-pack={props.pack}>
        <div style={`width: ${nc / nm * 100}%;`}>
          <span>{nc}/{nm}</span>
        </div>
      </div>
      <div class="progress-bar secret" data-pack={props.pack} hidden={sm === 0}>
        <div style={`width: ${sc / sm * 100}%;`}>
          <span>{sc}/{sm}</span>
        </div>
      </div>
    </div>
  );
}

export function PackProgress() {
  const cardsPerPack = sets.reduce(
    (p, c) => {
      if (!p[c.id]) {
        p[c.id] = {
          normal: [0, c.cards.normal],
          secret: [0, c.cards.secret],
          packs: c.packs.reduce(
            (p, c) => {
              if (!p[c]) p[c] = { normal: [0, 0], secret: [0, 0] };
              return p;
            },
            { rest: { normal: [0, 0], secret: [0, 0] } } as Record<
              PackName | "rest",
              RarityDistr
            >,
          ),
        };
      }
      for (let i = 0; i < c.cards.normal; ++i) {
        const count = userCards.value[`${user.value}/${c.id}/${i}`];
        const pack = packs.value[`${c.id}/${i}`];
        if (count > 0) ++p[c.id].normal[0];
        if (pack) {
          ++p[c.id].packs[pack as PackName].normal[1];
          if (count > 0) ++p[c.id].packs[pack as PackName].normal[0];
        } else {
          ++p[c.id].packs.rest.normal[1];
          if (count > 0) ++p[c.id].packs.rest.normal[0];
        }
      }
      for (let i = c.cards.normal; i < c.cards.normal + c.cards.secret; ++i) {
        const count = userCards.value[`${user.value}/${c.id}/${i}`];
        const pack = packs.value[`${c.id}/${i}`];
        if (count > 0) ++p[c.id].secret[0];
        if (pack) {
          ++p[c.id].packs[pack as PackName].secret[1];
          if (count > 0) ++p[c.id].packs[pack as PackName].secret[0];
        } else {
          ++p[c.id].packs.rest.secret[1];
          if (count > 0) ++p[c.id].packs.rest.secret[0];
        }
      }
      return p;
    },
    {} as Record<
      SetId,
      RarityDistr & { packs: Record<PackName | "rest", RarityDistr> }
    >,
  );
  return (
    <div id="packs">
      {sets.map((set) => (
        <div
          class={filterSet.value !== "all" && filterSet.value !== set.id
            ? "display-none"
            : "display-flex"}
        >
          <div class="pack">
            <ProgressBar distr={cardsPerPack[set.id]} pack={set.id} />
            <div class="display-flex">
              {((packs) => packs.length ? [...packs, "rest" as const] : packs)(
                set.packs,
              ).map((pack) => (
                <div
                  style={`flex: ${
                    (({ normal, secret }) => normal[1] + secret[1])(
                      cardsPerPack[set.id].packs[pack],
                    ) / (({ normal, secret }) =>
                      normal[1] + secret[1])(cardsPerPack[set.id])
                  };`}
                >
                  <ProgressBar
                    distr={cardsPerPack[set.id].packs[pack]}
                    pack={set.id + "-" + pack}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
