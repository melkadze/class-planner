const router = require("express").Router()
const Event = require("../models/event")
const authCheck = require("../middleware/authCheck")
const functions = require("../config/functions")

//make a new event
router.post("/upload", authCheck, async (req, res) => {
	const event = new Event ({
		...req.body,
		owner: req.user._id
	})
	try{
		await event.save()
		res.send(event)
		console.log(`Sent EVENT: ${event}`)
	} catch(err) {
		functions.error(res, 500, err)
	}
})

router.get("/", authCheck, async (req, res) => {
	try {
		await Event.find({ owner: req.user._id }, function (err, adv) {
			if (adv){
				res.send(adv)
			}
		}).sort({ dueDate: 1 })
	} catch (err) {
		functions.error(res, 500, err)
	}
})

router.delete("/:id", authCheck, async (req, res) => {
	try {
		await Event.deleteMany({ owner: req.user._id, dueDate: req.params.id })
		res.status(200).send("OK")
	} catch (err) {
		functions.error(res, 500, err)
	}
})

router.delete("/byID/:id", authCheck, async (req, res) => {
	try {
		await Event.deleteOne({ owner: req.user._id, _id: req.params.id })
		res.status(200).send("OK")
	} catch (err) {
		functions.error(res, 500, err)
	}
})

module.exports = router