import express from "express";
import Event from "../models/Event.js";
import authorizer from "../middleware/auth.js";
import generateEventPDF from "../services/pdfgen.js";

const router = express.Router();

router.post("/events", authorizer, async (req, res) => {
    try {
        const event = req.body;

        const newEvent = await Event.create({
            eventname: event.eventname,
            start: event.start,
            end: event.end,
            date: event.date,
            id: event.id,
            talks: event.talks,
            createdBy: req.user._id
        });
        res.json({message: "Saved", event: newEvent});
    } catch (err) {
        res.status(500).json({message: "Server Error", err})
    }
});

router.get("/events", authorizer, async (req,res) => {
    try {
        // console.log(req.user._id);
        const events = await Event.find({createdBy: req.user._id});
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


router.get("/events/pdf/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send("Event not found");
        const pdfBuffer = await generateEventPDF(event);
        res.contentType("application/pdf");
        res.setHeader("Content-Disposition", `attachment: filename=${event.eventname}.pdf}`);
        res.send(pdfBuffer);
    } catch (err) {
        res.status(500).json({message: err.message});
        console.log(err)
    }
});

export default router;