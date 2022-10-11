import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FinalResult } from "../utils/utils";
import { MahjongTile } from "./Mahjong";

export interface HuResultDialogProps {
  open: boolean;
  finalResult: FinalResult;
  onClose: () => void;
}

export function HuResultDialog(props: HuResultDialogProps) {
  const { onClose, finalResult, open } = props;

  return (
    <Dialog onClose={onClose} open={open} fullWidth>
      <DialogTitle>Final Result</DialogTitle>
      <DialogContent dividers>
        {finalResult.huResult.hu ? (
          <div>
            <div>Pairs</div>
            <div>
              {finalResult.huResult.pairs.map((mj) => (
                <MahjongTile mahjong={mj} />
              ))}
            </div>

            <div>Groups</div>
            <div>
              {finalResult.huResult.groups.map((group) => (
                <div>
                  {group.mahjongs.map((mj) => (
                    <MahjongTile mahjong={mj} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {finalResult.mahjongs.map((mj) => (
              <MahjongTile mahjong={mj} />
            ))}
          </div>
        )}

        <div>
          <div>Hu Rules</div>
          {finalResult.huRules.map(({ rule, multiplier }) => (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div>{rule.name}</div>
              <div>
                {rule.score} * {multiplier}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
