import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { authenticateSlice, userSlice, itemSlice } from "../slice/setSlice";
import setAuthToken from "../authentication/setAuthToken";
import "../Style/userProfileStyle.css";
import {
  TextField,
  MenuItem,
  Button,
  ButtonGroup,
  ListItem,
  List,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { DropzoneArea } from "material-ui-dropzone";
import { Button as Button2 } from "@blueprintjs/core";
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import Dropzone from "react-dropzone";
import axios from "axios";
import CreateItemDialog from "../Components/ItemDialogs/CreateItem";
import UpdateItemDialog from "../Components/ItemDialogs/UpdateItem";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const upload = require("superagent");
var itemIdArray = [];
const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Profile() {
  const [itemData, setItemData] = useState([]);
  const [wishlistData, setWishListData] = useState([]);

  const [showCreate, setShowCreateForm] = useState(false);
  const [showUpdate, setShowUpdateForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [props, setProps] = useState();
  const isAuthenticated = useSelector((state) => state.isAuthenticate);
  const userData = useSelector((state) => state.setUser);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const userDataSlice = useSelector((state) => state.setUser);
  const [userAccountData, setUserData] = useState([]);
  const [userName, setName] = useState(userData.name);
  const [userPhone, setPhone] = useState(userData.phone);
  const [userEmail, setEmail] = useState(userData.email);

  const [profile, setProfile] = useState([]);
  const token = localStorage.getItem("userToken");
  var data;
  const localArray = [];

  const [openCreateItemDialog, setOpenCreateItemDialog] = useState(false);
  const [openUpdateItemDialog, setOpenUpdateItemDialog] = useState(false);

  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [denyOpen, setDenyOpen] = React.useState(false);

  const handleCancelClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setCancelOpen(false);
  };

  const handleDeleteClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setDeleteOpen(false);
  };

  const handleApproveClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setApproveOpen(false);
  };

  const handleDenyClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setDenyOpen(false);
  };

  async function getProfile() {
    /*
    let tempArray;
    let itemArray = [];
    data = await axios.get(`${window.location.origin}/users/${userData.id}`, {});
    //console.log(data.data.data.itemID[0].split(","));
    //console.log(data);
    //console.log(data.data.data.itemID);
    if (data.data.data.itemID) {
      tempArray = data.data.data.itemID;

      console.log(tempArray);

      for (var i = 0; i < tempArray.length; i++) {
        //console.log(itemArray[i]);
        axios
          .get(`${window.location.origin}/items/${tempArray[i]}`, {})
          .then(res => {
            setItemData(prevArray => [...prevArray, Object.values(res.data)]);
          });
      }
    }
    itemIdArray = tempArray;
    console.log(itemIdArray);
    //setItemData(itemArray);*/

    axios.get(`${window.location.origin}/items/byOwner`).then((res) => {
      setItemData((prevArray) => [...prevArray, Object.values(res.data.data)]);
    });
  }

  async function getWistList() {
    const data = await axios.get(
      `${window.location.origin}/items/getByWishListedBy`
    );
    setWishListData(data.data.data);
  }

  function getItems() {}
  useEffect(() => {
    getWistList();
    getProfile();
  }, []);

  //Function show create form
  /*
  function showCreateForm() {
    setShowCreateForm(true);
    setShowUpdateForm(false);
  }
*/
  function OpenCreateItemDialog() {
    setOpenCreateItemDialog(true);
  }

  function updateUserItem(id, itemArray) {
    axios.patch(`${window.location.origin}/users/${id}`, {
      itemID: itemArray,
    });
  }

  //Function to remove item from db

  async function deleteItemFromDB(idToDelete) {
    const res = await axios.delete(
      `${window.location.origin}/items/${idToDelete}`
    );
    //setDeleteOpen(true);
    window.location.reload(false);
  }

  //Function redirect to item

  function redirectPosting(id) {
    history.push(`/items/${id}`);
  }

  //Funtion show update form
  /*
  function showUpdateForm(data) {
    setProps(data);
    setShowUpdateForm(true);
    setShowCreateForm(false);
  }
*/
  function OpenUpdateItemDialog(data) {
    setProps(data);
    setOpenUpdateItemDialog(true);
  }

  function signout() {
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
    history.push("/");
  }

  function viewRequest(id) {
    history.push(`/request/${id}`);
  }

  async function approveRequest(requestID, itemID, buyerID) {
    //console.log(requestID[0], itemID, buyerID[0]);
    setApproveOpen(true);

    const requestRes = await axios.patch(
      `${window.location.origin}/requests/${requestID[0]}`,
      {
        requestStatus: "Approved",
      }
    );
    const itemRes = await axios.patch(
      `${window.location.origin}/items/${itemID}`,
      {
        status: "Sold",
        buyerID: buyerID[0],
      }
    );
    window.location.reload(false);
  }

  async function denyRequest(requestID, itemID, wishlistedBy, deniedID) {
    setDenyOpen(true);

    let tempArray = [...deniedID];
    wishlistedBy.map((data) => tempArray.push(data));
    wishlistedBy = [];

    const requestRes = await axios.patch(
      `${window.location.origin}/requests/${requestID}`,
      {
        requestStatus: "Denied",
      }
    );
    const itemRes = await axios.patch(
      `${window.location.origin}/items/${itemID}`,
      {
        status: "Available",
        wishlistedBy: wishlistedBy,
        requestID: [],
        deniedID: tempArray,
      }
    );
    window.location.reload(false);
  }

  async function cancelRequest(requestID, itemID, buyerID) {
    setCancelOpen(true);
    console.log(requestID, itemID, buyerID);

    const requestRes = await axios.patch(
      `${window.location.origin}/requests/${requestID}`,
      {
        requestStatus: "Canceled",
      }
    );

    const itemRes = await axios.patch(
      `${window.location.origin}/items/${itemID}`,
      {
        status: "Available",
        requestID: [],
        wishlistedBy: [],
      }
    );
    window.location.reload(false);
  }

  function back() {
    history.push("/");
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
    const data = await axios.get(
      `${window.location.origin}/users/${userDataSlice.id}`
    );
    //console.log(data.data.data);
    setUserData(data.data.data);
  }

  return (
    <div id="profilePage">
      <div id="grid1">
        <img
          id="userProfilePicture"
          alt="profilePicture"
          src="https://cdn2.iconfinder.com/data/icons/users-6/100/USER2-512.png"
        ></img>

        <div id="userInformationWrap">
          <p className="userInformationDisplay">
            {" "}
            Full Name: {userAccountData.name}{" "}
          </p>
          <p className="userInformationDisplay">
            {" "}
            Phone Number: {userAccountData.phone}{" "}
          </p>
          <p className="userInformationDisplay">
            {" "}
            Email Address: {userAccountData.email}{" "}
          </p>
        </div>

        <div id="buttonsWrap">
          <div className="actionButtons">
            <Button
              id="updateInfoButton"
              variant="contained"
              onClick={() => history.push("/Account")}
            >
              Update Information{" "}
            </Button>
          </div>
          <div className="actionButtons">
            <Button
              id="createPostingButton"
              variant="contained"
              onClick={() => OpenCreateItemDialog()}
            >
              Create Posting{" "}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Container className="cardGrid" maxWidth="md">
          <div>
            <h1> Inventory </h1>
          </div>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                className={classes.heading}
                variant="h6"
                component="h6"
              >
                Currently Selling
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={4}>
                {" "}
                {itemData.length <= 0
                  ? " NONE"
                  : itemData[0].map(
                      (dat) =>
                        dat.status == "Available" && (
                          <Grid item xs={12} sm={6} md={4}>
                            <Card className="card">
                              <CardContent>
                                <div key={dat._id}>
                                  <span className="currentSellingItemsText">
                                    {" "}
                                    ID:{" "}
                                  </span>{" "}
                                  {dat._id}
                                  <a href={"/#/items/" + dat._id}>
                                    {" "}
                                    <span className="currentSellingItemsText">
                                      {" "}
                                      Item Name:{" "}
                                    </span>{" "}
                                    {dat.name}{" "}
                                  </a>
                                  <br />
                                  <span className="currentSellingItemsText">
                                    {" "}
                                    ${" "}
                                  </span>{" "}
                                  {dat.price}
                                  <br />
                                  <CardMedia
                                    className="cardMedia"
                                    image={dat.photo[0]}
                                    title={"Image title"}
                                  />
                                  <CardActions>
                                    <ButtonGroup
                                      size="small"
                                      aria-label="large primary button group"
                                    >
                                      <Button
                                        color="default"
                                        onClick={() => redirectPosting(dat._id)}
                                      >
                                        {" "}
                                        View{" "}
                                      </Button>
                                      <Button
                                        color="primary"
                                        onClick={() =>
                                          OpenUpdateItemDialog(dat)
                                        }
                                      >
                                        {" "}
                                        Edit{" "}
                                      </Button>
                                      <Button
                                        color="secondary"
                                        onClick={() =>
                                          deleteItemFromDB(dat._id)
                                        }
                                      >
                                        {" "}
                                        Delete{" "}
                                      </Button>
                                    </ButtonGroup>
                                  </CardActions>
                                </div>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                    )}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                className={classes.heading}
                variant="h6"
                component="h6"
              >
                Pending Sell
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={4}>
                {" "}
                {itemData.length <= 0
                  ? " NONE"
                  : itemData[0].map(
                      (dat) =>
                        dat.requestID[0] &&
                        dat.status != "Sold" && (
                          <Grid item xs={12} sm={6} md={4}>
                            <Card className="card">
                              <CardContent>
                                <div key={dat._id}>
                                  <span className="currentSellingItemsText">
                                    {" "}
                                    Item Name:{" "}
                                  </span>{" "}
                                  {dat.name} <br />
                                  <span className="currentSellingItemsText">
                                    {" "}
                                    ${" "}
                                  </span>{" "}
                                  {dat.price}
                                  <br />
                                  <CardMedia
                                    className="cardMedia"
                                    image={dat.photo[0]}
                                    title={"Image title"}
                                  />
                                  <CardActions>
                                    <ButtonGroup
                                      size="small"
                                      aria-label="large primary button group"
                                    >
                                      <Button
                                        color="default"
                                        onClick={() =>
                                          viewRequest(dat.requestID)
                                        }
                                      >
                                        View
                                      </Button>
                                      <Button
                                        color="primary"
                                        onClick={() =>
                                          approveRequest(
                                            dat.requestID,
                                            dat._id,
                                            dat.wishlistedBy
                                          )
                                        }
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        color="secondary"
                                        onClick={() =>
                                          denyRequest(
                                            dat.requestID,
                                            dat._id,
                                            dat.wishlistedBy,
                                            dat.deniedID
                                          )
                                        }
                                      >
                                        Deny
                                      </Button>
                                    </ButtonGroup>
                                  </CardActions>
                                </div>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                    )}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                className={classes.heading}
                variant="h6"
                component="h6"
              >
                Pending Buy
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={4}>
                {wishlistData.length <= 0
                  ? "NONE"
                  : wishlistData.map(
                      (dat) =>
                        dat.status != "Sold" && (
                          <Grid item xs={12} sm={6} md={4}>
                            <Card className="card">
                              <CardContent>
                                <div key={dat._id}>
                                  <span className="currentSellingItemsText">
                                    {" "}
                                    Item Name:{" "}
                                  </span>{" "}
                                  {dat.name} <br />
                                  <span className="currentSellingItemsText">
                                    {" "}
                                    ${" "}
                                  </span>{" "}
                                  {dat.price}
                                  <br />
                                  <CardMedia
                                    className="cardMedia"
                                    image={dat.photo[0]}
                                    title={"Image title"}
                                  />
                                  <CardActions>
                                    <ButtonGroup
                                      size="small"
                                      aria-label="large primary button group"
                                    >
                                      <Button
                                        color="default"
                                        onClick={() =>
                                          viewRequest(dat.requestID)
                                        }
                                      >
                                        {" "}
                                        View{" "}
                                      </Button>
                                      <Button
                                        color="secondary"
                                        onClick={() =>
                                          cancelRequest(
                                            dat.requestID[0],
                                            dat._id,
                                            dat.wishlistedBy[0]
                                          )
                                        }
                                      >
                                        Cancel{" "}
                                      </Button>
                                    </ButtonGroup>
                                  </CardActions>
                                </div>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                    )}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                className={classes.heading}
                variant="h6"
                component="h6"
              >
                Item Sold
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={4}>
                {itemData.length <= 0
                  ? "NONE"
                  : itemData[0].map(
                      (dat) =>
                        dat.status == "Sold" && (
                          <Grid item xs={12} sm={6} md={4}>
                            <Card className="card">
                              <CardContent>
                                <div key={dat._id}>
                                  <span className="currentSellingItemsText">
                                    {" "}
                                    Item Name:{" "}
                                  </span>{" "}
                                  {dat.name} <br />
                                  <span className="currentSellingItemsText">
                                    {" "}
                                    ${" "}
                                  </span>{" "}
                                  {dat.price}
                                  <br />
                                  <CardMedia
                                    className="cardMedia"
                                    image={dat.photo[0]}
                                    title={"Image title"}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                    )}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                className={classes.heading}
                variant="h6"
                component="h6"
              >
                Item Bought
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={4}>
                {wishlistData.length <= 0
                  ? "NONE"
                  : wishlistData.map(
                      (dat) =>
                        dat.buyerID && (
                          <Grid item xs={12} sm={6} md={4}>
                            <Card className="card">
                              <CardContent>
                                <div key={dat._id}>
                                  <span className="currentSellingItemsText">
                                    {" "}
                                    Item Name:{" "}
                                  </span>{" "}
                                  {dat.name} <br />
                                  <span className="currentSellingItemsText">
                                    {" "}
                                    ${" "}
                                  </span>{" "}
                                  {dat.price}
                                  <br />
                                  <CardMedia
                                    className="cardMedia"
                                    image={dat.photo[0]}
                                    title={"Image title"}
                                  />
                                  <CardActions>
                                    <ButtonGroup
                                      size="small"
                                      aria-label="large primary button group"
                                    >
                                      <Button
                                        color="default"
                                        onClick={() =>
                                          viewRequest(dat.requestID)
                                        }
                                      >
                                        {" "}
                                        View Receipt{" "}
                                      </Button>
                                    </ButtonGroup>
                                  </CardActions>
                                </div>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                    )}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <div id="wrapBackButton">
            <Button
              id="profileBackButton"
              variant="contained"
              onClick={() => history.push("/")}
            >
              Go back
            </Button>
          </div>
        </Container>
        <Snackbar
          open={cancelOpen}
          autoHideDuration={6000}
          onClose={handleCancelClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Alert onClose={handleCancelClose} severity="success">
            Cancelled successfully.
          </Alert>
        </Snackbar>
        <Snackbar
          open={deleteOpen}
          autoHideDuration={6000}
          onClose={handleDeleteClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Alert onClose={handleDeleteClose} severity="success">
            Deleted successfully.
          </Alert>
        </Snackbar>
        <Snackbar
          open={approveOpen}
          autoHideDuration={6000}
          onClose={handleApproveClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Alert onClose={handleApproveClose} severity="success">
            Approved successfully.
          </Alert>
        </Snackbar>
        <Snackbar
          open={denyOpen}
          autoHideDuration={6000}
          onClose={handleDenyClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Alert onClose={handleDenyClose} severity="success">
            Denied successfully.
          </Alert>
        </Snackbar>
      </div>
      {openCreateItemDialog && <CreateItemDialog />}
      {openUpdateItemDialog && <UpdateItemDialog props={props} />}
    </div>
  );
}
