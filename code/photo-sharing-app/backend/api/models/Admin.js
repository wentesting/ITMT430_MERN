const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const AdminsSchema = new Schema(
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
    accessCode: { type: String, required: true }
  },
  {
    timestamps: true
  }
);
module.exports = Admin = mongoose.model("AdminsTable", AdminsSchema);
