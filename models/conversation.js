const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const conversationSchema = new mongoose.Schema({
    conversationName: { 
        type: String,
        required: true
    },
    messages: [{
        type: Schema.Types.Mixed
    }]
});

module.exports = mongoose.model('Conversation', conversationSchema)