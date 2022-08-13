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
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Final Result</DialogTitle>
      <DialogContent dividers>
        <div>
          {finalResult.mahjongs.map((mj) => (
            <MahjongTile mahjong={mj} />
          ))}
        </div>
        <div>
          <Typography variant="h5">Hu Rules</Typography>
          {finalResult.huRules.map((rule) => (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div>{rule.name}</div>
              <div>{rule.score}</div>
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
