///visit this project at github.com/melkadze/class-planner
//modules in use: cookie-session, ejs, express, mongodb, mongoose, passport, passport-google-oauth20, path, validator
//modules not in use: luxon, moment
//modules uninstalled: babel, bcryptjs, eslint, jsonwebtoken, multer

//framework dependencies
const express = require("express");
const path = require('path')
const app = express();
require("./db/mongoose"); //ensures mongoose runs

//framework setup
app.set('views', path.join(__dirname, './views')); //redefine views path
app.set('view engine', 'ejs'); //use ejs
app.use(express.json());
app.use(express.static(__dirname + "/public")); //export public folder

//other dependencies
const passport = require('passport')
const cookieSession = require('cookie-session')
const passportSetup = require('./config/passport-setup') //this is necessary, even though it is greyed out ((consider removing const, and just put require))
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
const rootRouter = require('./routers/root')
const authRouter = require('./routers/auth')
const profileRouter = require('./routers/profile')
const scheduleRouter = require('./routers/schedule')
const periodRouter = require('./routers/period')
const courseRouter = require('./routers/course')
const taskRouter = require('./routers/task')

//router setup
app.use('/', rootRouter)
app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/schedule', scheduleRouter)
app.use('/schedule/period', periodRouter)
app.use('/course', courseRouter)
app.use('/task', taskRouter)

//finally, open the server
app.listen(env.port, () => {
  console.log(`Server up on port ${env.port}...`);
});