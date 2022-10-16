import "./App.css";
import React, { useState } from "react";
import {
  Mahjong,
  mahjongs,
  normalType,
  specialMahjongs,
  windType,
} from "./configs/mahjongs";
import { calculate, calculateTing, OtherGameResult } from "./utils/utils";
import { MahjongTile } from "./components/Mahjong";
import {
  Button,
  ButtonGroup,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FinalResult } from "./utils/utils";
import { HuResultDialog } from "./components/HuResultDialog";

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

const defaultResult = {
  score: 0,
  huRules: [],
  mahjongs: [],
  huResult: { hu: false } as const,
};

function App() {
  const [otherGameResult, setOtherGameResult] = useState<OtherGameResult>(
    defaultOtherGameResult
  );
  const [finalResultDialogOpen, setFinalResultDialogOpen] = useState(false);
  const [selectedMahjongs, setSelectedMahjongs] = useState<Mahjong[]>([]);
  const [tingResult, setTingResult] = useState<Mahjong[]>([]);
  const [lastResult, setLastResult] = useState<FinalResult>(defaultResult);

  const handleSelectMahjongs = (mahjong: Mahjong) => {
    if (selectedMahjongs.length < 14) {
      setSelectedMahjongs([...selectedMahjongs, mahjong]);
    }
  };

  const handleCalculateClick = () => {
    if (selectedMahjongs.length === 13) {
      setTingResult(calculateTing(selectedMahjongs));
    } else if (selectedMahjongs.length === 14) {
      setLastResult(calculate(selectedMahjongs));
    }
  };

  const handleClearClick = () => {
    setSelectedMahjongs([]);
    setTingResult([]);
    setLastResult(defaultResult);
  };

  const handleBackClick = () => {
    setSelectedMahjongs(selectedMahjongs.slice(0, -1));
  };

  return (
    <div className="App">
      <div style={{ width: "100%" }}>
        <HuResultDialog
          open={finalResultDialogOpen}
          onClose={() => setFinalResultDialogOpen(false)}
          finalResult={lastResult}
        />

        <div
          style={{
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: "100",
          }}
        >
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
          </div>
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

          <div>
            <ButtonGroup variant="outlined" size="small">
              <Button onClick={() => handleCalculateClick()}>Calculate</Button>
              <Button onClick={() => handleBackClick()}>Back</Button>
              <Button onClick={() => handleClearClick()}>Clear</Button>
            </ButtonGroup>
          </div>

          <div>
            听:{" "}
            {tingResult.map((mj) => (
              <MahjongTile mahjong={mj} />
            ))}
          </div>
        </div>

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
        </div>

        <div>
          <Typography variant="h5">All mahjongs</Typography>
          <Grid container columns={5} spacing={2}>
            {specialMahjongs.map((mj) => (
              <Grid item xs={1}>
                <MahjongTile
                  mahjong={mj}
                  onClick={() => handleSelectMahjongs(mj)}
                  style={{
                    width: 45,
                    height: 60,
                  }}
                />
              </Grid>
            ))}
          </Grid>
          {normalType.map((type) => (
            <Grid container columns={5} spacing={2}>
              {mahjongs
                .filter((mj) => mj.type === type)
                .map((mj) => (
                  <Grid item xs={1}>
                    <MahjongTile
                      mahjong={mj}
                      onClick={() => handleSelectMahjongs(mj)}
                      style={{
                        width: 45,
                        height: 60,
                      }}
                    />
                  </Grid>
                ))}
            </Grid>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
