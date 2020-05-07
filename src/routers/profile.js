const router = require('express').Router();
const User = require("../models/user")
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

router.get('/settings', authCheck, (req, res) => {
    try{
        res.render('settings', {user: req.user});
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

router.get('/courses', authCheck, (req, res) => {
    try{
        res.render('courses', {user: req.user});
    } catch(err) {
        functions.error(res, 500, err);
    }
})

router.delete('/delete/deletemyaccount/confirm', authCheck, async (req, res) => {
    try {
        await User.deleteOne({ _id: req.user._id })
        res.status(200).send('OK')
    } catch (err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;