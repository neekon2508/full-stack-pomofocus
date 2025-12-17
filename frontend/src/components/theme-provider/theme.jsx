import { createTheme } from "@mui/material";

export const appTheme = createTheme({
  palette: {
    primary: {
      main: "rgb(0, 0, 0)",
      logo: "rgb(255, 255, 255)",
    },
    background: {
      default: "rgb(186, 73, 73)",
      shortBreak: "rgb(76, 145, 149)",
      longBreak: "rgb(69, 124, 163)",
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", monospace',
  },
});
