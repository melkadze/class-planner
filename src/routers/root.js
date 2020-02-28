const router = require('express').Router();
const functions = require('../config/functions')

//homepage
router.get('/', (req, res) => {
    try{
        res.render('home', {user: req.user});
    } catch(err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;