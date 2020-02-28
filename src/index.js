//import * as sampledb from "./sampledb.json"

const express = require("express");
require("./db/mongoose"); //ensures mongoose runs and connects to our database
const app = express();
const path = require('path')

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

const passportSetup = require('./config/passport-setup')
const passport = require('passport')

const cookieSession = require('cookie-session')
const env = require('./env')

const movieRouter = require("./routers/movies");
const userRouter = require("./routers/user");
const reviewRouter = require("./routers/review");
app.use(express.json());
app.use(movieRouter);
app.use(userRouter);
app.use(reviewRouter);

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, //in ms
  keys: [env.cookieKey]
}))

// init passport
app.use(passport.initialize());
app.use(passport.session());

//const moment = require('moment')

app.listen(3000, () => {
  console.log("Server up on 3000");
});

const authRouter = require('./routers/auth')
app.use('/auth', authRouter)
const profileRouter = require('./routers/profile')
app.use('/profile', profileRouter)

//put this in routes later
app.get('/', (req, res) => {
  res.render('home', {user: req.user});
})

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