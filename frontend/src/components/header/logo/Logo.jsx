import { Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
function Logo({ fontSize, title, color }) {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/");
  };
  return (
    <Box
      onClick={handleOnClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: handleOnClick ? "pointer" : "default",
        color: { color },
      }}
    >
      <CheckCircleIcon
        sx={{ color: color, fontSize: fontSize, display: "block" }}
      />
      <Box
        component="span"
        sx={{
          fontWeight: "bold",
          color: color,
          fontSize: fontSize,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {title}
      </Box>
    </Box>
  );
}

export default Logo;
