import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { signIn } from "../../api/SignIn";
import { userSignIn } from "./authSlice";
import {
  setClientGLCodes,
  setClientGLCodesMap,
  setSelectedClient,
} from "../../redux/globalSlice";
import { getGLCodesByClientId } from "../../api/user";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    if (!email || !password) {
      setErrorMessage("Please enter valid username and password");
      return;
    } else {
      setErrorMessage("");
    }

    let res;
    try {
      res = await signIn({ id: email, password });
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
      return;
    }

    if (!res?.token) {
      setErrorMessage(res?.error || "Login failed. Please try again.");
      return;
    }

    const { token: accessToken, role: userRole, clients, mappedUsers } = res;

    if (!clients?.length) {
      setErrorMessage(
        "No clients assigned to your account. Contact an administrator."
      );
      return;
    }

    localStorage.setItem("authToken", accessToken);
    dispatch(
      userSignIn({
        accessToken,
        userRole,
        clients,
        userEmail: email,
        mappedUsers,
      })
    );
    const selectedClient = clients[0];
    dispatch(setSelectedClient(selectedClient));
    const glCodes = await getGLCodesByClientId(selectedClient.id);
    const glCodesMap = {};
    glCodes.map((glCodeObj) => {
      glCodesMap[glCodeObj.code] = glCodeObj.name;
    });
    dispatch(setClientGLCodesMap(glCodesMap));
    dispatch(setClientGLCodes(glCodes));
    navigate("/schedular-module");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          {errorMessage && (
            <Typography sx={{ color: "#f44336" }}>{errorMessage} </Typography>
          )}
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
