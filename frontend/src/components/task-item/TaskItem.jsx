import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import TaskInput from "../task-input/TaskInput";
import { usePomos } from "../../contexts/PomoContext";
function TaskItem({ task, onToggle, selectedId, onClickEdit }) {
  const { dispatch } = usePomos();
  return (
    <Box
      onClick={() => {
        dispatch({ type: "selectedTaskId/update", payload: task.id });
      }}
      sx={{
        cursor: dispatch ? "pointer" : "default",
        backgroundColor: "white",
        borderRadius: "6px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeft: task.id === selectedId ? "4px solid black" : "none",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ flexGrow: 1 }}
      >
        <Checkbox
          icon={
            <CheckCircleOutlineIcon
              sx={{ color: "#dfdfdf", fontSize: "30px" }}
            />
          }
          checkedIcon={
            <CheckCircleIcon sx={{ color: "#ba4949", fontSize: "30px" }} />
          }
          checked={task.isDone}
          onChange={() => onToggle(task.id)}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: "500",
            fontSize: "20px",
            color: "#555",
            textDecoration: task.isDone ? "line-through" : "none",
            opacity: task.isDone ? 0.7 : 1,
          }}
        >
          {task.title}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#bbb" }}>
          {task.completed}/{task.total}
        </Typography>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onClickEdit();
          }}
          sx={{
            border: "1px solid #dfdfdf",
            borderRadius: "4px",
            padding: "4px",
            marginLeft: "12px",
          }}
        >
          <MoreVertIcon sx={{ color: "#999" }} />
        </IconButton>
      </Stack>
    </Box>
  );
}

export default TaskItem;
