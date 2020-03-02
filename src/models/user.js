const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  googleID: {
    type: String
  },
  email: {
    type: String
  },
  //consider storing the image remotely
  thumbnailURL: {
    type: String
  }
},
{
  timestamps: true
});

userSchema.virtual("schedule", {
  ref: "Schedule",
  localField: "_id",
  foreignField: "owner"
})

const User = mongoose.model("User", userSchema);
module.exports = User;