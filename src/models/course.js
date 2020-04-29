const mongoose = require("mongoose")
const validator = require("validator")

const courseSchema = new mongoose.Schema({
  period: {
    type: Number,
    required: true
  },
  name: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isLength(value, {
            min: 1,
            max: 32
        })) {
          throw new Error("Course name cannot exceed 32 characters");
        }
      }
  },
  //workaround for virtuals
  forDay: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Day",
    required: true
  }
});

courseSchema.index(
  {period: 1, owner: 1}, {unique: true}
)

const Course = mongoose.model("Course", courseSchema);
Course.ensureIndexes(); //makes sure compound indexes are applied
module.exports = Course;