import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import google from "../../assets/images/google-icon/google.svg";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit() {}

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "30px",
        width: { xs: "90%", sm: "400px" },
        margin: "20px auto",
        boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <Stack spacing={3} alignItems="stretch">
        <Button
          variant="outlined"
          fullWidth
          startIcon={<img src={google} alt="google" style={{ width: 20 }} />}
          sx={{
            py: 1.5,
            textTransform: "none",
            color: "#555",
            borderColor: "#ddd",
            fontWeight: "bold",
            fontSize: "16px",
            "&:hover": {
              borderColor: "#bbb",
              backgroundColor: "#f9f9f9",
            },
          }}
        >
          Login with Google
        </Button>

        <Divider>
          <Typography color="text.secondary" sx={{ fontSize: "18px", px: 1 }}>
            OR
          </Typography>
        </Divider>

        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "#aaa", mb: 1, display: "block" }}
          >
            EMAIL
          </Typography>
          <TextField
            fullWidth
            placeholder="example@mail.com"
            variant="filled"
            InputProps={{ disableUnderline: true }}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "8px",
                backgroundColor: "#efefef",
              },
              "& .MuiInputBase-input": {
                padding: "10px 12px",
                fontSize: "14px",
                height: "1.2em",
              },
            }}
          />
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "#aaa", mb: 1, display: "block" }}
          >
            PASSWORD
          </Typography>
          <TextField
            fullWidth
            variant="filled"
            InputProps={{ disableUnderline: true }}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "8px",
                backgroundColor: "#efefef",
              },
              "& .MuiInputBase-input": {
                padding: "10px 12px",
                fontSize: "14px",
                height: "1.2em",
              },
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            backgroundColor: "#222", // Màu đen huyền bí hoặc đỏ theo theme của bạn
            textTransform: "none",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#000",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            },
          }}
        >
          Log in with Email
        </Button>

        <Link
          href=""
          sx={{
            textAlign: "center",
            color: "rgb(0,0,0,0.5)",
            fontWeight: "500",
          }}
        >
          Forgot Password
        </Link>
      </Stack>
    </Box>
  );
}

export default LoginForm;
