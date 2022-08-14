import {
  dragonType,
  Mahjong,
  NormalMahjong,
  normalType,
  windType,
  isNormalMahjong,
  sameUpsideDownMahjongNames,
  isYaoJiu,
} from "../configs/mahjongs";
import { arrayEquals, HuResult, OtherGameResult } from "./utils";

export type CheckRule = (
  huResult: HuResult,
  mahjongs: Mahjong[],
  otherGameResult: OtherGameResult
) => boolean | number;

//大四喜
export const checkRule1: CheckRule = (huResult) => {
  return (
    huResult.hu &&
    windType.every((wt) => huResult.groups.some((g) => g.type === wt))
  );
};

//大三元
export const checkRule2: CheckRule = (huResult) => {
  return (
    huResult.hu &&
    dragonType.every((dt) => huResult.groups.some((g) => g.type === dt))
  );
};

//绿一色
export const checkRule3: CheckRule = (huResult) => {
  if (!huResult.hu) {
    return false;
  }
  const greenMahjongs = ["二条", "三条", "四条", "六条", "八条", "發"];
  const cond1 =
    huResult.groups.some((g) => g.mahjongs[0].name === "發") ||
    huResult.pairs.some((p) => p.name === "發");
  const cond2 =
    huResult.groups.every((g) =>
      g.mahjongs.every((mj) => greenMahjongs.includes(mj.name))
    ) && huResult.pairs.every((p) => greenMahjongs.includes(p.name));
  return cond1 && cond2;
};

//九莲宝灯
export const checkRule4: CheckRule = (_, mahjongs) => {
  const type = mahjongs[0].type;
  const nums = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9];
  let j = 0;
  for (let i = 0; i < mahjongs.length; i++) {
    if (mahjongs[i].type !== type) {
      return false;
    }
    if ((mahjongs[i] as NormalMahjong).number === nums[j]) {
      j++;
    }
    if (i - j > 1) {
      return false;
    }
  }
  return true;
};

//四杠
export const checkRule5: CheckRule = (huResult, _, otherGameResult) => {
  return huResult.hu && otherGameResult.gang === 4;
};

//连七对
export const checkRule6: CheckRule = (huResult) => {
  return (
    huResult.hu &&
    huResult.pairs.length === 7 &&
    huResult.pairs.every((p) => p.type === huResult.pairs[0].type)
  );
};

const oneNineMahjongNames = ["一", "九"].flatMap((n) =>
  normalType.map((t) => `${n}${t}`)
);

//十三幺
export const checkRule7: CheckRule = (_, mahjongs) => {
  const yao = [...oneNineMahjongNames, ...windType, ...dragonType];
  return yao.every(name => mahjongs.some(mj => mj.name === name));
};

//清幺九
export const checkRule8: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu && mahjongs.every((p) => oneNineMahjongNames.includes(p.name))
  );
};

//小四喜
export const checkRule9: CheckRule = (huResult) => {
  return (
    huResult.hu &&
    windType.filter((wt) => huResult.groups.every((g) => g.type === wt))
      .length === 3 &&
    huResult.pairs.every((t) => windType.includes(t.name))
  );
};

//小三元
export const checkRule10: CheckRule = (huResult) => {
  return (
    huResult.hu &&
    dragonType.filter((dt) => huResult.groups.every((g) => g.type === dt))
      .length === 2 &&
    huResult.pairs.every((t) => dragonType.includes(t.name))
  );
};

//字一色
export const checkRule11: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    mahjongs.every((mj) => [...windType, ...dragonType].includes(mj.type))
  );
};

//TODO an
//四暗刻
export const checkRule12: CheckRule = (huResult) => {
  return false;
  //return huResult.hu && huResult.groups.every((g) => g.type === "刻");
};

//一色双龙会
export const checkRule13: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  const type = mahjongs[0].type;
  const cond1 = mahjongs.every((mj) => mj.type === type);
  const cond2 = arrayEquals(
    huResult.groups.flatMap((g) =>
      g.mahjongs.map((mj) => (mj as NormalMahjong).number)
    ),
    [1, 2, 3, 1, 2, 3, 7, 8, 9, 7, 8, 9]
  );
  const cond3 = huResult.pairs.every((p) => (p as NormalMahjong).number === 5);

  return huResult.hu && cond1 && cond2 && cond3;
};

