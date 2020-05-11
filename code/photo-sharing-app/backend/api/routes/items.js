const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Items = require("../models/Items");
const ItemsController = require("../controllers/itemsController");
const itemController = new ItemsController(Items);
//const authorization = require("../middlewares/authorization");
const passport = require("passport");
let authorizedUser = {};
router.get("/", (req, res, next) => {
  itemController.getAll((error, result) => {
    handleCallBack(error, result, res);
  });
});

router.post("/", (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err, authorizedUser, info) => {
      console.log(authorizedUser);
      itemController.create(authorizedUser._id, req.body, (error, result) => {
        handleCallBack(error, result, res);
      });
    }
  )(req, res, next);
});

router.get("/byOwner", (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err, authorizedUser, info) => {
      itemController.getBySeller(authorizedUser._id, (error, result) => {
        handleCallBack(error, result, res);
      });
    }
  )(req, res, next);
});

router.get("/getByWishListedBy", (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err, authorizedUser, info) => {
      itemController.getByWishListedBy(authorizedUser._id, (error, result) => {
        handleCallBack(error, result, res);
      });
    }
  )(req, res, next);
});

router.get("/:id", (req, res, next) => {
  itemController.find(req.params.id, (error, result) => {
    handleCallBack(error, result, res);
  });
});

router.put("/wishlist/:id", (req, res, next) => {
  console.log("wishlist");
  itemController.updateByOthers(req.params.id, req.body, (error, result) => {
    handleCallBack(error, result, res);
  });
});

router.patch("/:id", (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err, authorizedUser, info) => {
      itemController.updateBySeller(
        authorizedUser._id,
        req.params.id,
        req.body,
        (error, result) => {
          handleCallBack(error, result, res);
        }
      );
    }
  )(req, res, next);
});

router.delete("/:id", (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err, authorizedUser, role) => {
      if (role === "user") {
        itemController.userDelete(
          { id: req.params.id, userId: authorizedUser._id },
          (error, result) => {
            handleCallBack(error, result, res);
          }
        );
      } else if (role === "admin") {
        itemController.delete(req.params.id, (error, result) => {
          handleCallBack(error, result, res);
        });
      }
    }
  )(req, res, next);
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
