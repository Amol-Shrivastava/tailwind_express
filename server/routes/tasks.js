const {
  createTask,
  findTasks,
  updateTask,
  deleteTasks,
  findAllTasks,
  searchTask,
  loadMoreTasks,
} = require("../middlewares/tasks");

const router = require("express").Router();

router
  .get("/", findAllTasks)
  .get("/loadMore", loadMoreTasks)
  .post("/create", createTask)
  .get("/search/:query", searchTask)
  .get("/:value/:userId", findTasks)
  .patch("/update/:id", updateTask)
  .delete("/delete/:id", deleteTasks);

module.exports = router;