//一色四同顺
export const checkRule14: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  const type = mahjongs[0].type;
  const straight = huResult.groups[0].mahjongs.map(
    (mj) => (mj as NormalMahjong).number
  );

  const cond1 = mahjongs.every((mj) => mj.type === type);
  const cond2 = huResult.groups.every(
    (g) =>
      g.type === "顺" &&
      arrayEquals(
        g.mahjongs.map((mj) => (mj as NormalMahjong).number),
        straight
      )
  );

  return huResult.hu && cond1 && cond2;
};

//一色四节高
export const checkRule15: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  const type = mahjongs[0].type;

  const cond1 = mahjongs.every((mj) => mj.type === type);
  const cond2 = huResult.groups.every(
    (g, index) =>
      g.type === "刻" &&
      (index === 0 ||
        (normalType.includes(g.mahjongs[0].type) &&
          (g.mahjongs[0] as NormalMahjong).number + 1 ===
            (huResult.groups[index - 1].mahjongs[0] as NormalMahjong).number))
  );

  return huResult.hu && cond1 && cond2;
};

//一色四步高
export const checkRule16: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  const type = mahjongs[0].type;

  const cond1 = mahjongs.every((mj) => mj.type === type);
  const cond2 = huResult.groups.every(
    (g, index) =>
      g.type === "顺" &&
      (index === 0 ||
        (normalType.includes(g.mahjongs[0].type) &&
          (huResult.groups[index - 1].mahjongs[0] as NormalMahjong).number -
            (g.mahjongs[0] as NormalMahjong).number <=
            2))
  );

  return huResult.hu && cond1 && cond2;
};

//三杠
export const checkRule17: CheckRule = (huResult, _, otherGameResult) => {
  return huResult.hu && otherGameResult.gang === 3;
};

//混幺九
export const checkRule18: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    mahjongs.every((mj) =>
      [...windType, ...dragonType, ...oneNineMahjongNames].includes(mj.name)
    )
  );
};

//七对
export const checkRule19: CheckRule = (huResult) => {
  return huResult.hu && huResult.pairs.length === 7;
};

//TODO
//七星不靠
export const checkRule20: CheckRule = (huResult, mahjongs) => {
  return false;
};

//全双刻
export const checkRule21: CheckRule = (huResult) => {
  return (
    huResult.hu &&
    huResult.groups.every(
      (g) =>
        g.type === "刻" &&
        isNormalMahjong(g.mahjongs[0]) &&
        g.mahjongs[0].number % 2 === 0
    ) &&
    huResult.pairs.every((p) => isNormalMahjong(p) && p.number % 2 === 0)
  );
};

//清一色
export const checkRule22: CheckRule = (huResult, mahjongs) => {
  return huResult.hu && mahjongs.every((mj) => mj.type === mahjongs[0].type);
};

//一色三同顺
export const checkRule23: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.some((_, index) => {
      const groups = huResult.groups.filter((_, i) => index !== i);
      const mjInGroups = groups.flatMap((g) => g.mahjongs);

      const cond1 = groups.every(
        (g) =>
          g.type === "顺" &&
          isNormalMahjong(g.mahjongs[0]) &&
          isNormalMahjong(groups[0].mahjongs[0]) &&
          g.mahjongs[0].number === groups[0].mahjongs[0].number
      );
      const cond2 = mjInGroups.every(
        (mj) => mj.type === groups[0].mahjongs[0].type
      );

      return cond1 && cond2;
    })
  );
};

//一色三节高
export const checkRule24: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.some((_, index) => {
      const groups = huResult.groups.filter((_, i) => index !== i);
      const mjInGroups = groups.flatMap((g) => g.mahjongs);

      const cond1 = groups.every(
        (g, index) =>
          g.type === "刻" &&
          isNormalMahjong(g.mahjongs[0]) &&
          isNormalMahjong(groups[0].mahjongs[0]) &&
          g.mahjongs[0].number - groups[0].mahjongs[0].number === index
      );
      const cond2 = mjInGroups.every(
        (mj) => mj.type === groups[0].mahjongs[0].type
      );

      return cond1 && cond2;
    })
  );
};

//全大
export const checkRule25: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    mahjongs.every((mj) => isNormalMahjong(mj) && [7, 8, 9].includes(mj.number))
  );
};

//全中
export const checkRule26: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    mahjongs.every((mj) => isNormalMahjong(mj) && [4, 5, 6].includes(mj.number))
  );
};

//全小
export const checkRule27: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    mahjongs.every((mj) => isNormalMahjong(mj) && [1, 2, 3].includes(mj.number))
  );
};

