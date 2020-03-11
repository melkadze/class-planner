const router = require('express').Router();
const Period = require("../models/period")
const Schedule = require("../models/schedule")
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

////make everything async?
//make a new schedule
router.post('/upload', authCheck, async (req, res) => {
    const periodID = await Schedule.findOne({ name: req.body.forSchedule, owner: req.user._id });
    const period = new Period ({
        ...req.body,
        owner: periodID._id
    })
    console.log(`Sent PERIOD: ${period}`)
    try{
        await period.save();
        res.send(period)
    } catch(err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;