const { StatusCodes } = require("http-status-codes");
const Tasks = require("../model/tasks");

const createTask = async (req, res) => {
  let { title, description, completionDate, status } = req.body;

  const newTask = new Tasks({
    title,
    description,
    completionDate,
    status,
    userId: req.session.userId,
  });
  newTask.markModified("completionDate");

  try {
    await newTask.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: "New Task successfully created" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const findAllTasks = async (req, res) => {
  const userId = req.session.userId;
  try {
    if (userId) {
      let tasksArr = await Tasks.find({ userId }).sort("-createdAt").limit(5);
      tasksArr = convertToClosed(tasksArr);
      if (tasksArr.length > 0) {
        return res
          .status(StatusCodes.OK)
          .json({ success: true, msg: tasksArr });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          msg: `There are no tasks. Hurry up Add some tasks!!!!!!!`,
        });
      }
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: `Please login again to see the tasks list`,
      });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const findTasks = async (req, res) => {
  const { value, userId } = req.params;

  try {
    const tasksArr = await Tasks.find({
      description: `/${value}/`,
      userId,
    }).sort({
      createdAt: -1,
    });
    if (tasksArr.length > 0) {
      return res.status(StatusCodes.OK).json({ success: true, msg: tasksArr });
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "No Task found with this description." });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id: taskId } = req.params;
  const { title, description, completionDate, status } = req.body;

  try {
    const task = await Tasks.findById(taskId);
    if (!task) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "No Task found" });
    } else {
      task.title = title;
      task.description = description;
      task.status = status;
      task.completionDate = completionDate;
      task.markModified("completionDate");
      await task.save();
      return res
        .status(StatusCodes.OK)
        .json({ success: true, msg: `Task updated Successfully` });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const deleteTasks = async (req, res) => {
  const { id: taskId } = req.params;

  try {
    await Tasks.findByIdAndDelete(taskId);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Task successfully deleted" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const searchTask = async (req, res) => {
  let { query } = req.params;
  let userId = req.session.userId;

  if (query) {
    query = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    query = new RegExp(query, "gi");
  }
  try {
    let taskArr = await Tasks.find({
      $or: [{ title: query }, { description: query }],
      userId,
    })
      .sort("-createdAt")
      .limit(5);
    taskArr = [...new Set(taskArr)];
    if (taskArr && taskArr.length > 0) {
      return res.status(StatusCodes.OK).json({ success: true, msg: taskArr });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Couldn't find any tasks with the given query",
      });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const convertToClosed = async (tasksArr = null) => {
  if (!tasksArr) {
    return await Tasks.updateMany(
      {
        status: { $nin: ["CLOSED", "TIME'S UP"] },
        createdAt: { $lte: Date.now() },
      },
      { status: "TIME'S UP" }
    );
  } else {
    return tasksArr.map((el) =>
      el.completionDate < Date.now() ? { ...el, status: "TIME'S UP" } : el
    );
  }
};

const loadMoreTasks = async (req, res) => {
  const userId = req.session.userId;
  let page = parseInt(req.query.page) || 1;
  let tasksPerPage = 5;
  try {
    const tasksArr = await Tasks.find({ userId })
      .sort("-createdAt")
      .skip(page * tasksPerPage)
      .limit(tasksPerPage);
    if (tasksArr && tasksArr.length > 0) {
      return res.status(StatusCodes.OK).json({ success: true, msg: tasksArr });
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "No more to tasks to load." });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

module.exports = {
  createTask,
  findAllTasks,
  updateTask,
  findTasks,
  deleteTasks,
  searchTask,
  convertToClosed,
  loadMoreTasks,
};
