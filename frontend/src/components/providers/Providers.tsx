import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "../theme-provider/theme";
import { PomoProvider } from "../../contexts/PomoContext";
import { ReactQueryProvider } from "../react-query-provider/react-query-provider";

type ProvidersProps = {
  children: React.ReactNode;
}

function Providers({ children } : ProvidersProps) {
  return (
    <PomoProvider>
      <ReactQueryProvider>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
      </ReactQueryProvider>
    </PomoProvider>
  );
}

export {Providers};
