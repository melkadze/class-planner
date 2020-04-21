const mongoose = require("mongoose");
require('dotenv').config()

mongoose.connect(
  process.env.mongooseString,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  }, () => {
    console.log('Connected to MongoDB...')
  }
);