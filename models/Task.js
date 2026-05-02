const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,
    status: {
      type: String,
      default: "todo",
    },
    priority: {
      type: String,
      default: "medium",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
