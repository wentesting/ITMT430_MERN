const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("../config/env");
const validateRegister = require("../../validation/adminRegister");
const validateLogin = require("../../validation/adminLogin");
const Admin = require("../models/Admin");
const Controller = require("../controllers/controller");
const AdminController = new Controller(Admin);

router.post("/register", (req, res, next) => {
  const { errors, isValid } = validateRegister(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const accessCode = Math.random().toString(15).substring(2, 8);
  if (req.body.registerCode === "Gd+CsYxn8_PE") {
    Admin.findOne({ email: req.body.email }).then((admin) => {
      if (admin) {
        return admin.status(400).json({ email: "Email already exist" });
      } else {
        const newAdmin = new Admin({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          accessCode: accessCode,
          //itemID: req.body.itemID
        });

        //hash password
        bcrypt.genSalt(15, (err, salt) => {
          bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin
              .save()
              .then((admin) => res.json(admin))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  } else {
    return res.status(400).json({
      error: "Invalid Register Code",
    });
  }
});

router.post("/login", (req, res, next) => {
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  const accessCode = req.body.accessCode;

  Admin.findOne({ email }).then((admin) => {
    if (!admin) {
      return res.status(404).json({ error: "user not found" });
    }

    if (accessCode === admin.accessCode) {
      bcrypt.compare(password, admin.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: admin._id,
            name: admin.name,
            role: "admin",
          };
          jwt.sign(
            payload,
            config.secretKey,
            {
              expiresIn: 900,
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          return res.status(400).json({
            error: "User not found",
          });
        }
      });
    } else {
      return res.status(400).json({
        error: "User not found",
      });
    }
  });
});

let handleCallBack = (error, result, response) => {
  console.log("error: " + JSON.stringify(error));
  //console.log("result: " + JSON.stringify(result));

  if (error) return response.status(500).json({ error: error });
  return response.status(200).json({ data: result });
};

module.exports = router;
