import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/request.css";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  TextField,
  MenuItem,
  Button,
  ButtonGroup,
  ListItem,
  List,
} from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
});

export default function Request() {
  const [requestData, setRequestData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [sellerInfo, setSellerInfo] = useState([]);
  const [buyerInfo, setBuyerInfo] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    getRequest();
  }, []);
  async function getRequest() {
    const data = await axios.get(
      `${window.location.origin}/requests/${window.location.hash.split("/")[2]}`
    );
    const item = await axios.get(
      `${window.location.origin}/items/${data.data.data.itemID[0]}`
    );
    //console.log(data.data.data);
    setItemData(item.data.data);
    setRequestData(data.data.data);

    getSellerInfo(item.data.data.sellerID);
    getBuyerInfo(item.data.data.wishlistedBy[0]);
  }

  async function getSellerInfo(id) {
    const res = await axios.get(`${window.location.origin}/users/info/${id}`);
    setSellerInfo(res.data.data);
  }

  async function getBuyerInfo(id) {
    const res = await axios.get(`${window.location.origin}/users/info/${id}`);
    setBuyerInfo(res.data.data);
  }

  //getBuyerInfo(itemData.buyerID);

  return (
    <div id="requestPage">
      {requestData.length <= 0 ? (
        "NONE"
      ) : (
        <div>
          <div id="thankyouBanner">
            <h1 id="thankYou">Thank You</h1>
            <h4 id="createdDate">Created At: {requestData.createdAt}</h4>
            <h4 id="createdID">ID: {requestData._id}</h4>
          </div>
          <TableContainer component={Paper} id="tableWrap">
            <Table className={classes.table} aria-label="spanning table">
              <TableHead fontWeight="fontWeightBold">
                <TableRow>
                  <TableCell className="row1">
                    <p className="labels">Your Order Receipt</p>
                  </TableCell>
                  <TableCell className="row1" align="left">
                    <p className="labels">Name</p>
                  </TableCell>
                  <TableCell className="row1" align="left">
                    <p className="labels">Pickup location</p>{" "}
                  </TableCell>
                  <TableCell className="row1" align="left">
                    <p className="labels">Description</p>
                  </TableCell>
                  <TableCell className="row1" align="center">
                    <p className="labels">Status</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <img id="imageID" src={itemData.photo}></img>
                  </TableCell>
                  <TableCell align="left">{itemData.name}</TableCell>
                  <TableCell align="left">{itemData.location}</TableCell>
                  <TableCell align="left">{itemData.description}</TableCell>
                  <TableCell align="center">
                    {requestData.requestStatus}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={4} colSpan={3} />
                  <TableCell colSpan={1} align="left">
                    <p className="labels">Total: </p>
                  </TableCell>
                  <TableCell align="right">${itemData.price}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={1} align="left">
                    <p className="labels">Sold by: </p>
                  </TableCell>
                  <TableCell align="right">
                    {sellerInfo.name} ({sellerInfo.email})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={1} align="left">
                    <p className="labels">Requested by: </p>
                  </TableCell>
                  <TableCell align="right">
                    {buyerInfo.name} ({buyerInfo.email})
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      {/*

      <Button color="primary">APPROVE</Button>
      <Button color="secondary">DENY</Button>

      <h2>Notice</h2>
      <p>
        Ensure you and the requester agree in buying the item. Once approve,
        this item will be marked as Sold and will be Unvailable from the market
      </p>*/}
    </div>
  );
}
