import { Button, IconButton, Stack, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";
import TaskItem from "../task-item/TaskItem";
import TaskInput from "../task-input/TaskInput";
import { usePomos } from "../../contexts/PomoContext";

function TaskList() {
  const { tasks, isLoading, dispatch } = usePomos();
  const [isShowAddTask, setIsShowAddTask] = useState(false);
  function handleToggleTask(id) {
    dispatch({ type: "task/toggle", payload: id });
  }

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
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            borderRadius: "4px",
            padding: "6px",
          }}
        >
          <MoreVertIcon sx={{ color: "white" }} />
        </IconButton>
      </Stack>
      <Stack spacing={1.5}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
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
    </>
  );
}

export default TaskList;
