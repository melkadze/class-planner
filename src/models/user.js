const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
	{
		//the user's full name
		username: {
			type: String
		},
		//the user's unique google ID
		googleID: {
			type: String,
			unique: true
		},
		email: {
			type: String,
			unique: true
		},
		//consider storing the image remotely
		thumbnailURL: {
			type: String
		}
	},
	{
		timestamps: true
	}
)

userSchema.virtual("schedule", {
	ref: "Schedule",
	localField: "_id",
	foreignField: "owner"
})

userSchema.virtual("task", {
	ref: "Task",
	localField: "_id",
	foreignField: "owner"
})

const User = mongoose.model("User", userSchema)
module.exports = User