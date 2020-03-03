const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      try {
        
      } catch (err) {

      }



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