//清龙
export const checkRule28: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.some((_, index) => {
      const groups = huResult.groups.filter((_, i) => index !== i);
      const mjInGroups = groups.flatMap((g) => g.mahjongs);
      const cond1 = groups.every((g) => g.type === "顺");
      const cond2 = mjInGroups.every(
        (mj) => mj.type === groups[0].mahjongs[0].type
      );
      const cond3 = [...new Array(9)].every((_, i) =>
        mjInGroups.some((mj) => isNormalMahjong(mj) && mj.number === i)
      );
      return cond1 && cond2 && cond3;
    })
  );
};

//三色双龙会
export const checkRule29: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  const types1 = huResult.groups
    .filter(
      (g) =>
        g.type === "顺" &&
        (g.mahjongs[0] as NormalMahjong).number === 1 &&
        (g.mahjongs[0] as NormalMahjong).number === 2 &&
        (g.mahjongs[0] as NormalMahjong).number === 3
    )
    .map((g) => g.mahjongs[0].type);
  const types2 = huResult.groups
    .filter(
      (g) =>
        g.type === "顺" &&
        (g.mahjongs[0] as NormalMahjong).number === 7 &&
        (g.mahjongs[0] as NormalMahjong).number === 8 &&
        (g.mahjongs[0] as NormalMahjong).number === 9
    )
    .map((g) => g.mahjongs[0].type);
  const type3 = huResult.pairs[0].type;
  return (
    types1.length === types2.length &&
    types1.length === 2 &&
    types1[0] === types2[0] &&
    types1[1] === types2[1] &&
    types1[0] !== types1[1] &&
    types1[0] !== type3 &&
    types1[1] !== type3 &&
    isNormalMahjong(huResult.pairs[0]) &&
    huResult.pairs[0].number === 5
  );
};

//一色三步高
export const checkRule30: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.some((_, index) => {
      const groups = huResult.groups.filter((_, i) => index !== i);
      const mjInGroups = groups.flatMap((g) => g.mahjongs);
      const cond1 = groups.every((g) => g.type === "顺");
      const cond2 = mjInGroups.every(
        (mj) => mj.type === groups[0].mahjongs[0].type
      );
      const cond3 = groups.every((g, ind) => {
        if (ind === 0) return true;
        const prevGroupMj = groups[ind - 1].mahjongs[0];
        return (
          isNormalMahjong(g.mahjongs[0]) &&
          isNormalMahjong(prevGroupMj) &&
          g.mahjongs[0].number - prevGroupMj.number <= 2
        );
      });
      return cond1 && cond2 && cond3;
    })
  );
};

//全带五
export const checkRule31: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.every((group) =>
      group.mahjongs.some((mj) => isNormalMahjong(mj) && mj.number === 5)
    ) &&
    huResult.pairs.every((pair) => isNormalMahjong(pair) && pair.number === 5)
  );
};

//三同刻
export const checkRule32: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.some((_, index) => {
      const groups = huResult.groups.filter((_, i) => index !== i);

      return groups.every(
        (g) =>
          g.type === "刻" &&
          isNormalMahjong(g.mahjongs[0]) &&
          isNormalMahjong(groups[0].mahjongs[0]) &&
          g.mahjongs[0].number === groups[0].mahjongs[0].number
      );
    })
  );
};

//TODO
//三暗刻
export const checkRule33: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.some((_, index) => {
      const groups = huResult.groups.filter((_, i) => index !== i);

      return groups.every(
        (g) =>
          g.type === "刻" &&
          isNormalMahjong(g.mahjongs[0]) &&
          isNormalMahjong(groups[0].mahjongs[0]) &&
          g.mahjongs[0].number === groups[0].mahjongs[0].number
      );
    })
  );
};

//全不靠
export const checkRule34: CheckRule = (huResult, mahjongs) => {
  const types1 = mahjongs
    .filter((mj) => isNormalMahjong(mj) && [1, 4, 7].includes(mj.number))
    .map((mj) => mj.type);
  const types2 = mahjongs
    .filter((mj) => isNormalMahjong(mj) && [2, 5, 8].includes(mj.number))
    .map((mj) => mj.type);
  const types3 = mahjongs
    .filter((mj) => isNormalMahjong(mj) && [3, 6, 9].includes(mj.number))
    .map((mj) => mj.type);
  return (
    new Set(types1).size === 1 &&
    new Set(types2).size === 1 &&
    new Set(types3).size === 1 &&
    mahjongs.every(
      (mj, ind) =>
        !mahjongs.some(
          (mj2, ind2) =>
            ind !== ind2 &&
            mj.type === mj2.type &&
            (isNormalMahjong(mj) && isNormalMahjong(mj2)
              ? mj.number === mj2.number
              : true)
        )
    )
  );
};

