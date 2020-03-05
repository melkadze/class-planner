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
      //check if the reference system with %s is maintained (userID%className)
      //this must be done as we need names to be unique per owner, but not globally
      if (validator.contains(value, "%")) {
        valueSplitArray = value.split("%")
        if (valueSplitArray.length !== 2) {
          throw new Error(`Reference system error; did you have a number of "%"s =/= 1?`);
        }
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