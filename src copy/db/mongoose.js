const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://admin:brianjiang@cluster0-6cpgv.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  }
);
