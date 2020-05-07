///visit this project at github.com/melkadze/class-planner

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
require('./config/passport-setup')
require('dotenv').config();

//setup cookies for login storage
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, //one day, in ms
  keys: [process.env.cookieKey]
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
const dayRouter = require('./routers/day')
const taskRouter = require('./routers/task')
const eventRouter = require('./routers/event')
const feedbackRouter = require('./routers/feedback')

//router setup
app.use('/', rootRouter)
app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/schedule', scheduleRouter)
app.use('/schedule/period', periodRouter)
app.use('/course', courseRouter)
app.use('/day', dayRouter)
app.use('/task', taskRouter)
app.use('/event', eventRouter)
app.use('/feedback', feedbackRouter)

//finally, open the server
app.listen(process.env.PORT, () => {
  console.log(`Server up on port ${process.env.PORT}...`);
});