const express = require('express');
const  {body}  = require('express-validator/check');
const user = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [ 
    body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => { 
        return user.findOne({email: value}).then(userDoc => { 
            if (userDoc) { 
                return Promise.reject('E-mail address already exists!');
            }
        })
    })
    .normalizeEmail(),
    body('password').trim().isLength({ min: 5}),
    body('firstName')
.trim().not().isEmpty()
], authController.signup);

router.post('/login', authController.postLogin);

router.get('/staffUser/:staffId', authController.getStaffUser);


module.exports = router;