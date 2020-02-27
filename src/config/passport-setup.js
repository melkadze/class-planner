//below is testing for passport

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const env = require('../env')

passport.use(
  new GoogleStrategy({
    //options for google strat
    callbackURL: '/auth/google/redirect',
    clientID: env.oAuthID,
    clientSecret: env.oAuthPassword
  }, () => {
    //passport callback funct
  })
)