import { Box } from "@mui/material";
import Logo from "../logo/Logo";
import { useNavigate } from "react-router-dom";
import Report from "../report/report";
import Setting from "../setting/setting";
import { useState } from "react";
import LoginButton from "../login-button/LoginButton";
import Menu from "../menu/Menu";

function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  function handleOnClick() {
    alert("Clicked");
  }
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
      <Logo
        fontSize="2rem"
        color="primary.logo"
        title="Pomofocus"
        onClick={handleOnClick}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Report />
        <Setting />
        {isLogin ? "Logined" : <LoginButton />}
        <Menu />
      </Box>
    </Box>
  );
}

export default Header;
