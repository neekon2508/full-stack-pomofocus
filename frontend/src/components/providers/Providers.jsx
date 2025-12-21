import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "../theme-provider/theme";
import { PomoProvider } from "../../contexts/PomoContext";

function Providers({ children }) {
  return (
    <PomoProvider>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </PomoProvider>
  );
}

export default Providers;
