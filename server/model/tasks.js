const { mongoose, Schema } = require("mongoose");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title cannot be blank"],
    },
    description: {
      type: String,
      required: [true, "Task Description cannot be blank"],
    },
    completionDate: {
      type: Date,
      required: [true, "Please provide completion date"],
    },
    status: {
      type: String,
      enum: {
        values: ["OPEN", "WIP", "CLOSED", "TIME'S UP"],
        message: "{VALUE} is not supported",
        default: "OPEN",
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tasks", taskSchema);
