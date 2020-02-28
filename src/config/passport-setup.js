//below is testing for passport

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const env = require('../env')
const User = require('../models/user')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new GoogleStrategy({
    //options for google strat
    callbackURL: '/auth/google/redirect',
    clientID: env.oAuthID,
    clientSecret: env.oAuthSecret
  }, (accessToken, refreshToken, profile, done) => {
    //passport callback funct
    //console.log('passport callback worked')
    //console.log(profile)
    //console.log('EEEEEE')
    //console.log(email.emails[0].value)

    //check if user already exists
    User.findOne({googleID: profile.id}).then((currentUser) => {
      if (currentUser) {
        //already have the user
        console.log(`User is ${currentUser}`)
        done(null, currentUser)
      } else {
        //if not, create new user
        new User({
          username: profile.displayName,
          googleID: profile.id,
          email: profile.emails[0].value,
          thumbnailURL: profile.photos[0].value
        }).save().then((newUser) => {
          console.log(`New user created: ${newUser}`)
          done(null, newUser)
        })
      }
    })
  })
)
