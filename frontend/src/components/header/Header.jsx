import { Box } from "@mui/material";
import Logo from "../logo/Logo";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  function handleOnClick() {
    alert("Clicked");
  }
  return (
    <Box>
      <Logo
        fontSize="2rem"
        color="primary.logo"
        title="Pomofocus"
        onClick={handleOnClick}
      />
    </Box>
  );
}

export default Header;
