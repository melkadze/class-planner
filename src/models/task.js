const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dueDate: {

  },
  subject: { //maybe dropdown, maybe not (like Calc, CS, etc..)
      type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;