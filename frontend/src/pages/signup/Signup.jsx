import { Box, Link, Stack, Typography } from "@mui/material";
import Logo from "../../components/header/logo/Logo";
import { useNavigate } from "react-router-dom";
import SignupForm from "../../components/signup-form/SignupForm";

function Signup() {
  const navigate = useNavigate();

  return (
    <Stack
      spacing={5}
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pb: "10vh",
      }}
    >
      <Logo fontSize={50} title="Pomofocus" color="white" />

      <Typography variant="h4" color="white">
        Sign up
      </Typography>
      <SignupForm />
      <Stack color="white" alignItems="center">
        <Typography variant="body2">Already have an account?</Typography>
        <Link
          href="/login"
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            color: "inherit",
          }}
        >
          Log in
        </Link>
      </Stack>
    </Stack>
  );
}

export default Signup;