//组合龙
export const checkRule35: CheckRule = (huResult, mahjongs) => {
  return false;
};

//大于五
export const checkRule36: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu && mahjongs.every((mj) => isNormalMahjong(mj) && mj.number > 5)
  );
};

//小于五
export const checkRule37: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu && mahjongs.every((mj) => isNormalMahjong(mj) && mj.number < 5)
  );
};

//三风刻
export const checkRule38: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.filter(
      (group) =>
        group.type === "刻" && windType.includes(group.mahjongs[0].type)
    ).length >= 3
  );
};

//花龙
export const checkRule39: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }

  const types1 = huResult.groups
    .filter(
      (g) =>
        g.type === "顺" &&
        (g.mahjongs[0] as NormalMahjong).number === 1 &&
        (g.mahjongs[0] as NormalMahjong).number === 2 &&
        (g.mahjongs[0] as NormalMahjong).number === 3
    )
    .map((g) => g.mahjongs[0].type);
  const types2 = huResult.groups
    .filter(
      (g) =>
        g.type === "顺" &&
        (g.mahjongs[0] as NormalMahjong).number === 4 &&
        (g.mahjongs[0] as NormalMahjong).number === 5 &&
        (g.mahjongs[0] as NormalMahjong).number === 6
    )
    .map((g) => g.mahjongs[0].type);
  const types3 = huResult.groups
    .filter(
      (g) =>
        g.type === "顺" &&
        (g.mahjongs[0] as NormalMahjong).number === 7 &&
        (g.mahjongs[0] as NormalMahjong).number === 8 &&
        (g.mahjongs[0] as NormalMahjong).number === 9
    )
    .map((g) => g.mahjongs[0].type);
  return new Set([...types1, ...types2, ...types3]).size === 3;
};

//推不倒
export const checkRule40: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    mahjongs.every((mj) => sameUpsideDownMahjongNames.includes(mj.name))
  );
};

//三色三同顺
export const checkRule41: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.some((_, index) => {
      const groups = huResult.groups.filter((_, i) => index !== i);

      return (
        groups.every((g) => g.type === "顺") &&
        groups.every(
          (g, ind) =>
            (ind === 0 || g.mahjongs[0].type !== groups[0].mahjongs[0].type) &&
            isNormalMahjong(g.mahjongs[0]) &&
            isNormalMahjong(groups[0].mahjongs[0]) &&
            g.mahjongs[0].number === groups[0].mahjongs[0].number
        )
      );
    })
  );
};

//三色三节高
export const checkRule42: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.some((_, index) => {
      const groups = huResult.groups.filter((_, i) => index !== i);

      const nums = groups.map((g) =>
        isNormalMahjong(g.mahjongs[0]) ? g.mahjongs[0].number : -1
      );
      nums.sort();

      return (
        groups.every((g) => g.type === "刻") &&
        groups.every(
          (g, ind) =>
            ind === 0 || g.mahjongs[0].type !== groups[0].mahjongs[0].type
        ) &&
        nums[0] + 1 === nums[1] &&
        nums[1] + 1 === nums[2] &&
        nums[2] + 1 === nums[3]
      );
    })
  );
};

//TODO
//无番和
export const checkRule43: CheckRule = (huResult, mahjongs) => {
  return false;
};

//TODO
//妙手回春
export const checkRule44: CheckRule = (huResult, mahjongs) => {
  return false;
};

//TODO
//海底捞月
export const checkRule45: CheckRule = (huResult, mahjongs) => {
  return false;
};

//TODO
//杠上开花
export const checkRule46: CheckRule = (huResult, mahjongs) => {
  return false;
};

//TODO
//抢杠和
export const checkRule47: CheckRule = (huResult, mahjongs) => {
  return false;
};

//碰碰和
export const checkRule48: CheckRule = (huResult, mahjongs) => {
  return huResult.hu && huResult.groups.every((g) => g.type === "刻");
};

//混一色
export const checkRule49: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    new Set(mahjongs.filter((mj) => isNormalMahjong(mj)).map((mj) => mj.type))
      .size === 1 &&
    mahjongs.some((mj) => !isNormalMahjong(mj))
  );
};

