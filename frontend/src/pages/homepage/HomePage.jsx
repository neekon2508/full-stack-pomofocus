import { Box } from "@mui/material";
import Header from "../../components/header/Header";

function Homepage() {
  return (
    <Box
      sx={{
        width: "50%",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Header />
    </Box>
  );
}

export default Homepage;
