import { IconButton } from "@mui/material";
import { TileImages } from "../assets/tiles";
import { Mahjong } from "../configs/mahjongs";
import Front from "../assets/tiles/Front.png";

export type MahjongTileProps = {
  mahjong: Mahjong;
  onClick?: () => void;
};

export const MahjongTile = ({ mahjong, onClick }: MahjongTileProps) => {
  return (
    <IconButton style={{ padding: 0 }} onClick={onClick}>
      <div
        style={{
          height: 40,
          width: 30,
          padding: 5,
          boxSizing: "border-box",
          backgroundImage: `url(${Front})`,
          backgroundSize: "cover",
        }}
      >
        <img
          style={{ height: "100%", width: "100%" }}
          src={TileImages[mahjong.nameEng]}
          alt={mahjong.nameEng}
        ></img>
      </div>
    </IconButton>
  );
};
