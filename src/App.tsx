import "./App.css";
import { useState } from "react";
import { defaultGame } from "./configs/config";
import {
  Mahjong,
  mahjongs,
  normalType,
  specialMahjongs,
  windType,
} from "./configs/mahjongs";
import { calculate, OtherGameResult } from "./utils/utils";
import { MahjongTile } from "./components/Mahjong";
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
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

const positions = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
  "十三",
  "听",
];

const defaultOtherGameResult: OtherGameResult = {
  gang: 0,
  hua: 0,
  jufeng: windType[0],
  menfeng: windType[0],
};

function App() {
  const [game, setGame] = useState<Game>(defaultGame);
  const [otherGameResult, setOtherGameResult] = useState<OtherGameResult>(
    defaultOtherGameResult
  );
  const [finalResultDialogOpen, setFinalResultDialogOpen] = useState(false);
  const [selectedMahjongs, setSelectedMahjongs] = useState<Mahjong[]>([]);
  const [lastResult, setLastResult] = useState<FinalResult>({
    score: 0,
    huRules: [],
    mahjongs: [],
    huResult: { hu: false },
  });

  const handleSelectMahjongs = (mahjong: Mahjong) => {
    if (selectedMahjongs.length < 14) {
      setSelectedMahjongs([...selectedMahjongs, mahjong]);
    }
  };

  const handleCalculateClick = () => {
    setLastResult(calculate(selectedMahjongs));
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
              <Button
                variant="text"
                onClick={() => setFinalResultDialogOpen(true)}
                size="small"
              >
                Details
              </Button>
            </Typography>
            <div style={finalResultStyle}>
              {lastResult.mahjongs.map((mj) => (
                <MahjongTile
                  mahjong={mj}
                  onClick={() => handleSelectMahjongs(mj)}
                />
              ))}
            </div>

            <HuResultDialog
              open={finalResultDialogOpen}
              onClose={() => setFinalResultDialogOpen(false)}
              finalResult={lastResult}
            />
          </div>

          <div>
            <Typography variant="h5">Selected mahjongs</Typography>
            <table>
              <tbody>
                <tr>
                  {new Array(7).fill(0).map((_, i) => (
                    <td>{positions[i]}</td>
                  ))}
                </tr>
                <tr style={{ height: 50 }}>
                  {new Array(7).fill(0).map((_, i) => (
                    <td>
                      {selectedMahjongs[i] && (
                        <MahjongTile mahjong={selectedMahjongs[i]} />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  {new Array(7).fill(0).map((_, i) => (
                    <td>{positions[i + 7]}</td>
                  ))}
                </tr>
                <tr style={{ height: 50 }}>
                  {new Array(7).fill(0).map((_, i) => (
                    <td>
                      {selectedMahjongs[i + 7] && (
                        <MahjongTile mahjong={selectedMahjongs[i + 7]} />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "10px 30px",
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <div style={{ height: 30, textAlign: "left" }}>
                  杠
                  <ToggleButtonGroup
                    style={{ height: 20 }}
                    value={otherGameResult.gang}
                    exclusive
                    onChange={(_, v: number) =>
                      setOtherGameResult({ ...otherGameResult, gang: v })
                    }
                  >
                    <ToggleButton value={0}>0</ToggleButton>
                    <ToggleButton value={1}>1</ToggleButton>
                    <ToggleButton value={2}>2</ToggleButton>
                    <ToggleButton value={3}>3</ToggleButton>
                    <ToggleButton value={4}>4</ToggleButton>
                  </ToggleButtonGroup>
                </div>
                <div style={{ height: 30, textAlign: "left" }}>
                  圈风
                  <ToggleButtonGroup
                    style={{ height: 20 }}
                    value={otherGameResult.jufeng}
                    exclusive
                    onChange={(_, v: typeof windType[number]) =>
                      setOtherGameResult({ ...otherGameResult, jufeng: v })
                    }
                  >
                    {windType.map((wt) => (
                      <ToggleButton value={wt}>{wt}</ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </div>
                <div style={{ height: 30, textAlign: "left" }}>
                  门风
                  <ToggleButtonGroup
                    style={{ height: 20 }}
                    value={otherGameResult.menfeng}
                    exclusive
                    onChange={(_, v: typeof windType[number]) =>
                      setOtherGameResult({ ...otherGameResult, menfeng: v })
                    }
                  >
                    {windType.map((wt) => (
                      <ToggleButton value={wt}>{wt}</ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </div>
              </div>
              <div style={{ width: 100 }}>
                <Button
                  style={{ width: "100%" }}
                  variant="contained"
                  onClick={() => handleCalculateClick()}
                >
                  Calculate
                </Button>
                <Button
                  style={{ width: "100%" }}
                  variant="contained"
                  onClick={() => handleClearClick()}
                >
                  Clear
                </Button>
              </div>
            </div>
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
