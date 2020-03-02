const router = require('express').Router();
const Schedule = require("../models/schedule")
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

////make everything async?
//make a new schedule
router.post('/upload', authCheck, async (req, res) => {
    const schedule = new Schedule ({
        ...req.body,
        owner: req.user._id
    })
    try{
        await schedule.save();
        res.send(schedule)
        console.log('Sent SCHEDULE')
    } catch(err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;