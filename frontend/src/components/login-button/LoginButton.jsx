import NavButton from "../common/nav-button/NavButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
function LoginButton() {
  function handleOnClick() {
    console.log("LoginButton clicked");
  }
  return (
    <NavButton
      icon={AccountCircleIcon}
      label="Log in"
      onClick={handleOnClick}
    />
  );
}

export default LoginButton;
