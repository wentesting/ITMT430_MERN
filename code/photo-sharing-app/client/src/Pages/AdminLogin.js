import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import jwtDecode from "jwt-decode";
import setAuthToken from "../authentication/setAuthToken";
import {
  adminSlice,
  userSlice,
  authenticateSlice,
  itemSlice,
} from "../slice/setSlice";

import CircularProgress from "@material-ui/core/CircularProgress";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        IITrade
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const errorStyle = {
  color: "red",
  fontSize: "13px",
  textAlign: "center",
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(data:image/png;base64,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)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "auto",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
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

function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateForm(values) {
  const errors = {};
  if (!values.username) errors.username = "Email address is required";
  else if (!validateEmail(values.username))
    errors.username = "Not a valid email address";
  else if (!values.username.includes("iitrade.com"))
    errors.username = "Needs to be a valid Admin Email";
  if (!values.password) errors.password = "Password is required";
  if (!values.accessCode) errors.accessCode = "Access Code is required";

  return errors;
}

export default function AdminSignInSide() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const adminDataSlice = useSelector((state) => state.setAdmin);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef();

  useEffect(() => {
    UserSignout();
  }, []);

  function UserSignout() {
    localStorage.removeItem("userToken");
    setAuthToken(false);
    dispatch(authenticateSlice.actions.setUnAuthenticate());
    dispatch(
      userSlice.actions.setUser({
        id: null,
        name: null,
        iat: null,
        exp: null,
      })
    );
    dispatch(
      itemSlice.actions.setItem({
        itemID: null,
        itemCart: null,
      })
    );
  }
  const isAuthenticated = useSelector(
    (state) => state.setAdmin.isAuthenticated
  );
  if (isAuthenticated) history.push("/admin");
  const handleButtonClick = () => {
    if (!loading) {
      setLoading(true);
      timer.current = setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  async function redirectAdmin() {
    handleButtonClick();

    const response = await Axios.post(`${window.location.origin}/admin/login`, {
      email: username,
      password: password,
      accessCode: accessCode,
    });

    if (response.data) {
      const { token } = response.data;
      localStorage.setItem("adminToken", token);
      setAuthToken(token);

      const decoded = jwtDecode(token);
      dispatch(adminSlice.actions.setAdmin({ isAuthenticated: true, decoded }));

      history.push("/admin");
    }
  }

  function handleSignIn() {
    // check basic required fields
    const errors = validateForm({ username, password, accessCode });
    setErrors(errors);
    // check matching credentials
    if (!Object.keys(errors).length) {
      redirectAdmin();
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Admin Portal Sign in
          </Typography>

          <TextField
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

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="accessCode"
            label="Access Code"
            type="password"
            id="accessCode"
            onChange={(e) => setAccessCode(e.target.value)}
          />
          {errors.accessCode && <p style={errorStyle}>{errors.accessCode}</p>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => handleSignIn()}
            //onClick={() => redirectAdmin()}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item>
              <Link href="/#/login" variant="body2">
                Standard User?
              </Link>
            </Grid>
          </Grid>
          {loading && <CircularProgress size={40} />}
          <Box mt={5}>
            <Copyright />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}
