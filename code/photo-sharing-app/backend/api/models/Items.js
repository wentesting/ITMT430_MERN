const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create item schema

const ItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: [String],
      required: false,
    },
    sellerID: {
      type: String,
      required: true,
    },
    buyerID: {
      type: String,
      required: false,
    },
    requestID: {
      type: [String],
      required: false,
    },
    wishlistedBy: {
      type: [String],
      required: false,
    },
    photoKey: {
      type: String,
      require: false,
    },
    deniedID: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);
/*
const ItemSchema = new Schema(
  {
    id: idToBeAdded,
      name: label,
      status: status,
      category: category,
      price: parseInt(price),
      location: location,
      description: description
  },
  { timestamps: true }
);*/

module.exports = mongoose.model("ItemTable", ItemSchema);
