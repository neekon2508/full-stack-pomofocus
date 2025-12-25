import { Box, Divider, useTheme } from "@mui/material";
import Header from "../../components/header/Header";
import Session from "../../components/session/Session";
import Tasks from "../../components/task-list/TaskList";
import { getBgColor } from "../../utils/theme-color-util";
import { usePomos } from "../../contexts/PomoContext";

function Homepage() {
  const theme = useTheme();
  const { sessionActiveId } = usePomos();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: getBgColor(theme, sessionActiveId),
      }}
    >
      <Box
        component="main"
        sx={{
          width: "50%",
          margin: "0 auto",
        }}
      >
        <Header />
        <Divider sx={{ padding: "50px 0" }} />
        <Box sx={{ width: "80%", margin: "0 auto", padding: "50px 0" }}>
          <Session />
          <Tasks />
        </Box>
      </Box>
    </Box>
  );
}

export default Homepage;
