import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { authenticateSlice, itemSlice } from "../slice/setSlice";
import { userSlice } from "../slice/setSlice";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";
import "../Style/itemPageStyle.css";

var idArray = [];
export default function Items() {
  const [itemData, setItemData] = useState([]);
  const [save, setSave] = useState(false);
  const [intervalIsSet, setIntervalIsSet] = useState(false);
  const itemDataSlice = useSelector((state) => state.setItem);
  const userDataSlice = useSelector((state) => state.setUser);
  const history = useHistory();
  const dispatch = useDispatch();

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  function getSpecificItem() {
    var id = window.location.hash.split("/")[2];
    //${${window.location.origin}}
    axios
      .get(`${window.location.origin}/items/${id}`)
      .then((response) => {
        //console.log(Object.values(response.data));
        setItemData(Object.values(response.data));
      });
  }
  useEffect(() => {
    getSpecificItem();
  }, []);

  var itemArray = [];

  function addToCart(id) {
    let itemCount = itemDataSlice.itemCart;
    itemArray = itemDataSlice.itemID;

    console.log(itemCount);
    console.log(itemArray);

    if (itemCount == undefined) {
      itemCount = 1;
    } else if (!itemArray.includes(id)) {
      itemCount++;
      console.log(itemCount);
    }

    if (itemArray == undefined) {
      itemArray = [id];
    } else if (!itemArray.includes(id)) {
      let temp = [...itemArray];
      temp.push(id);
      itemArray = temp;
    }
    idArray.push(id);

    console.log(itemCount);
    console.log(itemArray);
    console.log(idArray);

    dispatch(
      itemSlice.actions.setItem({
        itemID: itemArray,
        itemCart: itemCount,
      })
    );
    /*setShowCart(false);*/
    setSave(true);
  }

  const handleClose = () => {
    setSave(false);
  };

  return (
    <div>
      {itemData.length <= 0
        ? "Loading"
        : itemData.map((data) => (
            <div key="data._id" id="overallPage">
              <div id="wrapImage">
                <img id="itemDesImage" alt="ItemPicture" src={data.photo} />
              </div>

              <div key="data._id" id="wrapInfo">
                <h1>Item Label: {data.name}</h1>
                <h5>SellerID: {data.sellerID} </h5>
                <h4>Price: {data.price}</h4>
                <p>Pickup-location: {data.location}</p>
                <p>Category: {data.category}</p>
                <p>Description: {data.description}</p>
                {data.sellerID != userDataSlice.id ? (
                  userDataSlice.id != data.wishlistedBy ? (
                    data.status == "Available" ? (
                      !data.deniedID.includes(userDataSlice.id) ? (
                        <div id="buttonPosition">
                          <Button
                            id="backButton"
                            variant="contained"
                            onClick={() => history.push("/")}
                          >
                            Go back
                          </Button>
                          <Button
                            id="saveButton"
                            variant="contained"
                            onClick={() => addToCart(data._id)}
                            disabled={idArray.indexOf(data._id) > -1}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h3>You cannot request this item anymore </h3>
                        </div>
                      )
                    ) : (
                      <h3>This item has been sold</h3>
                    )
                  ) : (
                    <div>
                      <h3>You have requested this item</h3>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          history.push(`/request/${data.requestID}`)
                        }
                      >
                        Check Status
                      </Button>
                    </div>
                  )
                ) : (
                  <div>
                    <h3>You are the owner of this item</h3>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => history.push("/profile")}
                    >
                      Go to profile
                    </Button>
                  </div>
                )}
              </div>
              <Snackbar
                open={save}
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
            </div>
          ))}
    </div>
  );
}
