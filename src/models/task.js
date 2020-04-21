const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  active: { //active: denotes if item should be shown to user [set to 1 when creating, 0 when expired]
    type: Boolean,
    required: true
  },
  completed: { //completed: denotes if item is checked/relevant [set to 0 when creating, 1 when completed]
    type: Boolean,
    required: true
  },
  course: { //relevant course, is user-definable and is only for display purposes
    type: String
  },
  dueDate: { //not required, only if timed event
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;