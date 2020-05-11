import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Admin from "./Pages/Admin";
import AdminSignIn from "./Pages/AdminLogin";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import AppBar from "./Components/AppBar";
import Home from "./Pages/Home";
import AdminPrivateRoute from "./Components/AdminPrivateRoute";
import PrivateRoute from "./Components/PrivateRoute";
import Profile from "./Pages/Profile";
import Account from "./Pages/Account";
import Cart from "./Pages/Cart";
import Request from "./Pages/Request";
import Receipt from "./Pages/Receipt";
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
  HashRouter,
  useHistory,
} from "react-router-dom";
import Notifications from "./Pages/Notifications";
import Inbox from "./Pages/Inbox";
import Items from "./Pages/Items";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./authentication/setAuthToken";
import {
  userSlice,
  authenticateSlice,
  itemSlice,
  adminSlice,
} from "./slice/setSlice";
import axios from "axios";
function App() {
  const dispatch = useDispatch();
  const history = useHistory();

  if (localStorage.userToken) {
    const token = localStorage.userToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    dispatch(authenticateSlice.actions.setAuthenticate());
    dispatch(userSlice.actions.setUser(decoded));

    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("userToken");
      setAuthToken(false);
      dispatch(authenticateSlice.actions.setUnAuthenticate());
      dispatch(
        userSlice.actions.setUser({ id: null, email: null, name: null })
      );
      dispatch(itemSlice.actions.setItem({ itemID: null, itemCart: null }));
      //history.push("/users");
    }
  }

  if (localStorage.adminToken) {
    const token = localStorage.adminToken;
    //setAuthToken(token);
    const decoded = jwt_decode(token);
    setAuthToken(token);
    dispatch(adminSlice.actions.setAdmin({ isAuthenticated: true, decoded }));

    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("adminToken");
      setAuthToken(false);
      dispatch(
        adminSlice.actions.setAdmin({ isAuthenticated: false, decoded: null })
      );
    }
  }

  return (
    <HashRouter>
      <div className="App">
        <AppBar />
      </div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/items" component={Items} />
        <AdminPrivateRoute path="/admin" component={Admin} />
        {/*<Route path="/admin" component={Admin} />*/}
        <Route path="/management" component={AdminSignIn} />
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/account" component={Account} />
        <PrivateRoute path="/cart" component={Cart} />
        <Route path="/request" component={Request} />
        <Route path="/receipt" component={Receipt} />
        <PrivateRoute path="/notifications" component={Notifications} />
        <PrivateRoute path="/inbox" component={Inbox} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </HashRouter>
  );
}

export default App;
