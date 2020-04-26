const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  course: { //relevant course, is user-definable and is only for display purposes
    type: String
  },
  dueDate: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;