//TODO
//三色三步高
export const checkRule50: CheckRule = (huResult, mahjongs) => {
  return false;
};

//五门齐
export const checkRule51: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    [...normalType].every((type) => mahjongs.some((mj) => mj.type === type)) &&
    mahjongs.some((mj) => windType.includes(mj.type)) &&
    mahjongs.some((mj) => dragonType.includes(mj.type))
  );
};

//TODO
//全求人
export const checkRule52: CheckRule = (huResult, mahjongs) => {
  return false;
};

//TODO
//双暗杠
export const checkRule53: CheckRule = (huResult, mahjongs) => {
  return false;
};

//双箭刻
export const checkRule54: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.filter(
      (g) => g.type === "刻" && dragonType.includes(g.mahjongs[0].type)
    ).length === 2
  );
};

//全带幺
export const checkRule55: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.every((g) =>
      g.mahjongs.every(
        (mj) => !isNormalMahjong(mj) || [1, 9].includes(mj.number)
      )
    )
  );
};

//TODO
//不求人
export const checkRule56: CheckRule = (huResult, mahjongs) => {
  return false;
};

//TODO
//双明杠
export const checkRule57: CheckRule = (huResult, mahjongs, otherGameResult) => {
  return huResult.hu && otherGameResult.gang === 2;
};

//TODO
//和绝张
export const checkRule58: CheckRule = (huResult, mahjongs) => {
  return false;
};

//箭刻
export const checkRule59: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.filter(
      (g) => g.type === "刻" && dragonType.includes(g.mahjongs[0].type)
    ).length
  );
};

//圈风刻
export const checkRule60: CheckRule = (huResult, mahjongs, otherGameResult) => {
  return (
    huResult.hu &&
    huResult.groups.filter(
      (g) => g.type === "刻" && g.mahjongs[0].type === otherGameResult.jufeng
    ).length
  );
};

//门风刻
export const checkRule61: CheckRule = (huResult, mahjongs, otherGameResult) => {
  return (
    huResult.hu &&
    huResult.groups.filter(
      (g) => g.type === "刻" && g.mahjongs[0].type === otherGameResult.menfeng
    ).length
  );
};

//TODO
//门前清
export const checkRule62: CheckRule = (huResult, mahjongs) => {
  return false;
};

//平和
export const checkRule63: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    huResult.groups.every((g) => g.type === "顺") &&
    huResult.pairs.every((mj) => isNormalMahjong(mj))
  );
};

//四归一
export const checkRule64: CheckRule = (huResult, mahjongs) => {
  return false;
};

//双同刻
export const checkRule65: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  let same = 0;
  for (let i = 0; i < huResult.groups.length - 1; i++) {
    const mj1 = huResult.groups[i].mahjongs[0];
    if (huResult.groups[i].type === "刻" && isNormalMahjong(mj1)) {
      for (let j = i + 1; j < huResult.groups.length; j++) {
        const mj2 = huResult.groups[j].mahjongs[0];
        if (
          huResult.groups[j].type === "刻" &&
          isNormalMahjong(mj2) &&
          mj1.number === mj2.number
        ) {
          same++;
        }
      }
    }
  }
  return same;
};

//双暗刻
export const checkRule66: CheckRule = (huResult, mahjongs) => {
  return false;
};

//暗杠
export const checkRule67: CheckRule = (huResult, mahjongs) => {
  return false;
};

//断幺
export const checkRule68: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    mahjongs.every((mj) =>
      isNormalMahjong(mj) ? ![1, 9].includes(mj.number) : false
    )
  );
};

//一般高
export const checkRule69: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  let same = 0;
  for (let i = 0; i < huResult.groups.length - 1; i++) {
    const mj1 = huResult.groups[i].mahjongs[0];
    if (huResult.groups[i].type === "顺" && isNormalMahjong(mj1)) {
      for (let j = i + 1; j < huResult.groups.length; j++) {
        const mj2 = huResult.groups[j].mahjongs[0];
        if (
          huResult.groups[j].type === "顺" &&
          isNormalMahjong(mj2) &&
          mj1.number === mj2.number &&
          mj1.type === mj2.type
        ) {
          same++;
        }
      }
    }
  }
  return same;
};

