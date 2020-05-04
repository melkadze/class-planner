const router = require('express').Router();
const Schedule = require("../models/schedule")
const Period = require("../models/period")
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

//make a new schedule
router.post('/upload', authCheck, async (req, res) => {
    const schedule = new Schedule ({
        ...req.body,
        owner: req.user._id
    })
    try{
        await schedule.save();
        res.send(schedule)
        console.log(`Sent SCHEDULE: ${schedule}`)
    } catch(err) {
        functions.error(res, 500, err);
    }
})

router.get('/:id', authCheck, async (req, res) => {
    const schedule = req.params.id
    try {
        await Schedule.findOne({ name: schedule, owner: req.user._id }, function (err, adv) {
            if (adv) {
                let scheduleID = adv._id
                Period.find({ owner: scheduleID }, function (err, adv) {
                    res.send(adv)
                }).sort({ period: 1 })
            }
        })
    } catch (err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;