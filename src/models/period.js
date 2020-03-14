const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema({
  //add timestart, timeend
  period: {
    type: Number,
    required: true
  },
  timeStart: {
    //type: [[moment js type]]
    type: Number
  },
  timeEnd: {
    //type: [[moment js type]]
    type: Number
  },
  //workaround for virtuals
  forSchedule: {
      type: String,
      required: true,
      trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true
  }
});

//force periods to be unique per schedule, but not per db
periodSchema.index(
  {period: 1, owner: 1}, {unique: true}
)

const Period = mongoose.model("Period", periodSchema);
Period.ensureIndexes(); //makes sure compound indexes are applied
module.exports = Period;