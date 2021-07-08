const express = require("express");
const { body } = require("express-validator/check");

const taskController = require("../controllers/tasks");

const router = express.Router();

router.get("/tasks", taskController.getTasks);

router.get("/staffTasks/:staffName", taskController.getStaffTasks);

router.get("/taskDetails/:taskDetailsId", taskController.getTask);

router.post("/task", taskController.createTask);

router.get("/taskConversation/:taskViewId", taskController.getTaskConversation);

router.post("/taskConversation/:taskViewId", taskController.postMessage);

router.post('/completeTask/:taskViewId', taskController.completeTask)

module.exports = router;

