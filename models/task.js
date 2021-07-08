const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  messagesId: {
    type: String,
  },
  staffName: {
    type: String,
  },
  staffEmail: { 
      type: String
  },
  taskDescription: { 
      type: String
  },
  status: { 
      type: String,
      required: true
  },
  category: {
    type: String
  }
});

module.exports = mongoose.model("Task", taskSchema);
