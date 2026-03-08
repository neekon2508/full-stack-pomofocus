import { Button } from "@mui/material";

function NavButton({ icon: Icon, label, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      startIcon={<Icon />}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        textTransform: "none",
        color: "white",
        fontSize: "14px",
        padding: "5px",
        borderRadius: "4px",
        minHeight: "35px",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.3)",
        },
      }}
    >
      {label}
    </Button>
  );
}

export default NavButton;
