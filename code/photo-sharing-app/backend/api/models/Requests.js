const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create request schema

const RequestSchema = new Schema(
  {
    requestStatus: {
      type: String,
      require: true
    },
    buyerID: {
      type: String,
      require: true
    },
    sellerID: {
      type: String,
      require: true
    },
    itemID: {
      type: Array,
      require: true
    },
    requesterID: {
      type: String,
      require: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestTable", RequestSchema);
