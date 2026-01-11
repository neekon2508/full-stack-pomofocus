import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { usePomos } from "../../contexts/PomoContext";
import { getBgColor } from "../../utils/theme-color-util";

function Session() {
  const theme = useTheme();
  const {
    sessions,
    sessionActiveId: active,
    selectedTaskId,
    tasks,
    dispatch,
  } = usePomos();

  const currentSession = sessions[active];
  const [duration, setDuration] = useState(currentSession.duration);
  const [isStart, setIsStart] = useState(false);
  const [count, setCount] = useState(0);
  const [pomoCount, setPomoCount] = useState(0);

  useEffect(() => {
    setDuration(currentSession.duration);
    setIsStart(false);
  }, [active, currentSession.duration]);

  useEffect(() => {
    let interval = null;

    if (isStart && duration > 0) {
      interval = setInterval(() => {
        setDuration((pre) => pre - 1);
      }, 1000);
    } else if (duration === 0) {
      clearInterval(interval);
      handleOnClickSkip();
    }

    return () => clearInterval(interval);
  }, [isStart, duration]);

  function handleOnClickTab(index) {
    dispatch({ type: "sessionActiveId/update", payload: index });
  }

  function handleOnClickCountDown() {
    setIsStart((value) => !value);
  }

  function handleOnClickSkip() {
    setIsStart(false);

    if (active === 0) {
      setCount((pre) => pre + 1);

      const currentTask = tasks.find((t) => t.id === selectedTaskId);
      if (selectedTaskId !== null && currentTask) {
        dispatch({
          type: "task/update",
          payload: {
            id: selectedTaskId,
            completed: currentTask.completed + 1,
          },
        });
      }

      if (pomoCount < 1) {
        setPomoCount((pre) => pre + 1);
        handleOnClickTab(1);
      } else {
        setPomoCount(0);
        handleOnClickTab(2);
      }
    } else {
      handleOnClickTab(0);
    }
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          padding: "20px 0",
          borderRadius: "10px",
          textAlign: "center",
          transition: "background-color 0.5s ease",
        }}
      >
        <Stack direction="row" spacing={1} justifyContent="center">
          {sessions.map((session, index) => {
            return (
              <Button
                key={session.id}
                onClick={() => handleOnClickTab(index)}
                sx={{
                  color: "white",
                  fontWeight: active === index ? "bold" : "normal",
                  backgroundColor:
                    active === index ? "rgba(0, 0, 0, 0.15)" : "transparent",
                  textTransform: "none",
                }}
              >
                {session.type}
              </Button>
            );
          })}
        </Stack>

        <Typography
          variant="h1"
          sx={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          {`${Math.floor(duration / 60)}`.padStart(2, "0")}:
          {`${duration % 60}`.padStart(2, "0")}
        </Typography>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            minHeight: "64px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleOnClickCountDown}
            sx={{
              backgroundColor: "white",
              color: getBgColor(theme, active),
              fontSize: "22px",
              fontWeight: "bold",
              borderRadius: "4px",
              boxShadow: "rgb(235, 235, 235) 0px 6px 0px",

              "&:active": {
                boxShadow: "none",
                transform: "translateY(6px)",
              },
            }}
          >
            {isStart ? "PAUSE" : "START"}
          </Button>

          <IconButton
            onClick={handleOnClickSkip}
            size="large"
            sx={{
              position: "absolute",
              right: { xs: "10%", md: "20%" },
              color: "white",
              opacity: isStart ? 1 : 0,
              visibility: isStart ? "visible" : "hidden",
              transition: "opacity 0.2s ease",
            }}
          >
            <SkipNextIcon sx={{ fontSize: "40px" }} />
          </IconButton>
        </div>
      </Box>
      <Box textAlign="center" padding="10px">
        <Typography variant="h5" color="#f2f2ff">
          #{count}
        </Typography>
        <Typography variant="h5" color="white">
          {selectedTaskId
            ? tasks.find((t) => t.id === selectedTaskId).title
            : "Pomofocus project"}
        </Typography>
      </Box>
    </>
  );
}

export default Session;
