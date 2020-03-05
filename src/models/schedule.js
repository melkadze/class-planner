const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      //check if name is above 32 char
      if (
        !validator.isLength(value, {
          min: 1,
          max: 32
        })
      ) {
        throw new Error("Class name cannot exceed 32 characters");
      }
      //check if the reference system with +s is maintained (just one +)
      if (validator.contains(value, "+")) {
        valueSplitArray = value.split("+")
        if (valueSplitArray.length !== 2) {
          throw new Error("Class name cannot exceed 32 characters");
        }
      } else {
        console.log("false")
      }
    }
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