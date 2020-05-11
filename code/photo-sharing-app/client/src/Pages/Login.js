import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { authenticateSlice, userSlice, adminSlice } from "../slice/setSlice";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import setAuthToken from "../authentication/setAuthToken";
import Alert from "@material-ui/lab/Alert";
import "../Style/login.css";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        IITrade
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function validateEmail(username) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(username).toLowerCase());
}

function validateForm(values) {
  const errors = {};
  if (!values.username) errors.username = "Email address is required";
  else if (!validateEmail(values.username))
    errors.username = "Not a valid email address";
  else if (!values.username.includes("iit.edu"))
    errors.username = "Needs to be a valid IIT Email";
  if (!values.password) errors.password = "Password is required";

  return errors;
}

const errorStyle = {
  color: "red",
  fontSize: "13px",
  textAlign: "center",
};

export default function SignIn() {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState({});

  const isAuthenticated = useSelector((state) => state.isAuthenticate);
  if (isAuthenticated) history.push("/");

  useEffect(() => {
    adminLogout();
  }, []);
  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    setAuthToken(false);
    dispatch(
      adminSlice.actions.setAdmin({ isAuthenticated: false, decoded: null })
    );
  };

  async function handleSubmit(event, props) {
    const errors = validateForm({ username, password });
    setErrors(errors);

    event.preventDefault();
    try {
      const res = await axios.post(`${window.location.origin}/users/login`, {
        email: username,
        password: password,
      });

      const { token } = res.data;
      localStorage.setItem("userToken", token);
      setAuthToken(token);
      const decoded = jwtDecode(token);
      dispatch(authenticateSlice.actions.setAuthenticate());
      dispatch(userSlice.actions.setUser(decoded));
      setIsError(false);
      history.push("/");
    } catch (e) {
      setIsError(true);
    }
  }
  return (
    <Container component="main" maxWidth="xs" class="container">
      <CssBaseline />
      <div className="top"></div>
      <div className="bottom"></div>
      <div className={classes.paper} class="center">
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            className="inputs"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p style={errorStyle}>{errors.username}</p>}
          <TextField
            className="inputs"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p style={errorStyle}>{errors.password}</p>}
          {isError ? <p style={errorStyle}>Account not found!</p> : ""}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => handleSubmit(e)}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item>
              <Link href="/#/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
