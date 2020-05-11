const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    itemID: {
      type: Array,
      required: false
    }
  },
  {
    timestamps: true
  }
);
module.exports = User = mongoose.model("usersTable", UserSchema);
