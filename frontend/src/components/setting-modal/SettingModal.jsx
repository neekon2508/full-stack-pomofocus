import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { usePomos } from "../../contexts/PomoContext";

function SettingModal({ open, onClose }) {
  const { sessions } = usePomos();
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle textAlign="center">
        <Typography>SETTING</Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Stack direction={"row"} alignItems="center" spacing={1} color="#aaa">
            <AccessTimeIcon fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              TIMER
            </Typography>
          </Stack>
          <Typography variant="body2" fontWeight="bold">
            Time (minutes)
          </Typography>

          <Grid container spacing={2}>
            {sessions.map((session) => (
              <Grid key={session.id} size={12 / sessions.length}>
                <Typography>{session.type}</Typography>
                <TextField value={session.duration / 60} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </DialogContent>

      <DialogContent>
        <Stack spacing={2}>
          <Stack direction={"row"} alignItems="center" spacing={1} color="#aaa">
            <VolumeUpIcon fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              SOUND
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default SettingModal;
