const router = require('express').Router();
const Day = require("../models/day")
const Schedule = require("../models/schedule")
const Course = require("../models/course")
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

////make everything async?
//make a new day
router.post('/upload', authCheck, async (req, res) => {
    const scheduleRef = await Schedule.findOne({ name: req.body.schedule, owner: req.user._id });
    const day = new Day ({
        ...req.body,
        schedule: scheduleRef._id,
        owner: req.user._id
    })
    try{
        await day.save();
        res.send(day)
        console.log(`Sent DAY: ${day}`)
    } catch(err) {
        functions.error(res, 500, err);
    }
})

router.get('/:id', authCheck, async (req, res) => {
    const day = req.params.id
    //const dayID = Day.findOne({ name: day })
    try {
        await Day.findOne({ day: day }, function (err, adv) {
            let dayID = adv._id
            Course.find({ owner: dayID }, function (err, adv) {
                res.send(adv)
            }).sort({ period: 1 })
        })
    } catch (err) {
        functions.error(res, 500, err);
    }
})

router.get('/schedule/:id', authCheck, async (req, res) => {
    const day = req.params.id
    //const dayID = Day.findOne({ name: day })
    try {
        await Day.findOne({ day: day }, function (err, adv) {
            let scheduleID = adv.schedule
            
            Schedule.findById(scheduleID, function (err, adv) {
                res.send(adv.name)
            })
        })
    } catch (err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;