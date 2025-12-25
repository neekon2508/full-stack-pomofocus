import { Box, Stack, Typography } from "@mui/material";
import Logo from "../../components/logo/Logo";
import LoginForm from "../../components/login-form/LoginForm";

function Login() {
  return (
    <Stack
      spacing={5}
      sx={{
        width: "50%",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <Logo fontSize={50} title="Pomofocus" color="white" />

      <Typography variant="h4" color="white">
        Login
      </Typography>
      <LoginForm />
    </Stack>
  );
}

export default Login;
