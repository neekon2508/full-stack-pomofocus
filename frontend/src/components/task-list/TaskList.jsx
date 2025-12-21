import { Button, IconButton, Stack, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";
import TaskItem from "../task-item/TaskItem";

function TaskList() {
  const initialTasks = [
    {
      id: 1,
      title: "Spring Framework Essentials",
      completed: 10,
      total: 15,
      isDone: false,
    },
    { id: 2, title: "Pro Spring", completed: 7, total: 20, isDone: false },
    {
      id: 3,
      title: "SQL Certified Associate",
      completed: 0,
      total: 20,
      isDone: false,
    },
    { id: 4, title: "Algorithms", completed: 9, total: 50, isDone: false },
    { id: 5, title: "Git", completed: 2, total: 10, isDone: false },
    { id: 6, title: "React", completed: 22, total: 30, isDone: false },
    {
      id: 7,
      title: "Pomofocus project",
      completed: 1,
      total: 20,
      isDone: true,
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);

  function handleToggleTask(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isDone: !task.isDone } : task
      )
    );
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
      <Button
        fullWidth
        startIcon={<AddCircleIcon />}
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
    </>
  );
}

export default TaskList;
