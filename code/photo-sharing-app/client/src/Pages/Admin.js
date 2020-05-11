import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { Button } from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import ReplayIcon from "@material-ui/icons/Replay";
import { useDispatch, useSelector } from "react-redux";
import { adminSlice } from "../slice/setSlice";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import jwtDecode from "jwt-decode";
import { CSVLink, CSVDownload } from "react-csv";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    minWidth: 650,
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Admin() {
  const [usersData, setUsersData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [requestsData, setRequestsData] = useState([]);

  const [tempUsersData, setTempUsersData] = useState([]);
  const [tempItemsData, setTempItemsData] = useState([]);
  const [tempRequestsData, setTempRequestsData] = useState([]);

  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openUpdateUserDialog, setOpenUpdateUserDialog] = useState(false);
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);

  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openDeleteItemDialog, setOpenDeleteItemDialog] = useState(false);

  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [openDeleteRequestDialog, setOpenDeleteRequestDialog] = useState(false);

  const [userName, setName] = useState("");
  const [userPhone, setPhone] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");

  const [nameDisabled, setNameDisabled] = useState(false);
  const [phoneDisabled, setPhoneDisabled] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [passwordDisabled, setPasswordDisabled] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const [invalidInputOpen, setInvalidInputOpen] = React.useState(false);
  const [updateSuccessOpen, setUpdateSuccessOpen] = React.useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = React.useState(false);
  const [operationErrorOpen, setOperationErrorOpen] = React.useState(false);

  const [errors, setErrors] = useState({});

  // Handel snackbar closing
  const handleInvalidInputClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setInvalidInputOpen(false);
  };

  const handleUpdateSuccesClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setUpdateSuccessOpen(false);
  };

  const handleDeleteSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setDeleteSuccessOpen(false);
    setOperationErrorOpen(false);
  };

  const handleOperationErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOperationErrorOpen(false);
  };

  // Handle user dialog
  const handleClickOpenUserDialog = (data) => {
    console.log(data);
    setTempUsersData(data);
    setOpenUserDialog(true);
  };
  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
  };

  const handleClickOpenUpdateUserDialog = (data) => {
    setTempUsersData(data);
    setName(data.name);
    setPhone(data.phone);
    setEmail(data.email);
    setPassword(data.password);
    setOpenUpdateUserDialog(true);
  };
  const handleCloseUpdateUserDialog = () => {
    setOpenUpdateUserDialog(false);
  };

  const handleClickOpenDeleteUserDialog = (data) => {
    setTempUsersData(data);
    setOpenDeleteUserDialog(true);
  };
  const handleCloseDeleteUserDialog = () => {
    setOpenDeleteUserDialog(false);
  };

  //Handle item dialog

  const handleClickOpenItemDialog = (data) => {
    setTempItemsData(data);
    setOpenItemDialog(true);
  };
  const handleCloseItemDialog = () => {
    setOpenItemDialog(false);
  };

  const handleClickOpenDeleteItemDialog = (data) => {
    setTempItemsData(data);
    setOpenDeleteItemDialog(true);
  };
  const handleCloseDeleteItemDialog = () => {
    setOpenDeleteItemDialog(false);
  };

  //Handle request dialog

  const handleClickOpenRequestDialog = (data) => {
    setTempRequestsData(data);
    setOpenRequestDialog(true);
  };
  const handleCloseRequestDialog = () => {
    setOpenRequestDialog(false);
  };

  const handleClickOpenDeleteRequestDialog = (data) => {
    setTempRequestsData(data);
    setOpenDeleteRequestDialog(true);
  };
  const handleCloseDeleteRequestDialog = () => {
    setOpenDeleteRequestDialog(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchItems();
    fetchRequests();
  }, []);
  async function fetchUsers() {
    const data = await axios.get(
      `${window.location.origin}/users`
    );
    setUsersData(Object.values(data.data.data));
  }
  async function fetchItems() {
    const data = await axios.get(
      `${window.location.origin}/items`
    );
    setItemsData(Object.values(data.data.data));
  }
  async function fetchRequests() {
    const data = await axios.get(
      `${window.location.origin}/requests`
    );
    setRequestsData(Object.values(data.data.data));
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
      errors.userEmail = "Needs to be a valid IIT Email";

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
      updateUsers({ userPassword, userName, userPhone, userEmail });
    }
  }

  const errorStyle = {
    color: "red",
    fontSize: "13px",
    textAlign: "center",
  };

  //USERS CRUD

  async function updateUsers(id) {
    if (
      userPassword == "" ||
      userName == "" ||
      userPhone == "" ||
      userEmail == ""
    ) {
      //alert("Invalid input");
      setInvalidInputOpen(true);
    } else {
      if (nameDisabled) {
        const res = await axios.patch(
          `${window.location.origin}/users/${tempUsersData._id}`,
          {
            name: userName,
          }
        );
      }
      if (phoneDisabled) {
        const res = await axios.patch(
          `${window.location.origin}/users/${tempUsersData._id}`,
          {
            phone: userPhone,
          }
        );
      }
      if (emailDisabled) {
        const res = await axios.patch(
          `${window.location.origin}/users/${tempUsersData._id}`,
          {
            email: userEmail,
          }
        );
      }
      if (passwordDisabled) {
        const res = await axios.patch(
          `${window.location.origin}/users/${tempUsersData._id}`,
          {
            password: userPassword,
          }
        );
      }

      //alert("success");
      setUpdateSuccessOpen(true);
      //window.location.reload(false);
    }

    /*
    const data = await axios.update(`${window.location.origin}/users/${id}`, {});
    if (data.data.data.ok === 1) {
      alert(`Succesfully updated user ${id}`);
    } else {
      alert(`Operation error!`);
    }
    setOpenDeleteUserDialog(false);
    window.location.reload(false);*/
  }

  async function deleteUsers(id) {
    const data = await axios.delete(
      `${window.location.origin}/users/${id}`
    );
    if (data.data.data.ok === 1) {
      //alert(`Succesfully deleted user ${id}`);
      setDeleteSuccessOpen(true);
    } else {
      //alert(`Operation error!`);
      setOperationErrorOpen(true);
    }
    setOpenDeleteUserDialog(false);
    window.location.reload(false);
  }

  //ITEMS CRUD
  async function deleteItems(id) {
    const data = await axios.delete(
      `${window.location.origin}/items/${id}`
    );
    console.log(data);
    if (data.data.data.ok === 1) {
      //alert(`Succesfully deleted item ${id}`);
      setDeleteSuccessOpen(true);
    } else {
      //alert(`Operation error!`);
      setOperationErrorOpen(true);
    }
    setOpenDeleteItemDialog(false);
    //window.location.reload(false);
  }

  //REQUEST CRUD

  async function deleteRequests(id) {
    const data = await axios.delete(
      `${window.location.origin}/requests/${id}`
    );
    if (data.data.data.ok === 1) {
      //alert(`Succesfully deleted request ${id}`);
      setDeleteSuccessOpen(true);
    } else {
      //alert(`Operation error!`);
      setOperationErrorOpen(true);
    }
    setOpenDeleteRequestDialog(false);
    window.location.reload(false);
  }

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    dispatch(
      adminSlice.actions.setAdmin({ isAuthenticated: false, decoded: null })
    );
    history.push("/management");
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          centered
        >
          <Tab label="Admin Portal" {...a11yProps(0)} />
          <Tab label="User" {...a11yProps(1)} />
          <Tab label="Item" {...a11yProps(2)} />
          <Tab label="Request" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <h1>Welcome Admin!</h1>
        <p>Please use the tabs to navigate to different data tables.</p>
        <Button variant="outlined" color="primary" onClick={logout}>
          Logout
        </Button>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <Button>
                <CSVLink data={usersData}>Export Users Data</CSVLink>
              </Button>
              <TableRow>
                <TableCell>USER_ID</TableCell>
                <TableCell align="right">NAME</TableCell>
                <TableCell align="right">EMAIL</TableCell>
                <TableCell align="right">PHONE</TableCell>
                <TableCell align="right">ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData.length <= 0
                ? "NONE"
                : usersData.map((dat) => (
                    <TableRow key={dat._id}>
                      <TableCell component="th" scope="row">
                        {dat._id}
                      </TableCell>
                      <TableCell align="right">{dat.name}</TableCell>
                      <TableCell align="right">{dat.email}</TableCell>
                      <TableCell align="right">{dat.phone}</TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => handleClickOpenUserDialog(dat)}
                          color="primary"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => handleClickOpenUpdateUserDialog(dat)}
                          color="primary"
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => handleClickOpenDeleteUserDialog(dat)}
                          color="primary"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <Button>
                <CSVLink data={itemsData}>Export Items Data</CSVLink>
              </Button>
              <TableRow>
                <TableCell>ITEM_ID</TableCell>
                <TableCell align="right">NAME</TableCell>
                <TableCell align="right">STATUS</TableCell>
                <TableCell align="right">SELLER_ID</TableCell>
                <TableCell align="right">ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsData.length <= 0
                ? "NONE"
                : itemsData.map((dat) => (
                    <TableRow key={dat._id}>
                      <TableCell component="th" scope="row">
                        {dat._id}
                      </TableCell>
                      <TableCell align="right">{dat.name}</TableCell>
                      <TableCell align="right">{dat.status}</TableCell>
                      <TableCell align="right">{dat.sellerID}</TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => handleClickOpenItemDialog(dat)}
                          color="primary"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() => handleClickOpenDeleteItemDialog(dat)}
                          color="primary"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <Button>
                <CSVLink data={requestsData}>Export Requests Data</CSVLink>
              </Button>
              <TableRow>
                <TableCell>REQUEST_ID</TableCell>
                <TableCell align="right">STATUS</TableCell>
                <TableCell align="right">SELLER_ID</TableCell>
                <TableCell align="right">BUYER_ID</TableCell>
                <TableCell align="right">ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requestsData.length <= 0
                ? "NONE"
                : requestsData.map((dat) => (
                    <TableRow key={dat._id}>
                      <TableCell component="th" scope="row">
                        {dat._id}
                      </TableCell>
                      <TableCell align="right">{dat.requestStatus}</TableCell>
                      <TableCell align="right">{dat.sellerID}</TableCell>
                      <TableCell align="right">{dat.buyerID}</TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => handleClickOpenRequestDialog(dat)}
                          color="primary"
                        >
                          View
                        </Button>
                        <Button
                          onClick={() =>
                            handleClickOpenDeleteRequestDialog(dat)
                          }
                          color="primary"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <Dialog
        open={openUserDialog}
        onClose={() => handleCloseUserDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Profile of {tempUsersData.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            User ID: {tempUsersData._id}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Name: {tempUsersData.name}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Email: {tempUsersData.email}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Phone: {tempUsersData.phone}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Created At: {tempUsersData.createdAt}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Last Updated At: {tempUsersData.updatedAt}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseUserDialog()} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdateUserDialog}
        onClose={() => handleCloseUpdateUserDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Update User {tempUsersData.name}
        </DialogTitle>
        <DialogContent>
          {!nameDisabled ? (
            <Button
              onClick={() => {
                setNameDisabled(!nameDisabled);
                setName("");
              }}
            >
              {"Name"}
              <LockIcon></LockIcon>
            </Button>
          ) : (
            <Button
              onClick={() => {
                setName(tempUsersData.name);
                setNameDisabled(!nameDisabled);
              }}
            >
              {"Name"}
              <ReplayIcon></ReplayIcon>
            </Button>
          )}
          <TextField
            margin="dense"
            id="Name"
            type="text"
            fullWidth
            value={userName}
            disabled={!nameDisabled}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.userName && <p style={errorStyle}>{errors.userName}</p>}
          {!emailDisabled ? (
            <Button
              onClick={() => {
                setEmailDisabled(!emailDisabled);
                setEmail("");
              }}
            >
              {"Email"}
              <LockIcon></LockIcon>
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEmail(tempUsersData.email);
                setEmailDisabled(!emailDisabled);
              }}
            >
              {"Email"}
              <ReplayIcon></ReplayIcon>
            </Button>
          )}

          <TextField
            margin="dense"
            id="Email"
            type="email"
            fullWidth
            value={userEmail}
            disabled={!emailDisabled}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.userEmail && <p style={errorStyle}>{errors.userEmail}</p>}
          {!passwordDisabled ? (
            <Button
              onClick={() => {
                setPasswordDisabled(!passwordDisabled);
                setPassword("");
              }}
            >
              {"Password"}
              <LockIcon></LockIcon>
            </Button>
          ) : (
            <Button
              onClick={() => {
                setPassword(tempUsersData.password);
                setPasswordDisabled(!passwordDisabled);
              }}
            >
              {"Password"}
              <ReplayIcon></ReplayIcon>
            </Button>
          )}

          <TextField
            margin="dense"
            id="Password"
            type="password"
            fullWidth
            value={userPassword}
            disabled={!passwordDisabled}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.userPassword && (
            <p style={errorStyle}>{errors.userPassword}</p>
          )}
          {!phoneDisabled ? (
            <Button
              onClick={() => {
                setPhoneDisabled(!phoneDisabled);
                setPhone("");
              }}
            >
              {"Phone"}
              <LockIcon></LockIcon>
            </Button>
          ) : (
            <Button
              onClick={() => {
                setPhone(tempUsersData.phone);
                setPhoneDisabled(!phoneDisabled);
              }}
            >
              {"Phone"}
              <ReplayIcon></ReplayIcon>
            </Button>
          )}

          <TextField
            margin="dense"
            id="Phone"
            type="phone"
            fullWidth
            value={userPhone}
            disabled={!phoneDisabled}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.userPhone && <p style={errorStyle}>{errors.userPhone}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseUpdateUserDialog()} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleUpdate(tempUsersData._id)}
            color="primary"
            autoFocus
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteUserDialog}
        onClose={() => handleCloseDeleteUserDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete User {tempUsersData.name} ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action to delete user cannot be undone. Do you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDeleteUserDialog()} color="primary">
            No
          </Button>
          <Button
            onClick={() => deleteUsers(tempUsersData._id)}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openItemDialog}
        onClose={() => handleCloseItemDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          View Item {tempItemsData.name}
        </DialogTitle>
        <DialogContent>
          <img
            style={{ height: "50%", width: "50%" }}
            src={tempItemsData.photo}
          ></img>
        </DialogContent>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Item ID: {tempItemsData._id}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Name: {tempItemsData.name}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Status: {tempItemsData.status}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Category: {tempItemsData.category}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Price: {tempItemsData.price}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Pickup Location: {tempItemsData.location}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Description: {tempItemsData.description}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Seller ID: {tempItemsData.sellerID}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Created At: {tempItemsData.createdAt}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Last Updated At: {tempItemsData.updatedAt}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseItemDialog()} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteItemDialog}
        onClose={() => handleCloseDeleteItemDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Item {tempItemsData.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action to delete item cannot be undone. Do you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDeleteItemDialog()} color="primary">
            No
          </Button>
          <Button
            onClick={() => deleteItems(tempItemsData._id)}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRequestDialog}
        onClose={() => handleCloseRequestDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">View Request</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <DialogContentText id="alert-dialog-description">
              Item ID: {tempRequestsData._id}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Status: {tempRequestsData.requestStatus}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Seller ID: {tempRequestsData.sellerID}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Buyer ID: {tempRequestsData.buyerID}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Created At: {tempRequestsData.createdAt}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              Last Updated At: {tempRequestsData.updatedAt}
            </DialogContentText>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseRequestDialog()} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteRequestDialog}
        onClose={() => handleCloseDeleteRequestDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Request {tempRequestsData._id}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action to delete request cannot be undone. Do you want to
            proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleCloseDeleteRequestDialog()}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => deleteRequests(tempRequestsData._id)}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={invalidInputOpen}
        autoHideDuration={6000}
        onClose={handleInvalidInputClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert onClose={handleInvalidInputClose} severity="warning">
          Invalid input.
        </Alert>
      </Snackbar>
      <Snackbar
        open={updateSuccessOpen}
        autoHideDuration={6000}
        onClose={handleUpdateSuccesClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert onClose={handleUpdateSuccesClose} severity="success">
          Update completed successfully.
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteSuccessOpen}
        autoHideDuration={6000}
        onClose={handleDeleteSuccessClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert onClose={handleDeleteSuccessClose} severity="success">
          Delete completed successfully.
        </Alert>
      </Snackbar>
      <Snackbar
        open={operationErrorOpen}
        autoHideDuration={6000}
        onClose={handleOperationErrorClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert onClose={handleOperationErrorClose} severity="error">
          Operation Error.
        </Alert>
      </Snackbar>
    </div>
  );
}
