import NavButton from "../common/nav-button/NavButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
function Menu() {
  function handleOnClick() {
    console.log("Menu clicked");
  }
  return <NavButton icon={MoreVertIcon} label="" onClick={handleOnClick} />;
}

export default Menu;
