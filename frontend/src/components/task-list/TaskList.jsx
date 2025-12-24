import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";
import TaskItem from "../task-item/TaskItem";
import TaskInput from "../task-input/TaskInput";
import { usePomos } from "../../contexts/PomoContext";
import Summary from "../summary/Summary";
import DeleteIcon from "@mui/icons-material/Delete";
function TaskList() {
  const { tasks, selectedTaskId, isLoading, dispatch } = usePomos();
  const [isShowAddTask, setIsShowAddTask] = useState(false);

  function handleToggleTask(id) {
    dispatch({ type: "task/toggle", payload: id });
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          marginBottom: "20px",
          borderBottom: "2px solid rgba(255, 255, 255, 0.4)",
          paddingBottom: "12px",
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
          Tasks
        </Typography>
        <IconButton
          onClick={handleOnClick}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            borderRadius: "4px",
            padding: "6px",
          }}
        >
          <MoreVertIcon sx={{ color: "white" }} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{ mt: "10px" }}
        >
          <MenuItem
            onClick={() => {
              dispatch({ type: "task/deleteCompleted" });
            }}
          >
            <DeleteIcon />
            <Typography>Clear finished tasks</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatch({ type: "task/deleteAll" });
              handleClose();
            }}
          >
            <DeleteIcon />
            <Typography>Clear all tasks</Typography>
          </MenuItem>
        </Menu>
      </Stack>
      <Stack spacing={1.5}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggleTask}
            selectedId={selectedTaskId}
            onClick={dispatch}
          />
        ))}
      </Stack>
      {!isShowAddTask ? (
        <Button
          fullWidth
          startIcon={<AddCircleIcon />}
          onClick={() => {
            setIsShowAddTask(true);
          }}
          sx={{
            marginTop: "16px",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            border: "2px dashed rgba(255, 255, 255, 0.4)",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            padding: "12px",
            borderRadius: "6px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              border: "2px dashed rgba(255, 255, 255, 0.6)",
            },
          }}
        >
          Add Task
        </Button>
      ) : (
        <TaskInput
          onCancel={() => {
            setIsShowAddTask(false);
          }}
        />
      )}
      {tasks.length > 0 && <Summary />}
    </>
  );
}

export default TaskList;
