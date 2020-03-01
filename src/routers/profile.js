const router = require('express').Router();
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

//profile
router.get('/', authCheck, (req, res) => {
    try{
        res.render('profile', {user: req.user});
    } catch(err) {
        functions.error(res, 500, err);
    }
})

//upload a class
/*
router.post('/class', authCheck, (req, res) => {
    try{
        
    } catch(err) {
        functions.error(res, 500, err);
    }
})
*/

module.exports = router;