const mongoose = require("mongoose");
const env = require("../env")

mongoose.connect(
  `mongodb+srv://application_master:${env.mongoosePassword}@primary-qvy3u.mongodb.net
  /test?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  }
);