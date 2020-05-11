const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Request = require("../models/Requests");
const Controller = require("../controllers/controller");
const RequestController = new Controller(Request);

router.get("/", (req, res, next) => {
  RequestController.getAll((error, result) => {
    handleCallBack(error, result, res);
  });
});

router.post("/", (req, res, next) => {
  RequestController.create(req.body, (error, result) => {
    handleCallBack(error, result, res);
  });
});

router.get("/:id", (req, res, next) => {
  RequestController.find(req.params.id, (error, result) => {
    handleCallBack(error, result, res);
  });
});

router.patch("/:id", (req, res, next) => {
  RequestController.update(req.params.id, req.body, (error, result) => {
    handleCallBack(error, result, res);
  });
});
router.delete("/:id", (req, res, next) => {
  RequestController.delete(req.params.id, (error, result) => {
    handleCallBack(error, result, res);
  });
});

let handleCallBack = (error, result, response) => {
  console.log("error" + JSON.stringify(error));
  //console.log("result" + JSON.stringify(result));

  if (error) {
    if (typeof error == "object" && error.status)
      return response.status(error.status).json({ error: error });
    return response.status(500).json({ error: error });
  }
  return response.status(200).json({ data: result });
};

module.exports = router;
