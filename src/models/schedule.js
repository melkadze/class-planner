const mongoose = require("mongoose")
const validator = require("validator")

const scheduleSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		validate(value) {
			//check if name is above 32 char
			if (
				!validator.isLength(value, {
					min: 1,
					max: 32
				})
			) {
				throw new Error("Schedule name cannot exceed 32 characters")
			}
		}
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
},
{
	timestamps: true
}
)

scheduleSchema.virtual("period", {
	ref: "Period",
	localField: "_id",
	foreignField: "owner"
})

//force schedule names to be unique per user, but not per db
scheduleSchema.index(
	{name: 1, owner: 1}, {unique: true}
)

const Schedule = mongoose.model("Schedule", scheduleSchema)
Schedule.ensureIndexes() //makes sure compound indexes are applied
module.exports = Schedule