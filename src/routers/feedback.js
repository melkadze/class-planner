const router = require('express').Router();
const Feedback = require("../models/feedback")
const functions = require('../config/functions')

//make new feedback object
router.post('/upload', async (req, res) => {
    let feedback
    try {
        feedback = new Feedback ({
            ...req.body,
            owner: req.user._id
        })
    } catch (err) {
        feedback = new Feedback ({
            ...req.body
        })
    }
    try{
        await feedback.save();
        res.send(feedback)
        console.log(`Sent FEEDBACK: ${feedback}`)
    } catch(err) {
        functions.error(res, 500, err);
    }
})

module.exports = router;