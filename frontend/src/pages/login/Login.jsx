import { Box, Link, Stack, Typography } from "@mui/material";
import Logo from "../../components/header/logo/Logo";
import LoginForm from "../../components/login-form/LoginForm";
import { useNavigate } from "react-router-dom";

function Login() {
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
        Login
      </Typography>
      <LoginForm />
      <Stack color="white" alignItems="center">
        <Typography variant="body2">Do not have an account?</Typography>
        <Link
          href="/signup"
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            color: "inherit",
          }}
        >
          Create account
        </Link>
      </Stack>
    </Stack>
  );
}

export default Login;
