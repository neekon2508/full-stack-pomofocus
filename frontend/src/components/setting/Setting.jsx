import NavButton from "../common/nav-button/NavButton";
import SettingsIcon from "@mui/icons-material/Settings";
function Setting() {
  function handleOnClick() {
    console.log("Setting clicked");
  }
  return (
    <NavButton icon={SettingsIcon} label="Setting" onClick={handleOnClick} />
  );
}

export default Setting;
