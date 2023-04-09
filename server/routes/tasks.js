const {
  createTask,
  findTasks,
  updateTask,
  deleteTasks,
  findAllTasks,
} = require("../middlewares/tasks");

const router = require("express").Router();

router
  .get("/", findAllTasks)
  .post("/create", createTask)
  .get("/:value/:userId", findTasks)
  .patch("update/:id", updateTask)
  .delete("delete/:id", deleteTasks);

module.exports = router;
