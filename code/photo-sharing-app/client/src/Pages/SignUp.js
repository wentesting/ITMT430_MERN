import React, { useState } from "react";
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
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../Style/signup.css";

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function useInputValue(initialValue) {
  const [value, setValue] = useState(initialValue);

  function retrieveValue(event) {
    setValue(event.target.value);
  }
  return [value, retrieveValue];
}

function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  return re.test(String(password));
}

function validateForm(values) {
  const errors = {};
  if (!values.firstName) errors.firstName = "First name is required";
  if (!values.lastName) errors.lastName = "Last name is required";
  if (!values.email) errors.email = "Email address is required";
  else if (!validateEmail(values.email))
    errors.email = "Not a valid email address";
  else if (!values.email.includes("iit.edu"))
    errors.email = "Needs to be a valid Hawk Email";
  if (!values.phone) errors.phone = "Phone number is required";
  if (!values.password) errors.password = "Password is required";
  else if (!validatePassword(values.password))
    errors.password =
      "1 lowercase, 1 uppercase, 1 number, 1 special character, and 8 characters or longer,";
  else if (!values.confirmPassword)
    errors.confirmPassword = "Please repeat the password";
  else if (values.password != values.confirmPassword)
    errors.confirmPassword = "Passwords don't match";

  return errors;
}

export default function SignUp() {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const history = useHistory();
  const [errors, setErrors] = useState({});

  function registerUser() {
    axios
      .post(`${window.location.origin}/users/register`, {
        name: firstName + " " + lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        phone: phone,
      })
      .then((res) => {
        if (res.data._id) {
          history.push("/login");
        }
      });
  }

  function handleSignUp() {
    const errors = validateForm({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
    });
    setErrors(errors);
    if (!Object.keys(errors).length) {
      registerUser();
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
          Sign up
        </Typography>

        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                className="inputs"
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoFocus
              />
              {errors.firstName && <p style={errorStyle}>{errors.firstName}</p>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className="inputs"
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="lname"
              />
              {errors.lastName && <p style={errorStyle}>{errors.lastName}</p>}
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="inputs"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="inputs"
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {errors.password && <p style={errorStyle}>{errors.password}</p>}
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="inputs"
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="current-password"
              />
              {errors.confirmPassword && (
                <p style={errorStyle}>{errors.confirmPassword}</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="inputs"
                variant="outlined"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="phone-number"
              />
              {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => handleSignUp()}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/#/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
