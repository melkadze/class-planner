const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId
	}
},
{
	timestamps: true
}
)

const Feedback = mongoose.model("Feedback", feedbackSchema)
module.exports = Feedback