const router = require('express').Router();
const Event = require("../models/event")
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

////make everything async?
//make a new event
router.post('/upload', authCheck, async (req, res) => {
    const event = new Event ({
        ...req.body,
        owner: req.user._id
    })
    try{
        await event.save();
        res.send(event)
        console.log(`Sent EVENT: ${event}`)
    } catch(err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;