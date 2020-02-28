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
  //consider storing the image on mongo
  thumbnailURL: {
    type: String
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;