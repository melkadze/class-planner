const mongoose = require("mongoose");
const Movie = mongoose.model("movie", {
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  }
});

module.exports = Movie;
