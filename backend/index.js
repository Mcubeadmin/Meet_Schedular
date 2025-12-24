import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const PROD_URL = process.env.FRONT_END_URL;
const LOCAL_URL = process.env.LOCAL_FRONT_END_URL;
const ALLOWED_ORIGINS = [PROD_URL, LOCAL_URL];
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use(eventRoutes);

app.get("/", (req,res) => {
    res.send("Backend is running!" + authRoutes);
});


app.listen(PORT, () => console.log("Backend is running on port 5000"));

//Event handling code
let events = []; //temporary db

function isDuplicate(events, newEvent) {
    return events.some(existingEvent => 
            existingEvent.eventname === newEvent.eventname &&
            existingEvent.start === newEvent.start &&
            existingEvent.end === newEvent.end &&
            existingEvent.date === newEvent.date
    );
}

app.post("/events", (req, res) => {
    const event = req.body;
    if (!isDuplicate(events, event)) {
        event.id = Date.now();
        events.push(event);
        console.log("Event Saved", events)
        res.json({message: "Saved", event});
    } else {
        res.json({message: "Already exists"});
        console.log("Event rejected");
    }
});

app.get("/events", (req,res) => {
    console.log("Events sent")
    res.json(events);
})