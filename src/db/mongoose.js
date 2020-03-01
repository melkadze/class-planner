const mongoose = require("mongoose");
const env = require("../env")

mongoose.connect(
  env.mongooseString,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  }, () => {
    console.log('Connected to MongoDB...')
  }
);