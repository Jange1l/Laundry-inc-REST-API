const { validationResult } = require("express-validator/check");

const User = require("../models/user");

const path = require("path");

const fs = require("fs");

exports.getUsers = (req, res, next) => {
    console.log("users fethced")
  User.find()
    .then((users) => {
      res.status(200).json({
        message: "Fetched users succesfully",
        users: users,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusode = 500;
      }
      next(err);
    });
};

exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId.split(":")[1];

  console.log(userId);

  User.deleteOne({
    _id: userId,
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusode = 500;
      }
      next(err);
    });
};
