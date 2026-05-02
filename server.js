require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Task = require("./models/Task");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Routes

// GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({
      order: 1,
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// CREATE task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task({
      title: req.body.text,
      status: req.body.status || "todo",
      priority: req.body.priority || "medium",
      order: Date.now(),
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// UPDATE task
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        status: req.body.status,
        priority: req.body.priority,
      },
      { new: true },
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

// Reorder tasks
app.put("/tasks/reorder", async (req, res) => {
  try {
    const updates = req.body;

    const bulkOps = updates.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Task.bulkWrite(bulkOps);
    res.json({ message: "order updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
