import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { usePomos } from "../../contexts/PomoContext";

function Session() {
  const { sessions, selectedTaskId, tasks, dispatch } = usePomos();
  const types = sessions.map((session) => session.type);
  const durations = sessions.map((session) => session.duration);
  const [active, setActive] = useState(0);
  const [duration, setDuration] = useState(durations[0]);
  const [isStart, setIsStart] = useState(false);
  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem("pomoCount");
    return savedCount ? Number(savedCount) : 1;
  });

  const [pomoCount, setPomoCount] = useState(0);

  useEffect(() => {
    localStorage.setItem("pomoCount", count);
  }, [count]);

  useEffect(() => {
    setDuration(sessions[active].duration);
    setIsStart(false);
  }, [active]);

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
  }, [isStart, duration, active]);

  function handleOnClickTab(index) {
    setActive(index);
  }

  function handleOnClickCountDown() {
    setIsStart((value) => !value);
  }

  function handleOnClickSkip() {
    setIsStart(false);

    if (active === 0) {
      dispatch({
        type: "task/update",
        payload: {
          id: selectedTaskId,
          completed: tasks.find((t) => t.id === selectedTaskId).completed + 1,
        },
      });
      console.log(tasks.find((t) => t.id === selectedTaskId));
      setCount((pre) => pre + 1);
      if (pomoCount < 1) {
        setPomoCount((pre) => pre + 1);
        setActive(1);
      } else {
        setPomoCount(0);
        setActive(2);
      }
    } else setActive(0);
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
          {types.map((val, index) => {
            return (
              <Button
                key={index}
                onClick={() => handleOnClickTab(index)}
                sx={{
                  color: "white",
                  fontWeight: active === index ? "bold" : "normal",
                  backgroundColor:
                    active === index ? "rgba(0, 0, 0, 0.15)" : "transparent",
                  borderRadius: "4px",
                  px: 2,
                }}
              >
                {val}
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
          {`${Math.floor(duration / 60)}`.padStart(2, 0)}:
          {`${duration % 60}`.padStart(2, 0)}
        </Typography>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            minHeight: "60px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleOnClickCountDown}
            sx={{
              backgroundColor: "white",
              color: "background.default",
              fontSize: "22px",
              fontWeight: "bold",
              borderRadius: "4px",
              boxShadow: "rgb(235, 235, 235) 0px 6px 0px",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
              "&:active": {
                boxShadow: "none",
                transform: "translateY(6px)",
              },
            }}
          >
            {isStart ? "PAUSE" : "START"}
          </Button>
          {isStart && (
            <IconButton
              onClick={handleOnClickSkip}
              size="large"
              sx={{
                position: "absolute",
                right: { xs: "10%", md: "20%" },
                color: "white",
              }}
            >
              <SkipNextIcon sx={{ fontSize: "40px" }} />
            </IconButton>
          )}
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
