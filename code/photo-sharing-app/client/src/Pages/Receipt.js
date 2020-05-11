import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { authenticateSlice } from "../slice/setSlice";
import { Button } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import axios from "axios";
export default function Receipt() {
  const [requestData, setRequestData] = useState([]);

  function getSpecificRequest() {
    var id = window.location.hash.split("/")[2];

    axios
      .get(`${window.location.origin}/requests/${id}`)
      .then((response) => {
        console.log(response.data);
        setRequestData(Object.values(response.data));
      });
  }
  useEffect(() => {
    getSpecificRequest();
  }, []);

  return (
    <div style={{ margin: "5%" }}>
      {requestData.length <= 0
        ? "Loading"
        : requestData.map((dat) => (
            <div>
              <h1>Request Reciept</h1>
              <h2>Request# {dat._id}</h2>
              <h3>Your request has been sent to:</h3>
              <h5>Date: {dat.createdAt}</h5>
              <h4>Seller Contact Information</h4>
              <p>Full name:</p>
              <p>Phone number:</p>
              <p>Email address:</p>
            </div>
          ))}

      <h2>Notice</h2>
      <p>
        This reciept does not guarantee the confirmation of your order. Within
        24-48hrs, you should recieve a response from your seller(s). If not,
        please contact your seller(s) for request approval.
      </p>
    </div>
  );
}
