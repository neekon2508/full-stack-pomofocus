import { Box, Button, duration, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function Session() {
  const sessions = [
    { type: "Pomodoro", duration: 1500 },
    { type: "Short Break", duration: 300 },
    { type: "Long Break", duration: 900 },
  ];
  const types = sessions.map((session) => session.type);
  const durations = sessions.map((session) => session.duration);
  const [active, setActive] = useState(0);
  const [duration, setDuration] = useState(durations[0]);
  const [isStart, setIsStart] = useState(false);
  useEffect(() => {
    let interval = null;

    // Nếu đang ở trạng thái Active và thời gian > 0 thì mới chạy bộ đếm
    if (isStart && duration > 0) {
      interval = setInterval(() => {
        setDuration((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (duration === 0) {
      // Tự động dừng khi về 0
      setIsStart(false);
      clearInterval(interval);
    }

    // Dọn dẹp bộ nhớ
    return () => clearInterval(interval);
  }, [isStart, duration]);

  function handleOnClickTab(index) {
    setActive(index);
    setDuration(
      sessions.find((session) => session.type === types[index]).duration
    );
  }

  function handleOnClickCountDown() {
    setIsStart((value) => !value);
  }
  return (
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
          console.log(index, val);
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
            transform: "translateY(6px)", // Nhấn xuống khi click
          },
        }}
      >
        {isStart ? "PAUSE" : "START"}
      </Button>
    </Box>
  );
}

export default Session;
