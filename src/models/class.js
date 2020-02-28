const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  period: {
    type: Number,
    required: true
  },
  name: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isLength(value, {
            min: 1,
            max: 32
        })) {
          throw new Error("Class name cannot exceed 32 characters");
        }
      }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule"
  }
});

const Class = mongoose.model("Class", classSchema);
module.exports = Class;