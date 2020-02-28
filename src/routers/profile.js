const router = require('express').Router();

//move this to middleware
const authCheck = (req, res, next) => {
    if(!req.user) {
        //executes if user not logged in
        res.redirect('/auth/login');
    } else {
        next();
    }
}


router.get('/', authCheck, (req, res) => {
    try{
        res.render('profile', {user: req.user});
    } catch(err) {
        //unnecessary now, since we have authCheck
        res.send(`seems you aren't logged in, full error is: ${err}`)
    }
})

module.exports = router;