import NavButton from "../common/nav-button/NavButton";
import InsertChartIcon from "@mui/icons-material/InsertChart";
function Report() {
  function handleOnClick() {
    console.log("Report clicked");
  }
  return (
    <NavButton icon={InsertChartIcon} label="Report" onClick={handleOnClick} />
  );
}

export default Report;
