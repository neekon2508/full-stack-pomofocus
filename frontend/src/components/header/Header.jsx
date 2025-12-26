import { Box } from "@mui/material";
import Logo from "./logo/Logo";
import Report from "./report/Report";
import Setting from "./setting/Setting";
import { useState } from "react";
import LoginButton from "./signin-button/SigninButton";
import MenuButton from "./menu/MenuButton";

function Header() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "10px",
      }}
    >
      <Logo fontSize="2rem" color="primary.logo" title="Pomofocus" />
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Report />
        <Setting />
        {isLogin ? "Logined" : <LoginButton />}
        <MenuButton />
      </Box>
    </Box>
  );
}

export default Header;
