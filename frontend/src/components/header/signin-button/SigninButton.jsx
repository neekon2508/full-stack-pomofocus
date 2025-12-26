import { useNavigate } from "react-router-dom";
import NavButton from "../../common/nav-button/NavButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
function LoginButton() {
  const navigate = useNavigate();
  function handleOnClick() {
    navigate("/signup");
  }
  return (
    <NavButton
      icon={AccountCircleIcon}
      label="Sign up"
      onClick={handleOnClick}
    />
  );
}

export default LoginButton;
