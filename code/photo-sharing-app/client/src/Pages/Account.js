import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { authenticateSlice } from "../slice/setSlice";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import { DropzoneArea } from "material-ui-dropzone";
import { TextField, Button } from "@material-ui/core";
import axios from "axios";
import "../Style/userAccount.css";
import LockIcon from "@material-ui/icons/Lock";
import ReplayIcon from "@material-ui/icons/Replay";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Account() {
  var verificationStatus = "Verified";
  const userDataSlice = useSelector((state) => state.setUser);
  const [userData, setUserData] = useState([]);
  const [userName, setName] = useState("");
  const [userPhone, setPhone] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");

  const [nameDisabled, setNameDisabled] = useState(false);
  const [phoneDisabled, setPhoneDisabled] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [passwordDisabled, setPasswordDisabled] = useState(false);
  const [errors, setErrors] = useState({});

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
    const data = await axios.get(
      `${window.location.origin}/users/${userDataSlice.id}`
    );
    console.log(data.data.data);
    setUserData(data.data.data);
    setName(data.data.data.name);
    setEmail(data.data.data.email);
    setPhone(data.data.data.phone);
    setPassword(data.data.data.password);
  }

  //validation
  function validateEmail(userEmail) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(userEmail).toLowerCase());
  }

  function validatePassword(userPassword) {
    let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return re.test(String(userPassword));
  }

  function validateForm(values) {
    const errors = {};
    if (!values.userEmail) errors.userEmail = "Email address is required";
    else if (!validateEmail(values.userEmail))
      errors.userEmail = "Not a valid email address";
    else if (!values.userEmail.includes("iit.edu"))
      errors.userEmail = "Needs to be a valid Hawk Email";

    if (!values.userPassword) errors.userPassword = "Password is required";
    else if (!validatePassword(values.userPassword))
      errors.userPassword =
        "1 lowercase, 1 uppercase, 1 number, 1 special character, and 8 characters or longer";

    if (!values.userPhone) errors.userPhone = "Phone Number is required";

    if (!values.userName) errors.userName = "User Name is required";

    return errors;
  }

  function handleUpdate() {
    // check basic required fields
    const errors = validateForm({
      userPassword,
      userName,
      userPhone,
      userEmail,
    });
    setErrors(errors);

    // check matching credentials
    if (!Object.keys(errors).length) {
      updateUserInfo({ userPassword, userName, userPhone, userEmail });
    }
  }

  const errorStyle = {
    color: "red",
    fontSize: "13px",
    textAlign: "center",
  };

  async function updateUserInfo() {
    if (
      userPassword == "" ||
      userName == "" ||
      userPhone == "" ||
      userEmail == ""
    ) {
      alert("Invalid input");
    } else {
      if (nameDisabled) {
        const res = await axios.patch(
          `${window.location.origin}/users/${userDataSlice.id}`,
          {
            name: userName,
          }
        );
      }
      if (phoneDisabled) {
        const res = await axios.patch(
          `${window.location.origin}/users/${userDataSlice.id}`,
          {
            phone: userPhone,
          }
        );
      }
      if (emailDisabled) {
        const res = await axios.patch(
          `${window.location.origin}/users/${userDataSlice.id}`,
          {
            email: userEmail,
          }
        );
      }
      if (passwordDisabled) {
        const res = await axios.patch(
          `${window.location.origin}/users/${userDataSlice.id}`,
          {
            password: userPassword,
          }
        );
      }

      setOpen(true);
      window.location.reload(false);
    }
  }

  return (
    <div id="accountPage">
      {userData.length <= 0 ? (
        "NONE"
      ) : (
        <div id="accountPageGrid">
          <div id="banner" className="grid-item">
            <img
              alt="profilePicture"
              src="https://cdn2.iconfinder.com/data/icons/users-6/100/USER2-512.png"
              id="userIcon"
            ></img>
          </div>

          <div id="userInfoForm" className="grid-item">
            <h1>Manage User Information</h1>
            <h3>UserID: {userDataSlice.id}</h3>
            <InputLabel htmlFor="standard-adornment-amount">
              Full Name:
              {!nameDisabled ? (
                <Button
                  onClick={() => {
                    setNameDisabled(!nameDisabled);
                    setName("");
                  }}
                >
                  {" "}
                  <LockIcon></LockIcon>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setName(userData.name);
                    setNameDisabled(!nameDisabled);
                  }}
                >
                  <ReplayIcon></ReplayIcon>
                </Button>
              )}
            </InputLabel>
            <Input
              className="inputBoxes"
              value={userName}
              onChange={(e) => setName(e.target.value)}
              type="text"
              disabled={!nameDisabled}
            />
            {errors.userName && <p style={errorStyle}>{errors.userName}</p>}
            <InputLabel htmlFor="standard-adornment-amount">
              Phone number:
              {!phoneDisabled ? (
                <Button
                  onClick={() => {
                    setPhoneDisabled(!phoneDisabled);
                    setPhone("");
                  }}
                >
                  {" "}
                  <LockIcon></LockIcon>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setPhone(userData.phone);
                    setPhoneDisabled(!phoneDisabled);
                  }}
                >
                  <ReplayIcon></ReplayIcon>
                </Button>
              )}
            </InputLabel>
            <Input
              className="inputBoxes"
              value={userPhone}
              onChange={(e) => setPhone(e.target.value)}
              type="phone"
              disabled={!phoneDisabled}
            />
            {errors.userPhone && <p style={errorStyle}>{errors.userPhone}</p>}
            <InputLabel htmlFor="standard-adornment-amount">
              Email Address:
              {!emailDisabled ? (
                <Button
                  onClick={() => {
                    setEmailDisabled(!emailDisabled);
                    setEmail("");
                  }}
                >
                  {" "}
                  <LockIcon></LockIcon>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setEmail(userData.email);
                    setEmailDisabled(!emailDisabled);
                  }}
                >
                  <ReplayIcon></ReplayIcon>
                </Button>
              )}
            </InputLabel>
            <Input
              className="inputBoxes"
              value={userEmail}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              disabled={!emailDisabled}
            />
            {errors.userEmail && <p style={errorStyle}>{errors.userEmail}</p>}
            <InputLabel htmlFor="standard-adornment-amount">
              Password:
              {!passwordDisabled ? (
                <Button
                  onClick={() => {
                    setPasswordDisabled(!passwordDisabled);
                    setPassword("");
                  }}
                >
                  {" "}
                  <LockIcon></LockIcon>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setPassword(userData.password);
                    setPasswordDisabled(!passwordDisabled);
                  }}
                >
                  <ReplayIcon></ReplayIcon>
                </Button>
              )}
            </InputLabel>
            <Input
              className="inputBoxes"
              id="standard-adornment-amount"
              type="password"
              value={userPassword}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!passwordDisabled}
            />
            {errors.userPassword && (
              <p style={errorStyle}>{errors.userPassword}</p>
            )}
            {/*
            <div id="uploadImage">
              <DropzoneArea dropzoneText="Upload file"></DropzoneArea>
            </div>*/}
          </div>
        </div>
      )}
      <div style={{ marginBottom: "5%", marginLeft: "7%" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleUpdate()}
          disabled={
            (!nameDisabled &&
              !phoneDisabled &&
              !emailDisabled &&
              !passwordDisabled) ||
            userName == "" ||
            userPhone == "" ||
            userEmail == "" ||
            userPassword == ""
          }
        >
          Update
        </Button>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Alert onClose={handleClose} severity="success">
            Information is updated.
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
