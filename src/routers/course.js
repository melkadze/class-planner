const router = require('express').Router();
const Course = require("../models/course")
const Day = require("../models/day")
const Schedule = require("../models/schedule")
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

////make everything async?
//make a new schedule
router.post('/upload', authCheck, async (req, res) => {
    const dayRef = await Day.findOne({ day: req.body.forDay });
    const course = new Course ({
        ...req.body,
        owner: dayRef._id
    })
    console.log(`Sent COURSE: ${course}`)
    try{
        await course.save();
        res.send(course)
    } catch(err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;