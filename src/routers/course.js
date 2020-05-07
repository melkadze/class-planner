const router = require('express').Router();
const Course = require("../models/course")
const Day = require("../models/day")
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

//make a new schedule
router.post('/upload', authCheck, async (req, res) => {
    try {
        const dayRef = await Day.findOne({ day: req.body.forDay, owner: req.user._id });
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
    } catch (err) {
        functions.error(res, 500, err);
    }
})

router.delete('/byID/:id', authCheck, async (req, res) => {
    try {
        await Course.deleteOne({ _id: req.params.id })
        res.status(200).send('OK')
    } catch (err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;