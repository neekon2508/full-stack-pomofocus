import { Box, Divider, Stack, Typography } from "@mui/material";
import { usePomos } from "../../contexts/PomoContext";
import { calculateFinishTime, displayTime } from "../../utils/date-util";
export default function Summary() {
  const { tasks, sessions } = usePomos();
  const total = tasks.reduce((sum, task) => sum + Number(task.total), 0);
  const completed = tasks.reduce(
    (sum, task) => sum + Number(task.completed),
    0
  );
  const totalMin = calculateFinishTime(tasks, sessions);
  const finishDate = new Date();
  finishDate.setMinutes(finishDate.getMinutes() + totalMin);
  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "rgb(255,255,255,0.1)",
        marginTop: "20px",
        borderTop: "1px solid white",
      }}
      justifyItems="center"
    >
      <Stack direction="row" color="white">
        <Typography variant="body1" paddingRight="20px">
          <span style={{ marginRight: "8px" }}>Pomos:</span>
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>
            {Number(completed)}
          </span>
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>
            / {Number(total)}
          </span>
        </Typography>
        <Typography variant="body1">
          <span style={{ marginRight: "8px" }}>Finish At:</span>
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>
            {displayTime(finishDate)}
          </span>
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>
            ({(totalMin / 60).toFixed(2)}h)
          </span>
        </Typography>
      </Stack>
    </Box>
  );
}
