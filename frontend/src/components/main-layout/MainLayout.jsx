import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
function MainLayout() {
  return (
    <Box
      sx={{
        width: 100,
        height: 100,
        bgcolor: "background.default",
        fontFamily: "fontFamily",
      }}
    >
      <Outlet />
    </Box>
  );
}

export default MainLayout;
