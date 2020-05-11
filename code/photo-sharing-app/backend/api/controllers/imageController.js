const Controller = require("./controller");
const ObjectId = require("mongoose").Types.ObjectId;
const AWS = require("aws-sdk");
const { config } = require("../config/env");

class ImageController extends Controller {
  s3 = new AWS.S3({
    accessKeyId: config.AWSAccessKeyId,
    secretAccessKey: config.AWSSecretAccessKey,
    region: config.AWSRegion
  });

  create(files, callback) {
    this.createRecursive(0, files, [], callback);
  }

  createRecursive(index, files, results, callback) {
    if (index == files.length) return callback(null, results);
    const file = files[index];
    const date = new Date();
    const params = {
      Bucket: config.AWSBucketName + "/image",
      Key: date.getTime() + "_" + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read-write"
    };
    this.s3.upload(params, (err, data) => {
      if (err) return callback({ error: true, messsage: err, status: 404 });
      results.push(data);
      return this.createRecursive(++index, files, results, callback);
    });
  }

  delete(items, callback) {
    if (!Array.isArray(items)) items = [items];
    this.deleteRecursive(0, items, [], callback);
  }

  deleteRecursive(index, items, results, callback) {
    console.log("********* S3 delete *******");
    if (index == items.length) return callback(null, results);
    const params = {
      Bucket: config.AWSBucketName + "/image",
      Key: items[index].replace("image/", "")
    };
    this.s3.deleteObject(params, (err, data) => {
      console.log(err);
      console.log(data);
      console.log("********* END ***********");
      if (data) results.push(data);
      return this.deleteRecursive(++index, items, results, callback);
    });
  }
}

module.exports = ImageController;
