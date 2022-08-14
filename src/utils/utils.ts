import {
  isNormalMahjong,
  Mahjong,
  NormalMahjong,
  windType,
} from "../configs/mahjongs";
import { rules, Rule } from "./rules";

export type FinalResult = {
  score: number;
  huRules: Rule[];
  mahjongs: Mahjong[];
};

export type HuGroup = {
  type: "刻" | "顺";
  mahjongs: Mahjong[];
};
export type HuResult = HuFailedResult | HuSuccessResult;
export type HuFailedResult = { hu: false };
export type HuSuccessResult = {
  hu: true;
  groups: HuGroup[];
  pairs: Mahjong[];
};
export type OtherGameResult = {
  gang: number;
  hua: number;
  jufeng: typeof windType[number];
  menfeng: typeof windType[number];
};

export const calculate = (mahjongs: Mahjong[]): FinalResult => {
  if (mahjongs.length !== 14) {
    return { score: 0, huRules: [], mahjongs };
  }
  const huResult = checkHu(mahjongs);

  let score = 0;
  let excludeRules = new Set();
  let huRules = [];

  for (let i = 0; i < rules.length; i++) {
    if (!excludeRules.has(rules[i].name)) {
      const { check, score: ruleScore, excludeOtherRules } = rules[i];
      if (
        check(huResult, mahjongs, {
          //TODO
          gang: 0,
          hua: 0,
          jufeng: "东",
          menfeng: "东",
        })
      ) {
        score += ruleScore;
        excludeOtherRules.forEach((r) => excludeRules.add(r));
        huRules.push(rules[i]);
      }
    }
  }
  return {
    score,
    huRules,
    mahjongs: sortMahjongs(mahjongs),
  };
};

// Try to find a hu result
export const recurse = (
  groups: HuGroup[],
  pairs: Mahjong[],
  pending: Mahjong[]
): HuResult => {
  let res: HuResult = { hu: false };

  switch (pending.length) {
    case 0:
      return { hu: true, groups, pairs };
    case 1:
      return { hu: false };
    case 2:
      if (pending[0].name === pending[1].name) {
        return { hu: true, groups, pairs: [pending[0], pending[0]] };
      }
      return { hu: false };
    default:
      // if ke
      if (
        (pending[0].name === pending[1].name,
        pending[0].name === pending[2].name)
      ) {
        res = recurse(
          [
            ...groups,
            {
              type: "刻",
              mahjongs: [pending[0], pending[1], pending[2]],
            },
          ],
          pairs,
          pending.slice(3)
        );
        // if pair
      } else if (pairs.length === 0 && pending[0].name === pending[1].name) {
        res = recurse(groups, [pending[0], pending[1]], pending.slice(1));
      } else if ((pending[0] as NormalMahjong).number != null) {
        let nextNum = (pending[0] as NormalMahjong).number + 1;
        const type = pending[0].type;
        const ind = [0];
        for (let i = 1; i < pending.length; i++) {
          if (pending[i].type !== type) {
            break;
          } else if ((pending[i] as NormalMahjong).number === nextNum) {
            nextNum++;
            ind.push(i);
            if (ind.length >= 3) {
              break;
            }
          }
        }
        if (ind.length === 3) {
          res = recurse(
            [
              ...groups,
              {
                type: "顺",
                mahjongs: [pending[ind[0]], pending[ind[1]], pending[ind[2]]],
              },
            ],
            pairs,
            pending.filter((_, i) => !ind.includes(i))
          );
        }
      }
  }
  return res;
};

export const checkHu = (mahjongs: Mahjong[]) => {
  const sortedMahjongs = sortMahjongs([...mahjongs]);
  // check 7 pairs
  let isSevenPairs = true;
  for (let i = 0; i < sortedMahjongs.length; i += 2) {
    if (sortedMahjongs[i].name !== sortedMahjongs[i + 1].name) {
      isSevenPairs = false;
      break;
    }
  }
  if (isSevenPairs) {
    return { hu: true, groups: [], pairs: sortedMahjongs };
  }
  return recurse([], [], sortedMahjongs);
};

export const sortMahjongs = (mahjongs: Mahjong[]) => {
  const sortedMahjongs = [...mahjongs];
  sortedMahjongs.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type > b.type ? 1 : -1;
    } else {
      const numa = isNormalMahjong(a) ? a.number : 0;
      const numb = isNormalMahjong(b) ? b.number : 0;
      return numa > numb ? 1 : numa === numb ? 0 : -1;
    }
  });
  return sortedMahjongs;
};

export const arrayEquals = (a: any[], b: any[]) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};
