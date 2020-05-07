const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20")
const User = require("../models/user")
require("dotenv").config()

//encode user info
passport.serializeUser((user, done) => {
	done(null, user.id)
})

//decode user info
passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user)
	})
})

//oauth
passport.use(
	new GoogleStrategy({
		callbackURL: "/auth/google/redirect",
		clientID: process.env.oAuthID,
		clientSecret: process.env.oAuthSecret
	}, (accessToken, refreshToken, profile, done) => {
		//check if user already exists
		User.findOne({googleID: profile.id}).then((currentUser) => {
			if (currentUser) {
				//already have the user
				done(null, currentUser)
			} else {
				//if not, create new user
				new User({
					username: profile.displayName,
					googleID: profile.id,
					email: profile.emails[0].value,
					thumbnailURL: profile.photos[0].value
				}).save().then((newUser) => {
					done(null, newUser)
				})
			}
		})
	})
)