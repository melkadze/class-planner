const mongoose = require("mongoose");
const validator = require("validator")

const courseSchema = new mongoose.Schema({
  period: {
    type: Number,
    required: true
  },
  name: {
      type: String,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isLength(value, {
            min: 1,
            max: 32
        })) {
          throw new Error("Class name cannot exceed 32 characters");
        }
      }
  },
  forSchedule: {
      type: String,
      trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule"
  }
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;