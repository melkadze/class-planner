const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  
  owner: {
    type: mongoose.Schema.Types.ObjectId
  }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;