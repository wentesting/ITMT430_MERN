const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const { config } = require("../config/env");
const fs = require("fs");
const ImageController = require("../controllers/imageController");
const controller = new ImageController();

const s3 = new AWS.S3({
  accessKeyId: config.AWSAccessKeyId,
  secretAccessKey: config.AWSSecretAccessKey,
  region: config.AWSRegion,
});

const router = new express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 52528000 },
});

router.post("/", upload.array("files"), (req, res) => {
  controller.create(req.files, (err, result) =>
    handleCallBack(err, result, res)
  );
});

router.delete("/:id", (req, res) => {
  //
  var params = {
    Bucket: config.AWSBucketName + "/image" /*, Key: key of object*/,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send({
        status: "200",
        response: "success",
      });
    }
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
