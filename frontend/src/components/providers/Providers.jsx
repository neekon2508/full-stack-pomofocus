import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "../theme-provider/theme";

function Providers({ children }) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default Providers;
