const router = require('express').Router();
const Day = require("../models/day")
const Schedule = require("../models/schedule")
const Course = require("../models/course")
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

////make everything async?
//make a new day
router.post('/upload', authCheck, async (req, res) => {
    try{
        const scheduleRef = await Schedule.findOne({ name: req.body.schedule, owner: req.user._id });
        const day = new Day ({
            ...req.body,
            schedule: scheduleRef._id,
            owner: req.user._id
        })
        await day.save();
        res.send(day)
        console.log(`Sent DAY: ${day}`)
    } catch(err) {
        functions.error(res, 500, err);
    }
})

router.get('/:id', authCheck, async (req, res) => {
    try {
        const day = req.params.id
        await Day.findOne({ day: day, owner: req.user._id }, function (err, adv) {
            if (adv){
                let dayID = adv._id
                Course.find({ owner: dayID }, function (err, adv) {
                    res.send(adv)
                }).sort({ period: 1 })
            }
        })
    } catch (err) {
        functions.error(res, 500, err);
    }
})

router.get('/schedule/:id', authCheck, async (req, res) => {
    //const dayID = Day.findOne({ name: day })
    try {
        const day = req.params.id
        await Day.findOne({ day: day, owner: req.user._id }, function (err, adv) {
            try {
                if (adv) {
                    let scheduleID = adv.schedule
                    
                    Schedule.findById(scheduleID, function (err, adv) {
                        res.send(adv.name)
                    })
                }
            } catch (err) {
                functions.error(res, 500, err);
            }
        })
    } catch (err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;