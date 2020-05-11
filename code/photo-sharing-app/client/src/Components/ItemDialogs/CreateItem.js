import React, { useState } from "react";
import axios from "axios";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import { DropzoneArea } from "material-ui-dropzone";
import "../../Style/createUpdateItemStyle.css";
import {
  TextField,
  MenuItem,
  Button,
  ButtonGroup,
  ListItem,
  List,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import CircularProgress from '@material-ui/core/CircularProgress';

const upload = require("superagent");

export default function CreateItemDialog() {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    window.location.reload(false);
  };

  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("Books");
  const [itemPrice, setItemPrice] = useState("");
  const [itemStatus, setItemStatus] = useState("Sell");
  const [itemLocation, setItemLocation] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [errors, setErrors] = useState({});

  function validateForm(values) {
    const errors = {};
    if (!values.itemName) errors.itemName = "Item Name is required";
    if (!values.itemPrice) errors.itemPrice = "Item Price is required";
    if (!values.itemLocation) errors.itemLocation = "Item Location is required";
    if (!values.itemDescription)
      errors.itemDescription = "Item Description is required";
    if (selectedFile == null) errors.selectedFile = "Item image is required";
    return errors;
  }

  function handleItemCreate() {
    // check basic required fields
    const errors = validateForm({
      itemName,
      itemPrice,
      itemLocation,
      itemDescription,
      selectedFile,
    });
    setErrors(errors);

    if (!Object.keys(errors).length) {
      createItemToDB({
        itemName,
        itemStatus,
        itemCategory,
        itemPrice,
        itemLocation,
        itemDescription,
      });
    }
  }

  const errorStyle = {
    color: "red",
    fontSize: "13px",
    textAlign: "center",
  };

  const category = [
    {
      value: "Books",
      label: "Books",
    },
    {
      value: "Electronics",
      label: "Electronics",
    },
    {
      value: "Clothing",
      label: "Clothing",
    },
    {
      value: "Rental",
      label: "Rental",
    },
    {
      value: "Funitures",
      label: "Funitures",
    },
    {
      value: "Supplies",
      label: "Supplies",
    },
    {
      value: "Vehicles",
      label: "Vehicles",
    },
  ];

  const [loading, setLoading] = React.useState(false);   
  const timer = React.useRef();

  const handleButtonClick = () => {  
    if (!loading) {   
      setLoading(true);  
      timer.current = setTimeout(() => {   
        setLoading(false);  
      }, 30000);  
    }  
  };

  //Function to create item to db

  async function createItemToDB(
    label,
    status,
    category,
    price,
    location,
    description
  ) {
    // check basic required fields
    const errors = validateForm({
      itemName,
      itemStatus,
      itemPrice,
      itemLocation,
      itemDescription,
    });
    setErrors(errors);

    let promise;
    let url;
    let photoKey;
    if (Object.keys(errors).length == 0) {
      handleButtonClick();
      try {
        promise = await upload
          .post(`${window.location.origin}/items/upload`)
          .attach("files", selectedFile[0]);

        url = promise.body.data[0].Location;
        photoKey = promise.body.data[0].Key;
      } catch (e) {
        console.log("Error");
      }
      console.log(label, status, category, price, location, description);
      let res = await axios.post(
        `${window.location.origin}/items`,
        {
          name: label,
          status: "Available",
          category: category,
          price: parseInt(price),
          location: location,
          description: description,
          photo: url,
          photoKey: photoKey,
        }
      );

      setItemName("");
      setItemPrice("");
      setItemLocation("");
      setItemDescription("");

      window.location.reload(false);
    }
  }

  function handleSelectedFiles(files) {
    setSelectedFile(files);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Post An Item For Sale</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="standard-adornment-amount"
            label="Name"
            type="text"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
            }}
            fullWidth
          />
          {errors.itemName && <p style={errorStyle}>{errors.itemName}</p>}
          <TextField
            id="standard-select-currency"
            select
            required
            label="Category"
            helperText="Please select category"
            value={itemCategory}
            onChange={(e) => {
              setItemCategory(e.target.value);
            }}
            fullWidth
          >
            {category.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            id="standard-adornment-amount"
            label="Amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            value={itemPrice}
            onChange={(e) => {
              setItemPrice(e.target.value);
            }}
            fullWidth
          />
          {errors.itemPrice && <p style={errorStyle}>{errors.itemPrice}</p>}
          <TextField
            margin="dense"
            id="standard-adornment-amount"
            label="Pick Up Location"
            value={itemLocation}
            onChange={(e) => {
              setItemLocation(e.target.value);
            }}
            fullWidth
          />
          {errors.itemLocation && (
            <p style={errorStyle}>{errors.itemLocation}</p>
          )}
          <TextField
            id="standard-multiline-static"
            label="Item Description"
            multiline
            rows="4"
            value={itemDescription}
            onChange={(e) => {
              setItemDescription(e.target.value);
            }}
            fullWidth
          />
          {errors.itemDescription && (
            <p style={errorStyle}>{errors.itemDescription}</p>
          )}
          <DropzoneArea
            dropzoneText="Upload file"
            required
            onChange={(e) => handleSelectedFiles(e)}
          ></DropzoneArea>
          {errors.selectedFile && (
            <p style={errorStyle}>{errors.selectedFile}</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              createItemToDB(
                itemName,
                itemStatus,
                itemCategory,
                itemPrice,
                itemLocation,
                itemDescription
              )
            }
            color="primary"
          >
            Sell
          </Button>
          {loading && <CircularProgress size={20}/>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
