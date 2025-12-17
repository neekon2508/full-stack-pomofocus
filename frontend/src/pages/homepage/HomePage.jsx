import { Box } from "@mui/material";
import Header from "../../components/header/Header";

function Homepage() {
  return (
    <Box
      sx={{
        bgcolor: "coral",
        width: "fit-content",
        mx: "auto",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Header />
    </Box>
  );
}

export default Homepage;
