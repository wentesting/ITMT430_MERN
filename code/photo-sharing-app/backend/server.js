require("dotenv").config();
const fs = require("fs");
const https = require("https");
const app = require("./app.js");
const { config } = require("./api/config/env");

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert"),
    },
    app
  )
  .listen(
    process.argv[2] || config.PORT || 3000,
    process.env.SERVER_IP,
    function () {
      console.log(
        `Example app listening on port 3007! Go to https://${process.env.SERVER_IP}:${config.PORT}/`
      );
    }
  );
