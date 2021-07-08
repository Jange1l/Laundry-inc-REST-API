const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({ 
    email: { 
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    firstName: { 
        type: String,
        required: true
    },
    lastName: { 
        type: String,
        required: true
    },
    userType: { 
        type: String,
        required: true
    },
    tasks: [
        {
        type: String,
        }
    ]
});

module.exports = mongoose.model('User', userSchema)