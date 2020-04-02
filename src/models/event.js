const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    active: { //active: denotes if item should be shown to user [set to 1 when creating, 0 when expired]
        type: Boolean,
        required: true
    },
    course: { //relevant course, is user-definable and is only for display purposes
        type: String
    },
    dueDate: { //required
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;