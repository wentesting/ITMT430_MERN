import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { authenticateSlice, itemSlice, userSlice } from "../slice/setSlice";
import setAuthToken from "../authentication/setAuthToken";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "../Style/home.css";

let idArray = [];
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
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
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

export default function Home() {
  const classes = useStyles();
  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.isAuthenticate);
  const userData = useSelector((state) => state.setUser);
  const itemDataSlice = useSelector((state) => state.setItem);
  const searchItem = useSelector((state) => state.setItem.search);

  const [itemData, setItemData] = useState([]);
  const [intervalIsSet, setIntervalIsSet] = useState(false);
  const [itemInCart, setItemInCart] = useState(1);
  const [itemID, setItemID] = useState([]);
  const [showCart, setShowCart] = useState(true);
  const dispatch = useDispatch();
  //const cards = itemData;
  const [categorySelected, setCategory] = useState([""]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosing = () => {
    setAnchorEl(null);
  };

  const handleSelectionClick = (event) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    getItemFromDB();
    //console.log("Show itemData" + itemData);
    if (!intervalIsSet) {
      let interval = setInterval(getItemFromDB, 3000);
      setIntervalIsSet(interval);
    }
    return function cleanUp() {
      if (intervalIsSet) {
        clearInterval(intervalIsSet);
        setIntervalIsSet(null);
      }
    };
  }, []);

  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  //Function to fecth item from db
  function getItemFromDB() {
    fetch(`${window.location.origin}/items`)
      .then((itemData) => itemData.json())
      .then((res) => {
        setItemData(res.data);
        //console.log(res);
      });
  }

  function redirectItem(id) {
    //dispatch(itemSlice.actions.setItem({ id: id }));
    history.push("/items/" + id);
  }

  function redirectProfile() {
    history.push("/profile");
  }

  function redirectLogin() {
    history.push("/login");
  }

  function signout() {
    localStorage.removeItem("userToken");
    setAuthToken(false);
    dispatch(authenticateSlice.actions.setUnAuthenticate());
    dispatch(
      userSlice.actions.setUser({ id: null, name: null, iat: null, exp: null })
    );
    dispatch(itemSlice.actions.setItem({ itemID: null, itemCart: null }));
  }

  function selectingCategory(name) {
    setCategory(name);
  }

  function addToCart(id) {
    let itemCount = itemDataSlice.itemCart;
    let itemArray = itemDataSlice.itemID;

    if (itemCount == undefined) {
      itemCount = 1;
    } else {
      itemCount++;
    }
    if (itemArray == undefined) {
      itemArray = [id];
    } else {
      let temp = [...itemArray];
      temp.push(id);

      itemArray = temp;
    }
    idArray.push(id);

    dispatch(
      itemSlice.actions.setItem({
        itemID: itemArray,
        itemCart: itemCount,
      })
    );
    console.log(itemCount);
    console.log(itemArray);

    /*
    console.log(idArray);
    idArray.push(id);
    let itemCount = itemInCart;
    ++itemCount;
    setItemInCart(itemCount);
    setItemID(...idArray);
    console.log(itemInCart);

    setShowCart(false);
    */
    setOpen(true);
  }

  let cards;
  if (searchItem == "" || searchItem == undefined) {
    cards = itemData;
  } else {
    cards = itemData.filter((item) =>
      item.name.toLowerCase().includes(searchItem.toLowerCase())
    );
  }

  if (categorySelected == "" || categorySelected == undefined) {
    cards = cards;
  } else {
    cards = cards.filter((item) => item.category == categorySelected);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              IITrade
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              paragraph
            >
              This is a marketplace for IIT Students
            </Typography>
            {isAuthenticated && (
              <div>
                <Typography
                  variant="h6"
                  align="center"
                  color="textPrimary"
                  gutterBottom
                >
                  Welcome {userData.name}
                </Typography>
              </div>
            )}

            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    id="sellSomethingButton"
                    onClick={() => {
                      redirectProfile();
                    }}
                  >
                    Sell Something
                  </Button>
                  <Button
                    id="categoryButton"
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                  >
                    Category
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    label="Category"
                    open={Boolean(anchorEl)}
                    onClose={handleClosing}
                    id="customized-menu"
                  >
                    <MenuItem onClick={() => selectingCategory("")}>
                      {" "}
                      All{" "}
                    </MenuItem>
                    <MenuItem onClick={() => selectingCategory("Books")}>
                      {" "}
                      Books{" "}
                    </MenuItem>
                    <MenuItem onClick={() => selectingCategory("Electronics")}>
                      {" "}
                      Electronic{" "}
                    </MenuItem>
                    <MenuItem onClick={() => selectingCategory("Clothing")}>
                      {" "}
                      Clothing{" "}
                    </MenuItem>
                    <MenuItem onClick={() => selectingCategory("Rental")}>
                      {" "}
                      Rental{" "}
                    </MenuItem>
                    <MenuItem onClick={() => selectingCategory("Funitures")}>
                      {" "}
                      Furnitures{" "}
                    </MenuItem>
                    <MenuItem onClick={() => selectingCategory("Supplies")}>
                      {" "}
                      Supplies{" "}
                    </MenuItem>
                    <MenuItem onClick={() => selectingCategory("Vehicles")}>
                      {" "}
                      Vehicles{" "}
                    </MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.length <= 0 ? (
              <Typography gutterBottom variant="h5" component="h5">
                No item available. Please come back later :)
              </Typography>
            ) : (
              cards.map(
                (card) =>
                  card.status == "Available" && (
                    <Grid item key={card._id} xs={12} sm={6} md={4}>
                      <Card className={classes.card}>
                        <CardMedia
                          className={classes.cardMedia}
                          image={card.photo[0]}
                          title={"Image title"}
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {card.name}
                          </Typography>
                          <Typography variant="h6" component="h3">
                            ${card.price}
                          </Typography>
                          <Typography>{card.description}</Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => redirectItem(card._id)}
                          >
                            View
                          </Button>
                          {userData.id != card.sellerID ? (
                            userData.id != card.wishlistedBy ? (
                              !card.deniedID.includes(userData.id) ? (
                                <Button
                                  size="small"
                                  color="primary"
                                  onClick={() => addToCart(card._id)}
                                  disabled={idArray.indexOf(card._id) > -1}
                                >
                                  Save
                                </Button>
                              ) : (
                                <Button>Denied</Button>
                              )
                            ) : (
                              <Button>Requested</Button>
                            )
                          ) : (
                            <Button>Owned</Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  )
              )
            )}
          </Grid>
        </Container>
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
            Item is saved to your Favorite.
          </Alert>
        </Snackbar>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Need Support?
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Contact us via support@IITrade.com
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
