import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { authenticateSlice, userSlice, itemSlice } from "../slice/setSlice";
import { Button, ButtonGroup } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import CardActions from "@material-ui/core/CardActions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import "../Style/cartStyle.css";

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

export default function Cart() {
  let item = 0;
  const history = useHistory();
  const dispatch = useDispatch();

  const [itemData, setItemData] = useState([]);
  const [tempItemData, setTempItemData] = useState([]);
  const [requestID, setRequestID] = useState("");
  const [sellerInfo, setSellerInfo] = useState([]);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const itemDataSlice = useSelector((state) => state.setItem);
  const userDataSlice = useSelector((state) => state.setUser);
  let items = [];
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function getMultipleItem() {
    var id = itemDataSlice.itemID;
    if (id) {
      for (var i = 0; i < id.length; i++) {
        axios
          .get(`${window.location.origin}/items/${id[i]}`)
          .then((response) => {
            items.push(Object.values(response.data));
            setItemData((prevArray) => [
              ...prevArray,
              Object.values(response.data),
            ]);
          });
      }
    }
  }

  useEffect(() => {
    getMultipleItem();
  }, []);

  function handleRequestDialog(data) {
    setOpenRequestDialog(!openRequestDialog);
    setTempItemData(data);
    getSellerInfo(data.sellerID);
  }

  async function getSellerInfo(id) {
    const res = await axios.get(`${window.location.origin}/users/info/${id}`);
    setSellerInfo(res.data.data);
  }

  async function createOneRequest(tempItemData) {
    setOpen(true);

    const requestData = await axios.post(`${window.location.origin}/requests`, {
      requestStatus: "Pending",
      itemID: tempItemData._id,
      buyerID: userDataSlice.id,
      sellerID: tempItemData.sellerID,
    });
    const requestId = requestData.data.data._id;

    axios.patch(`${window.location.origin}/items/${tempItemData._id}`, {
      wishlistedBy: userDataSlice.id,
      requestID: requestId,
      status: "Pending",
    });

    setOpenRequestDialog(false);
    removeOne(tempItemData._id);
  }

  function removeAll() {
    setItemData([]);
    dispatch(
      itemSlice.actions.setItem({
        itemID: [],
        itemCart: 0,
      })
    );
  }

  function removeOne(id) {
    var newArray = itemData.filter((item) => {
      return item[0]._id != id;
    });
    setItemData(newArray);

    var newItemArray = itemDataSlice.itemID.filter((item) => {
      return item != id;
    });

    dispatch(
      itemSlice.actions.setItem({
        itemID: newItemArray,
        itemCart: newArray.length,
      })
    );
  }

  function keepShopping() {
    history.push("/");
    //window.location.reload(false);
  }
  function redirectRequest() {
    history.push("/request");
  }
  //console.log(items);

  itemData.map((dat) => console.log(dat[0].id));

  return (
    <div>
      <Container className="cardGrid" maxWidth="md">
        <h1>Favorite</h1>
        <h2>
          You currently have {itemData.length} item(s) in your favorite list.
        </h2>
        <Grid container spacing={4}>
          {itemData.length <= 0 ? (
            <br />
          ) : (
            itemData.map((dat) => (
              <Grid item xs={12} sm={6} md={4}>
                <Card className="card">
                  <CardContent>
                    <h3>Item name: {dat[0].name}</h3>
                    <h4>Item price: ${dat[0].price}</h4>
                    <CardMedia
                      className="cardMedia"
                      image={dat[0].photo}
                      title={"Image title"}
                    />

                    <CardActions>
                      <ButtonGroup
                        size="small"
                        aria-label="large primary button group"
                      >
                        {!dat[0].deniedID.includes(userDataSlice.id) &&
                          !dat[0].sellerID.includes(userDataSlice.id) &&
                          !dat[0].wishlistedBy.includes(userDataSlice.id) && (
                            <Button
                              variant="outlined"
                              color="primary"
                              //onClick={() => createOneRequest(dat[0]._id)}
                              onClick={() => handleRequestDialog(dat[0])}
                            >
                              SEND REQUEST
                            </Button>
                          )}
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => removeOne(dat[0]._id)}
                        >
                          REMOVE ITEM
                        </Button>
                      </ButtonGroup>
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        {itemData.length > 0 && (
          <div>
            <div>
              <h3>Notice:</h3>
              <p>
                Send request(s) only if you are going to buy. Please be
                responsible for the request(s) you send. If your request is
                denied, you will not be able to see the item again.
              </p>
            </div>
          </div>
        )}
        <div id="buttonGroup">
          <Button
            id="removeAllButton"
            variant="contained"
            color="secondary"
            onClick={() => removeAll()}
          >
            Remove all items
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              keepShopping();
            }}
          >
            Continue Shopping
          </Button>
        </div>
      </Container>

      <Dialog
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Review Request</DialogTitle>
        <DialogContent>
          <DialogContentText>Item Name: {tempItemData.name}</DialogContentText>
          <DialogContentText>Seller Name: {sellerInfo.name}</DialogContentText>
          <DialogContentText>
            Seller Email: {sellerInfo.email}
          </DialogContentText>
          <DialogContentText>
            Seller Phone: {sellerInfo.phone}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            autoFocus
            onClick={() => createOneRequest(tempItemData)}
            disabled={sellerInfo.name == "UNAVAILABLE"}
          >
            Proceed
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
              The request is being sent to Seller.
            </Alert>
          </Snackbar>
        </DialogActions>
      </Dialog>
    </div>
  );
}
