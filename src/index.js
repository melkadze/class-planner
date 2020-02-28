//visit this project at github.com/melkadze/class-planner

//framework dependencies
const express = require("express");
const path = require('path')
const app = express();
require("./db/mongoose"); //ensures mongoose runs

//framework setup
app.set('views', path.join(__dirname, './views')); //redefine views path
app.set('view engine', 'ejs'); //use ejs
app.use(express.json());

//other dependencies
const passport = require('passport')
const cookieSession = require('cookie-session')
const passportSetup = require('./config/passport-setup') //this is necessary
const env = require('./env')
//import * as sampledb from "./sampledb.json"

//setup cookies for login storage
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, //one day, in ms
  keys: [env.cookieKey]
}))

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//router dependencies
const authRouter = require('./routers/auth')
const profileRouter = require('./routers/profile')

//router setup
app.use('/auth', authRouter)
app.use('/profile', profileRouter)

//put this in routes later
app.get('/', (req, res) => {
  res.render('home', {user: req.user});
})

//finally, open the server
app.listen(3000, () => {
  console.log("Server up on 3000");
});