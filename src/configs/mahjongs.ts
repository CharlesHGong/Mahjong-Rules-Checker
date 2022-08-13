export type Mahjong = NormalMahjong | SpecialMahjong;
export type NormalMahjong = {
  type: typeof normalType[number];
  number: number;
  name: string;
  nameEng: string;
};
export type SpecialMahjong = {
  type: "字";
  name: string;
  nameEng: string;
};
export const normalType = ["万", "条", "饼"];
export const normalTypeEng = ["man", "sou", "pin"];
export const numMatch = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
export const windType = ["东", "南", "西", "北"];
export const windTypeEng = ["ton", "nan", "shaa", "pei"];
export const dragonType = ["白", "發", "中"];
export const dragonTypeEng = ["haku", "hatsu", "chun"];
// export const flowerType = ["春", "夏", "秋", "冬", "梅", "兰", "竹", "菊"];
export const sameUpsideDownMahjongNames = [
  "一饼",
  "二饼",
  "三饼",
  "四饼",
  "五饼",
  "八饼",
  "九饼",
  "二条",
  "四条",
  "五条",
  "六条",
  "八条",
  "九条",
  "白",
];

export const normalMahjongs: Mahjong[] = [
  ...normalType.flatMap((t, ti) =>
    new Array(9).fill(0).map((_, i) => ({
      type: t,
      number: i + 1,
      name: `${numMatch[i]}${t}`,
      nameEng: `${normalTypeEng[ti]}${i + 1}`,
    }))
  ),
];
export const specialMahjongs: Mahjong[] = [
  ...windType.map((t, i) => ({
    type: "字" as const,
    name: t,
    nameEng: windTypeEng[i],
  })),
  ...dragonType.map((t, i) => ({
    type: "字" as const,
    name: t,
    nameEng: dragonTypeEng[i],
  })),
];

export const mahjongs = [...normalMahjongs, ...specialMahjongs];

export const isYaoJiu = (mahjong: Mahjong) =>
  !isNormalMahjong(mahjong) || [1, 9].includes(mahjong.number);

export const isNormalMahjong = (mj: Mahjong): mj is NormalMahjong => {
  return normalType.includes(mj.type);
};
