import NavButton from "../common/nav-button/NavButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LoginIcon from "@mui/icons-material/Login";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { useState } from "react";

function MenuButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <NavButton icon={MoreVertIcon} label="" onClick={handleOnClick} />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ mt: "10px" }}
      >
        <MenuItem onClick={handleClose}>
          <LoginIcon sx={{ paddingRight: " 5px" }} />
          Login
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <KeyboardIcon sx={{ paddingRight: " 5px" }} />
          Shortcuts
        </MenuItem>
      </Menu>
    </>
  );
}

export default MenuButton;
