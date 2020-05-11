const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

class Controller {
  constructor(DBModel = null) {
    this.DBModel = DBModel;
  }

  create(data, callback) {
    this.DBModel.create(data, (err, res) => callback(err, res));
  }

  getAll(callback) {
    this.DBModel.find({}, (err, res) => callback(err, res));
  }

  getByQuery(query, callback) {
    this.DBModel.find(query, (err, res) => callback(err, res));
  }

  find(id, callback) {
    this.DBModel.findOne({ _id: ObjectId(id) }, (err, res) =>
      callback(err, res)
    );
  }

  findByQuery(query, callback) {
    this.DBModel.findOne(query, (err, res) => callback(err, res));
  }

  update(id, data, callback) {
    this.DBModel.update({ _id: ObjectId(id) }, { $set: data }, (err, res) =>
      callback(err, res)
    );
  }

  delete(id, callback) {
    this.DBModel.deleteOne({ _id: ObjectId(id) }, (err, res) =>
      callback(err, res)
    );
  }

  deleteOneByQuery(query, callback) {
    this.DBModel.deleteOne(query, (err, res) => callback(err, res));
  }

  deleteMultipleByQuery(query, callback) {
    this.DBModel.delete(query, (err, res) => callback(err, res));
  }
}

module.exports = Controller;
