const mongoose = require("mongoose");
const env = require("../env")
mongoose.connect(
  env.mongooseAuth,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  }
);
console.log(env.mongooseAuth)