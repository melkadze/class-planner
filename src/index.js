//import * as sampledb from "./sampledb.json"
const moment = require('moment')

const express = require("express");
require("./db/mongoose"); //ensures mongoose runs and connects to our database
const app = express();
const movieRouter = require("./routers/movies");
const userRouter = require("./routers/user");
const reviewRouter = require("./routers/review");
app.use(express.json());
app.use(movieRouter);
app.use(userRouter);
app.use(reviewRouter);

app.listen(3000, () => {
  console.log("Server up on 3000");
});

//bcrypt hashing will occur as middleware during requests

/* const bcrypt = require("bcryptjs");
const testFunction = async () => {
  const password = "obeysudo";
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(password);
  console.log(hashedPassword);

  const isMatch = await bcrypt.compare("obeysudo", hashedPassword);
  console.log(isMatch);
};

testFunction(); */

/* const jwt = require("jsonwebtoken");

const testFunction = async () => {
  const token = jwt.sign({ _id: "5e1f3f813f07551900b85ea5" }, "obeysudo", {
    expiresIn: "7 days"
  });
  console.log(token);
  const data = jwt.verify(token, "obeysudo");
  console.log(data);
};

testFunction(); */

/*
const Review = require("./models/review");
const User = require("./models/user");

const main = async() => {
  const user = await User.findById("5e1f407d6fb8e37a3cdc391f");
  await user.populate("reviews").execPopulate();
  console.log(user.reviews);
}

main();
*/


/*
function howLongUntil() {
  const currentTime = moment().format("H:mm")
} 

let i = 6
i--
console.log(Number((sampledb.sample[i].period)))
console.log((sampledb.sample[i].name))
*/