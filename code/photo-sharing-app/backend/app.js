const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { config } = require("./api/config/env");
const itemRoutes = require("./api/routes/items");
const requestRoutes = require("./api/routes/Request");
const userRoutes = require("./api/routes/User");
const imageRoutes = require("./api/routes/Image");
const adminRoutes = require("./api/routes/Admin");
const passport = require("passport");
const createAdmin = require("./scripts/RegisterAdmin");
const createUsers = require("./scripts/RegisterUsers");
var cors = require("cors");

createAdmin.createAdmin();
createUsers.createUsers();
mongoose.connect(config.DB_LOCAL_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let db = mongoose.connection;
db.once("open", () => console.log("connected to database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Build

// Declare static folder to be served. It contains the js, images, css, etc.
app.use(express.static(path.join(__dirname, "build")));
/*
app.get("*", function (req, res) {
  //console.log(path.join(__dirname, "build", "index.html"));
  res.sendFile(path.join(__dirname, "/build/index.html"));
  //__dirname : It will resolve to your project folder.
});*/

//Passport middleware

app.use(passport.initialize());

//Password config
require("./api/config/passport")(passport);

app.use("/users", userRoutes);
app.use("/admin", adminRoutes);

/***********  GOOGLE AUTHENTICATION    ********/
/*
const request = require("request");
const querystring = require("querystring");

app.get("/token", (req, res) => {
  request(
    {
      method: "POST",
      url: "https://oauth2.googleapis.com/token",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: config.gg_client_id,
        grant_type: "refresh_token",
        refresh_token: config.gg_refresh_token,
        client_secret: config.gg_client_secret,
      }),
    },
    function (error, response, body) {
      console.log(error);
      console.log(body);
      if (error) return res.status(error.status || 500, { error: error });
      return res.status(200).json({ data: body });
      res.end();
    }
  );
});

app.get("/authenticate", (req, res) => {
  console.log(req.query);
  const code = req.query.code;
  request(
    {
      method: "POST",
      url: "https://oauth2.googleapis.com/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: querystring.stringify({
        client_id: config.gg_client_id,
        redirect_uri: "http://localhost:3007/authenticate",
        grant_type: "authorization_code",
        code: code,
        client_secret: config.gg_client_secret,
      }),
    },
    function (error, response, body) {
      console.log(error);
      console.log(body);
      if (error) return res.status(error.status || 500, { error: error });
      return res.status(200).json({ data: body });
      res.end();
    }
  );
});

app.get("/account", (req, res) => {
  let body = querystring.stringify({
    client_id: config.gg_client_id,
    redirect_uri: "http://localhost:3007/authenticate",
    response_type: "code",
    scope: "https://www.googleapis.com/auth/photoslibrary.sharing",
    access_type: "offline",
    include_granted_scopes: true,
    prompt: "consent",
  });
  res.redirect("https://accounts.google.com/o/oauth2/auth?" + body);
});
*/
/***************************************** */

app.use("/items", itemRoutes);
app.use("/requests", requestRoutes);
app.use("/items/upload", imageRoutes);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
