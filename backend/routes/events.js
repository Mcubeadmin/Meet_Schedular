import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

router.post("/events", async (req, res) => {
    const event = req.body;

    await Event.create({
        eventname: event.eventname,
        start: event.start,
        end: event.end,
        date: event.date,
        id: event.id,
        talks: event.talks
    });
    res.json({message: "Saved", event});
});

router.get("/events", async (req,res) => {
    console.log("Events sent")
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ msg: "Server Error", error: err.message});
    }
})

router.delete("/events/:id", async (req, res) => {
    try {
        const idToDelete = req.params.id;
        const result = await Event.deleteOne({
            id: idToDelete
        });
        if (result.deletedCount === 0) throw res.status(404).json({message: "Event not found"})
        res.status(200).json({message: "Deleted successfully"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.put("/events/:eventId/save-talks", async (req, res) => {
    try {
        const { eventId } = req.params;
        const newTalk = req.body;
        
        const updatedEvent = await Event.findOneAndUpdate(
            {id: eventId},
            {talks: newTalk},
            {new: true}
        );

        if (!updatedEvent) return res.status(404).json({ msg: "Event not found" });
        res.status(200).json({message: " saved successfully"});
    } catch (err) {
        console.log("Server Error", err);
    }
});

export default router;