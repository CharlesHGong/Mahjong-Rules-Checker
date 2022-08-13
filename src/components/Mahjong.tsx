import { IconButton } from "@mui/material";
import { Mahjong } from "../configs/mahjongs";

export type MahjongTileProps = {
  mahjong: Mahjong;
  onClick?: () => void;
};

export const MahjongTile = ({ mahjong, onClick }: MahjongTileProps) => {
  return (
    <IconButton style={{ padding: 0 }}>
      <div
        style={{
          height: 40,
          width: 30,
          padding: 5,
          boxSizing: "border-box",
          backgroundImage: "url(./tiles/Front.png)",
          backgroundSize: "cover",
        }}
        onClick={onClick}
      >
        <img
          style={{ height: "100%", width: "100%" }}
          src={`/tiles/${mahjong.nameEng}.png`}
          alt={mahjong.nameEng}
        ></img>
      </div>
    </IconButton>
  );
};
