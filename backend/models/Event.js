import mongoose from "mongoose";
const talksSchema = new mongoose.Schema({
    presenter: String,
    title: { type: String, required: true },
    duration: String,
    talkstart: { type: String, required: true },
    talkend: { type: String, required: true }
});

const eventSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required: true
    },

    start: {
        type: String,
        required: true
    },

    end: {
        type: String
    },
    
    date: {
        type: String,
        required: true
    },

    id: {
        type: Number,
        required: true
    },

    talks: [talksSchema]
}, {timestamps: true});

const Event = mongoose.model("Event", eventSchema);

export default Event;