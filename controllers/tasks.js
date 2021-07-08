const { validationResult } = require("express-validator/check");

const Task = require("../models/task");
const Conversation = require("../models/conversation");
const User = require("../models/user");

const path = require("path");

exports.getTasks = (req, res, next) => {
  Task.find()
    .then((tasks) => {
      res.status(200).json({
        message: "Fecthed tasks successfully.",
        tasks: tasks,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getStaffTasks = (req, res, next) => {
  const staffName = req.params.staffName.split(":")[1];
  console.log(staffName);

  Task.find({
    staffName: staffName,
  })
    .then((result) => {
      res.status(201).json({
        message: "Tasks fetched succesfully",
        tasks: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.createTask = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const taskName = req.body.taskName;
  const staffName = req.body.staffName;
  const staffEmail = req.body.staffEmail;
  const status = req.body.status;
  const staffId = req.body.staffId;
  const taskDescription = req.body.taskDescription;
  const category = req.body.category;

  const conversation = new Conversation({
    conversationName: taskName,
  });

  const task = new Task({
    taskName: taskName,
    messagesId: conversation._id,
    staffName: staffName,
    staffEmail: staffEmail,
    taskDescription: taskDescription,
    status: status,
    category: category,
  });

  task
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Task created successfully!",
        task: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  conversation
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Conversation created successfully!",
        conversation: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  User.findById(staffId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        error.statusCode = 404;
        // Throwing  an  error in the then block is  okay because this is caught by the  catch block after.
        throw error;
      }

      user.tasks.push(task._id);

      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "User Updates!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTaskConversation = (req, res, next) => {
  const conversationId = req.params.taskViewId.split(":")[1];

  Conversation.findById(conversationId)
    .then((conversation) => {
      if (!conversation) {
        const error = new Error("Could not find conversation.");
        error.statusCode = 404;
        // Throwing  an  error in the then block is  okay because this is caught by the  catch block after.
        throw error;
      }
      res
        .status(200)
        .json({ message: "Conversation fetched.", conversation: conversation });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTask = (req, res, next) => {
  const taskViewId = req.params.taskDetailsId.split(":")[2];

  Task.findById(taskViewId)
    .then((task) => {
      if (!task) {
        const error = new Error("Could not find task.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Task Details fetched", task: task });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postMessage = (req, res, next) => {
  const taskViewId = req.params.taskViewId.split(":")[1];

  const message = {
    text: req.body.text,
    createdAt: req.body.createdAt,
    _id: req.body._id,
    user: { _id: req.body.user._id, name: req.body.user.name },
  };

  Conversation.findById(taskViewId)
    .then((conversation) => {
      if (!conversation) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      conversation.messages.push(message);
      return conversation.save();
    })
    .then((result) => {
      res.status(200).json({ msg: "Message posted", message: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.completeTask = (req, res, next) => {
  const taskViewId = req.params.taskViewId.split(":")[1];
  console.log(taskViewId)

  Task.findById(taskViewId)
    .then((task) => {
      if (!task) {
        const error = new Error("Could not find task.");
        error.statusCode = 404;
        throw error;
      }
      task.status = "Completed";
      return task.save();
    })
    .then((result) => {
      res.status(200).json({ msg: "Task status updated", task: result });
      
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
