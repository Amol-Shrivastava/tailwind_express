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
      const tasksArr = await Tasks.find({ userId }).sort({ createdAt: -1 });
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

const convertToClosed = async () => {
  return await Tasks.updateMany(
    {
      status: { $ne: "CLOSED" },
      createdAt: { $lte: Date.now() },
    },
    { status: "TIME'S UP" }
  );
};

module.exports = {
  createTask,
  findAllTasks,
  updateTask,
  findTasks,
  deleteTasks,
  convertToClosed,
};
