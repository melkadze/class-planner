const router = require('express').Router();
const passport = require('passport');
///make all new routes have try catches


//auth login
router.get('/login', (req, res) => {
    res.render('login', {user: req.user})
})

//auth logout
router.get('/logout', (req, res) => {
    //handle with passport
    try{
        req.logout();
        res.redirect('/')
    } catch(err) {
        res.send(err)
    }
})

//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

//callback for redirecting
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    //res.send(req.user)
    res.redirect('/profile')
})

module.exports = router;
