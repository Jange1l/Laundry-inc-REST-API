const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({ 
    sender: { 
        type: String,
        required: true
    },
    payLoad: { 
        type: String,
        required: true
    },
    user: {
        type: String,
    },
    _id: {
        type: String
    }
    
});

module.exports = mongoose.model('Message', messageSchema)