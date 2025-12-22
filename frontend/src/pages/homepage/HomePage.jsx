import { Box, Divider } from "@mui/material";
import Header from "../../components/header/Header";
import Session from "../../components/session/Session";
import Tasks from "../../components/task-list/TaskList";
import Summary from "../../components/summary/Summary";

function Homepage() {
  return (
    <Box
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
        <Summary />
      </Box>
    </Box>
  );
}

export default Homepage;
