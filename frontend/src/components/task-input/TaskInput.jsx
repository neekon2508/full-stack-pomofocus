import { Box, Typography } from "@mui/material";

function TaskInput() {
  return (
    <Box sx={{ width: "100%", backgroundColor: "white" }}>
      <input placeholder="What are you working on?" />
      <Typography variant="h5">Est Pomodoros</Typography>
    </Box>
  );
}

export default TaskInput;
