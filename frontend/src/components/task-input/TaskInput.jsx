import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { usePomos } from "../../contexts/PomoContext";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { ErrorMessage } from "@hookform/error-message";
import DeleteIcon from "@mui/icons-material/Delete";

function TaskInput({ onCancel, isEdit, task }) {
  const { dispatch } = usePomos();
  const [number, setNumber] = useState(isEdit ? Number(task.total) : "");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: isEdit ? task.title : "",
      total: isEdit ? task.total : 1,
    },
  });

  const ref = useOutsideClick(() => onCancel(null));

  function onSubmit(data) {
    if (isEdit)
      dispatch({
        type: "task/update",
        payload: {
          id: task.id,
          title: data.title,
          total: number,
        },
      });
    else
      dispatch({
        type: "task/create",
        payload: {
          id: uuid(),
          title: data.title,
          total: number,
          completed: 0,
          isDone: false,
        },
      });
    onCancel(null);
  }
  function handleChange(e) {
    const val = e.target.value;
    if (val === "" || /^[0-9\b]+$/.test(val)) {
      setNumber(val === "" ? "" : parseInt(val, 10));
    }
  }

  function handleIncrease() {
    setNumber((pre) => pre + 1);
  }

  function handleDecrease() {
    setNumber((pre) => pre - 1);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      ref={ref}
      sx={{
        width: "100%",
        backgroundColor: "white",
        marginTop: "10px",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <TextField
        name="title"
        placeholder="What are you working?"
        {...register("title", { required: "This is required" })}
        width="100%"
        sx={{
          "& fieldset": { border: "none" },

          "& .MuiInputBase-root": {
            fontSize: "24px",
          },
          "& .MuiInputBase-input::placeholder": {
            fontStyle: "italic",
            color: "rgba(0, 0, 0, 0.4)",
            fontWeight: "500",
            opacity: 1,
          },
        }}
      />
      <ErrorMessage
        errors={errors}
        name="title"
        render={({ message }) => (
          <Box component="p" color="red" fontWeight={500}>
            {message}
          </Box>
        )}
      />
      <Typography variant="body1" fontWeight={500}>
        Est Pomodoros
      </Typography>
      <Stack direction="row" sx={{ padding: "10px 0" }}>
        <TextField
          name="total"
          {...register("total", { required: "This is required" })}
          value={number}
          onChange={handleChange}
          sx={{
            width: "10%",
            backgroundColor: "rgb(0,0,0,0.1)",
            borderRadius: "10px",
            "& .MuiInputBase-root": {
              fontSize: "15px",
            },
            "& fieldset": { border: "none" },
          }}
        />

        <IconButton size="small" onClick={handleIncrease}>
          <KeyboardArrowUpIcon />
        </IconButton>
        <IconButton size="small" onClick={handleDecrease}>
          <KeyboardArrowDownIcon />
        </IconButton>
      </Stack>
      <ErrorMessage
        errors={errors}
        name="total"
        render={({ message }) => (
          <Box component="p" color="red" fontWeight={500}>
            {message}
          </Box>
        )}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          sx={{
            opacity: isEdit ? 1 : 0,
            visibility: isEdit ? "visible" : "hidden",
          }}
        >
          <DeleteIcon />
        </IconButton>

        <Stack direction="row" spacing={2}>
          <Box>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default TaskInput;
