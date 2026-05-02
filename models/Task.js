const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    default: "todo",
  },
  priority: {
    type: String,
    default: "medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Task", taskSchema);
