import { Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
function Logo({ fontSize, onClick, title, color }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: onClick ? "pointer" : "default",
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
