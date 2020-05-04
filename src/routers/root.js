const router = require('express').Router();
const functions = require('../config/functions')

//homepage
router.get('/', (req, res) => {
    try{
        res.redirect('/profile/dashboard');
    } catch(err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;