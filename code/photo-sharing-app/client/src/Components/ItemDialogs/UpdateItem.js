import React, { useState } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import { DropzoneArea } from "material-ui-dropzone";
import { useHistory } from "react-router-dom";
import axios from "axios";
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

export default function UpdateItemDialog({ props }) {
  const [itemName, setItemName] = useState(props.name);
  const [itemCategory, setItemCategory] = useState(props.category);
  const [itemPrice, setItemPrice] = useState(props.price);
  const [itemStatus, setItemStatus] = useState(props.status);
  const [itemLocation, setItemLocation] = useState(props.location);
  const [itemDescription, setItemDescription] = useState(props.description);

  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    window.location.reload(false);
  };

  const history = useHistory();
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

  async function updateItemFromDB(idToUpdate) {
    console.log(idToUpdate);
    console.log(
      itemName,
      itemPrice,
      itemStatus,
      itemLocation,
      itemCategory,
      itemDescription
    );

    const response = await axios.patch(
      `${window.location.origin}/items/${idToUpdate}`,
      {
        name: itemName,
        category: itemCategory,
        price: itemPrice,
        location: itemLocation,
        description: itemDescription,
      }
    );

    //console.log(response);

    setItemName("");
    setItemCategory("");
    setItemPrice("");
    setItemLocation("");
    setItemDescription("");

    window.location.reload(false);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Update Item Information
        </DialogTitle>
        <DialogContent>
          <img id="itemImageInUpdate" alt="Item image" src={props.photo} />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => updateItemFromDB(props._id)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
