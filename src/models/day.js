const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  day: {
    type: Number, //0 = monday, 1 = tuesday, etc
    required: true
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

daySchema.virtual("course", {
  ref: "Course",
  localField: "_id",
  foreignField: "owner"
})

//force day names to be unique per user, but not per db
daySchema.index(
  {day: 1, owner: 1}, {unique: true}
)

const Day = mongoose.model("Day", daySchema);
Day.ensureIndexes(); //makes sure compound indexes are applied
module.exports = Day;