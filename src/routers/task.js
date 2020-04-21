const router = require('express').Router();
const Task = require("../models/task")
const authCheck = require('../middleware/authCheck')
const functions = require('../config/functions')

////make everything async?
//make a new task
router.post('/upload', authCheck, async (req, res) => {
    const task = new Task ({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save();
        res.send(task)
        console.log(`Sent TASK: ${task}`)
    } catch(err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;