//喜相逢
export const checkRule70: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  let same = 0;
  for (let i = 0; i < huResult.groups.length - 1; i++) {
    const mj1 = huResult.groups[i].mahjongs[0];
    if (huResult.groups[i].type === "顺" && isNormalMahjong(mj1)) {
      for (let j = i + 1; j < huResult.groups.length; j++) {
        const mj2 = huResult.groups[j].mahjongs[0];
        if (
          huResult.groups[j].type === "顺" &&
          isNormalMahjong(mj2) &&
          mj1.number === mj2.number &&
          mj1.type !== mj2.type
        ) {
          same++;
        }
      }
    }
  }
  return same;
};

//连六
export const checkRule71: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  let same = 0;
  for (let i = 0; i < huResult.groups.length - 1; i++) {
    const mj1 = huResult.groups[i].mahjongs[0];
    if (huResult.groups[i].type === "顺" && isNormalMahjong(mj1)) {
      for (let j = i + 1; j < huResult.groups.length; j++) {
        const mj2 = huResult.groups[j].mahjongs[0];
        if (
          huResult.groups[j].type === "顺" &&
          isNormalMahjong(mj2) &&
          Math.abs(mj1.number - mj2.number) === 3 &&
          mj1.type === mj2.type
        ) {
          same++;
        }
      }
    }
  }
  return same;
};

//老少副
export const checkRule72: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  let same = 0;
  for (let i = 0; i < huResult.groups.length - 1; i++) {
    const mj1 = huResult.groups[i].mahjongs[0];
    if (huResult.groups[i].type === "顺" && isNormalMahjong(mj1)) {
      for (let j = i + 1; j < huResult.groups.length; j++) {
        const mj2 = huResult.groups[j].mahjongs[0];
        if (
          huResult.groups[j].type === "顺" &&
          isNormalMahjong(mj2) &&
          Math.abs(mj1.number - mj2.number) === 6 &&
          mj1.type === mj2.type
        ) {
          same++;
        }
      }
    }
  }
  return same;
};

//幺九刻
export const checkRule73: CheckRule = (huResult, mahjongs) => {
  if (!huResult.hu) {
    return false;
  }
  const yaoJiu = huResult.groups.filter((group) => {
    return group.type === "刻" && isYaoJiu(group.mahjongs[0]);
  }).length;
  return yaoJiu;
};

//明杠
export const checkRule74: CheckRule = (huResult, mahjongs, otherGameResult) => {
  return huResult.hu && otherGameResult.gang;
};

//缺一门
export const checkRule75: CheckRule = (huResult, mahjongs) => {
  return (
    huResult.hu &&
    new Set(mahjongs.filter((mj) => isNormalMahjong(mj)).map((mj) => mj.type))
      .size === 2
  );
};

//无字
export const checkRule76: CheckRule = (huResult, mahjongs) => {
  return huResult.hu && mahjongs.every((mj) => isNormalMahjong(mj));
};

//TODO
//边张
export const checkRule77: CheckRule = (huResult, mahjongs) => {
  return false;
};

//TODO
//坎张
export const checkRule78: CheckRule = (huResult, mahjongs) => {
  return false;
};

//TODO
//单钓
export const checkRule79: CheckRule = (huResult, mahjongs) => {
  return false;
};

//TODO
//自摸
export const checkRule80: CheckRule = (huResult, mahjongs) => {
  return false;
};

export type Rule = {
  check: CheckRule;
  score: number;
  excludeOtherRules: string[];
  name: string;
};

