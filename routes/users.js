const express = require('express');
const  {body}  = require('express-validator/check');
const user = require('../models/user');
const userController = require('../controllers/users');

const router = express.Router();


router.get('/usersList', userController.getUsers);

router.post("/deleteStaff/:userId", userController.deleteUser);

module.exports = router;