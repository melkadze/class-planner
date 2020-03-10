const mongoose = require("mongoose");
const validator = require("validator");

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

scheduleSchema.virtual("course", {
  ref: "Course",
  localField: "_id",
  foreignField: "owner"
})

//force schedule names to be unique per user, but not per db
scheduleSchema.index(
  {owner: 1, name: 1}, {unique: true}
)

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;