export const rules: Rule[] = [
  {
    name: "大四喜",
    check: checkRule1,
    score: 88,
    excludeOtherRules: ["三风刻", "碰碰和", "圈风刻", "门风刻", "幺九刻"],
  },
  {
    name: "大三元",
    check: checkRule2,
    score: 88,
    excludeOtherRules: ["双箭刻", "箭刻", "幺九刻"],
    //TODO 组成大三元的三副刻子不计幺九刻
  },
  {
    name: "绿一色",
    check: checkRule3,
    score: 88,
    excludeOtherRules: ["混一色"],
  },
  {
    name: "九莲宝灯",
    check: checkRule4,
    score: 88,
    excludeOtherRules: ["清一色", "不求人", "门前清", "无字", "幺九刻"],
  },
  {
    name: "四杠",
    check: checkRule5,
    score: 88,
    excludeOtherRules: ["碰碰和", "单钓将"],
  },
  {
    name: "连七对",
    check: checkRule6,
    score: 88,
    excludeOtherRules: ["清一色", "七对", "不求人", "门前清", "无字", "单钓将"],
  },
  {
    name: "十三幺",
    check: checkRule7,
    score: 88,
    excludeOtherRules: ["混幺九", "五门齐", "不求人", "门前清", "单钓将"],
  },
  {
    name: "清幺九",
    check: checkRule8,
    score: 64,
    excludeOtherRules: ["碰碰和", "全带幺", "双同刻", "幺九刻", "无字"],
  },
  {
    name: "小四喜",
    check: checkRule9,
    score: 64,
    excludeOtherRules: ["三风刻", "幺九刻"],
  },
  {
    name: "小三元",
    check: checkRule10,
    score: 64,
    excludeOtherRules: ["双箭刻", "箭刻", "幺九刻"],
    //TODO 组成小三元的两副刻子不计幺九刻
  },
  {
    name: "字一色",
    check: checkRule11,
    score: 64,
    excludeOtherRules: ["碰碰和", "全带幺", "幺九刻"],
  },
  {
    name: "四暗刻",
    check: checkRule12,
    score: 64,
    excludeOtherRules: ["碰碰和", "不求人", "门前清"],
  },
  {
    name: "一色双龙会",
    check: checkRule13,
    score: 64,
    excludeOtherRules: ["七对", "清一色", "平和", "一般高", "老少副", "无字"],
  },
  {
    name: "一色四同顺",
    check: checkRule14,
    score: 48,
    excludeOtherRules: ["一色三同顺、一色三节高、四归一、一般高"],
  },
  {
    name: "一色四节高",
    check: checkRule15,
    score: 48,
    excludeOtherRules: ["一色三同顺、一色三节高、碰碰和"],
  },
  {
    name: "一色四步高",
    check: checkRule16,
    score: 32,
    excludeOtherRules: ["一色三步高、连六、老少副"],
  },
  { name: "三杠", check: checkRule17, score: 32, excludeOtherRules: [] },
  {
    name: "混幺九",
    check: checkRule18,
    score: 32,
    excludeOtherRules: ["碰碰和、全带幺、幺九刻"],
  },

  {
    name: "七对",
    check: checkRule19,
    score: 24,
    excludeOtherRules: ["门前清、单钓将"],
  },
  {
    name: "七星不靠",
    check: checkRule20,
    score: 24,
    excludeOtherRules: ["全不靠、五门齐、不求人、门前清"],
  },
  {
    name: "全双刻",
    check: checkRule21,
    score: 24,
    excludeOtherRules: ["碰碰和、断幺、无字"],
  },
  {
    name: "清一色",
    check: checkRule22,
    score: 24,
    excludeOtherRules: ["无字"],
  },
  {
    name: "一色三同顺",
    check: checkRule23,
    score: 24,
    excludeOtherRules: ["三节高、一般高"],
  },
  {
    name: "一色三节高",
    check: checkRule24,
    score: 24,
    excludeOtherRules: ["一色三同顺"],
  },
  {
    name: "全大",
    check: checkRule25,
    score: 24,
    excludeOtherRules: ["大于五、无字"],
  },
  {
    name: "全中",
    check: checkRule26,
    score: 24,
    excludeOtherRules: ["断幺、无字"],
  },
  {
    name: "全小",
    check: checkRule27,
    score: 24,
    excludeOtherRules: ["小于五、无字"],
  },
  {
    name: "清龙",
    check: checkRule28,
    score: 16,
    excludeOtherRules: ["连六、老少副"],
  },
  {
    name: "三色双龙会",
    check: checkRule29,
    score: 16,
    excludeOtherRules: ["平和、老少副、喜相逢、无字"],
  },
  { name: "一色三步高", check: checkRule30, score: 16, excludeOtherRules: [] },
  {
    name: "全带五",
    check: checkRule31,
    score: 16,
    excludeOtherRules: ["断幺、无字"],
  },
  {
    name: "三同刻",
    check: checkRule32,
    score: 16,
    excludeOtherRules: ["双同刻"],
  },
  { name: "三暗刻", check: checkRule33, score: 16, excludeOtherRules: [] },
  {
    name: "全不靠",
    check: checkRule34,
    score: 12,
    excludeOtherRules: ["五门齐、不求人、门前清"],
  },
  { name: "组合龙", check: checkRule35, score: 12, excludeOtherRules: [] },
  {
    name: "大于五",
    check: checkRule36,
    score: 12,
    excludeOtherRules: ["无字"],
  },
  {
    name: "小于五",
    check: checkRule37,
    score: 12,
    excludeOtherRules: ["无字"],
  },
  {
    name: "三风刻",
    check: checkRule38,
    score: 12,
    excludeOtherRules: ["幺九刻"],
    //组成三风刻的三副刻子不计幺九刻
  },
  { name: "花龙", check: checkRule39, score: 8, excludeOtherRules: [] },
  {
    name: "推不倒",
    check: checkRule40,
    score: 8,
    excludeOtherRules: ["缺一门"],
  },
  {
    name: "三色三同顺",
    check: checkRule41,
    score: 8,
    excludeOtherRules: ["喜相逢"],
  },
  { name: "三色三节高", check: checkRule42, score: 8, excludeOtherRules: [] },
  { name: "无番和", check: checkRule43, score: 8, excludeOtherRules: [] },
  {
    name: "妙手回春",
    check: checkRule44,
    score: 8,
    excludeOtherRules: ["自摸"],
  },
  { name: "海底捞月", check: checkRule45, score: 8, excludeOtherRules: [] },
  {
    name: "杠上开花",
    check: checkRule46,
    score: 8,
    excludeOtherRules: ["自摸"],
  },
  {
    name: "抢杠和",
    check: checkRule47,
    score: 8,
    excludeOtherRules: ["和绝张"],
  },
  { name: "碰碰和", check: checkRule48, score: 6, excludeOtherRules: [] },
  { name: "混一色", check: checkRule49, score: 6, excludeOtherRules: [] },
  { name: "三色三步高", check: checkRule50, score: 6, excludeOtherRules: [] },
  { name: "五门齐", check: checkRule51, score: 6, excludeOtherRules: [] },
  {
    name: "全求人",
    check: checkRule52,
    score: 6,
    excludeOtherRules: ["单钓将"],
  },
  { name: "双暗杠", check: checkRule53, score: 6, excludeOtherRules: [] },
  {
    name: "双箭刻",
    check: checkRule54,
    score: 6,
    excludeOtherRules: ["幺九刻"],
    //组成双箭刻的两副刻子不计幺九刻},
  },

  { name: "全带幺", check: checkRule55, score: 4, excludeOtherRules: [] },
  { name: "不求人", check: checkRule56, score: 4, excludeOtherRules: ["自摸"] },
  { name: "双明杠", check: checkRule57, score: 4, excludeOtherRules: [] },
  { name: "和绝张", check: checkRule58, score: 4, excludeOtherRules: [] },
  { name: "箭刻", check: checkRule59, score: 2, excludeOtherRules: ["幺九刻"] },
  {
    name: "圈风刻",
    check: checkRule60,
    score: 2,
    excludeOtherRules: ["幺九刻"],
  },
  {
    name: "门风刻",
    check: checkRule61,
    score: 2,
    excludeOtherRules: ["幺九刻"],
  },
  { name: "门前清", check: checkRule62, score: 2, excludeOtherRules: [] },
  { name: "平和", check: checkRule63, score: 2, excludeOtherRules: ["无字"] },
  { name: "四归一", check: checkRule64, score: 2, excludeOtherRules: [] },
  { name: "双同刻", check: checkRule65, score: 2, excludeOtherRules: [] },
  { name: "双暗刻", check: checkRule66, score: 2, excludeOtherRules: [] },
  { name: "暗杠", check: checkRule67, score: 2, excludeOtherRules: [] },
  { name: "断幺", check: checkRule68, score: 2, excludeOtherRules: ["无字"] },
  { name: "一般高", check: checkRule69, score: 1, excludeOtherRules: [] },
  { name: "喜相逢", check: checkRule70, score: 1, excludeOtherRules: [] },
  { name: "连六", check: checkRule71, score: 1, excludeOtherRules: [] },
  { name: "老少副", check: checkRule72, score: 1, excludeOtherRules: [] },
  { name: "幺九刻", check: checkRule73, score: 1, excludeOtherRules: [] },
  { name: "明杠", check: checkRule74, score: 1, excludeOtherRules: [] },
  { name: "缺一门", check: checkRule75, score: 1, excludeOtherRules: [] },
  { name: "无字", check: checkRule76, score: 1, excludeOtherRules: [] },
  { name: "边张", check: checkRule77, score: 1, excludeOtherRules: [] },
  { name: "坎张", check: checkRule78, score: 1, excludeOtherRules: [] },
  { name: "单钓", check: checkRule79, score: 1, excludeOtherRules: [] },
  { name: "自摸", check: checkRule80, score: 1, excludeOtherRules: [] },
];
