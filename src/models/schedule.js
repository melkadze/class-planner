const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId
  }
});

scheduleSchema.virtual("course", {
  ref: "Course",
  localField: "_id",
  foreignField: "owner"
})

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;