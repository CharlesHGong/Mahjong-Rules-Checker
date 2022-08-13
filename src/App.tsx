import { Profile } from "./components/Profile";
import "./App.css";
import { useState } from "react";
import { defaultGame, playerStyles } from "./configs/config";
import {
  Mahjong,
  mahjongs,
  normalType,
  specialMahjongs,
} from "./configs/mahjongs";
import { calculate, sortMahjongs } from "./utils/utils";
import { MahjongTile } from "./components/Mahjong";
import { Button, Typography } from "@mui/material";
import { FinalResult } from "./utils/utils";
import { HuResultDialog } from "./components/HuResultDialog";

type Player = {
  name: string;
  score: number;
};

const tileRowStyle = {
  display: "flex",
  width: "100%",
  justifyContent: "space-around",
  marginBottom: 10,
};

const finalResultStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  rowGap: 10,
};

type Game = {
  players: Player[];
};

function App() {
  const [game, setGame] = useState<Game>(defaultGame);
  const [finalResultDialogOpen, setFinalResultDialogOpen] = useState(false);
  const [selectedMahjongs, setSelectedMahjongs] = useState<Mahjong[]>([]);
  const [lastResult, setLastResult] = useState<FinalResult>({
    score: 0,
    huRules: [],
    mahjongs: [],
  });

  const handleSelectMahjongs = (mahjong: Mahjong) => {
    if (selectedMahjongs.length < 14) {
      setSelectedMahjongs(sortMahjongs([...selectedMahjongs, mahjong]));
    }
  };

  const handleCalculateClick = () => {
    setLastResult(calculate(selectedMahjongs));
    setSelectedMahjongs([]);
  };

  const handleClearClick = () => {
    setSelectedMahjongs([]);
  };

  return (
    <div
      className="App"
      style={{ height: "100%", width: "100%", position: "relative" }}
    >
      <div
        style={{
          margin: 0,
          width: "100%",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <div style={{ width: "100%" }}>
          <div>
            <Typography variant="h5">
              Final Result: {lastResult.score}
            </Typography>
            <div style={finalResultStyle}>
              {lastResult.mahjongs.map((mj) => (
                <MahjongTile
                  mahjong={mj}
                  onClick={() => handleSelectMahjongs(mj)}
                />
              ))}
            </div>

            <Button
              variant="contained"
              onClick={() => setFinalResultDialogOpen(true)}
            >
              Details
            </Button>
            <HuResultDialog
              open={finalResultDialogOpen}
              onClose={() => setFinalResultDialogOpen(false)}
              finalResult={lastResult}
            />
          </div>

          <div>
            <Typography variant="h5">Selected mahjongs</Typography>
            <div style={finalResultStyle}>
              {selectedMahjongs.map((mj) => (
                <MahjongTile
                  mahjong={mj}
                  onClick={() => handleSelectMahjongs(mj)}
                />
              ))}
            </div>
            <Button variant="contained" onClick={() => handleCalculateClick()}>
              Calculate
            </Button>
          </div>

          <div>
            <Typography variant="h5">All mahjongs</Typography>
            <div style={tileRowStyle}>
              {specialMahjongs.map((mj) => (
                <MahjongTile
                  mahjong={mj}
                  onClick={() => handleSelectMahjongs(mj)}
                />
              ))}
            </div>
            {normalType.map((type) => (
              <div style={tileRowStyle}>
                {mahjongs
                  .filter((mj) => mj.type === type)
                  .map((mj) => (
                    <MahjongTile
                      mahjong={mj}
                      onClick={() => handleSelectMahjongs(mj)}
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
