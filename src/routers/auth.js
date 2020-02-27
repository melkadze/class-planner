const router = require('express').Router();
const passport = require('passport');

//auth login
router.get('/login', (req, res) => {
    res.render('login')
})

//auth logout
router.get('/logout', (req, res) => {
    //handle with passport
    res.send('logging out...')
})

//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

//callback for redirecting
router.get('/google/redirect', (req, res) => {
    res.send('you have reached the cb uri')
})

module.exports = router;