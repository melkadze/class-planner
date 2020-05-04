const router = require('express').Router();
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

//profile
router.get('/', authCheck, (req, res) => {
    try{
        res.redirect('/profile/dashboard');
    } catch(err) {
        functions.error(res, 500, err);
    }
})

router.get('/internals', authCheck, (req, res) => {
    try{
        res.render('internals', {user: req.user});
    } catch(err) {
        functions.error(res, 500, err);
    }
})

router.get('/dashboard', authCheck, (req, res) => {
    try{
        res.render('dashboard', {user: req.user});
    } catch(err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;

