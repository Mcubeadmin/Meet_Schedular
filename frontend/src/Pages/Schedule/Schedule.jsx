import { Card } from "@mui/material";
import "./Schedule.css"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ScrollToTop from "../../Components/ScrollUpButton/ScrollToTop.jsx";
import ArrowBack from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/axios.js";

export default function Schedule() {
    const [refresh, setRefresh] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    
    const [allEvents, setAllEvents] = useState([]);
    const fetchMyEvents = async () => {
        try {
            const { data } = await api.get("/events");
            setAllEvents(data);
        } catch (err) {
            console.error("Fetch Failed", err.respose?.data?.msg);
            toast.error("Fetch Failed");
        }
    };
    useEffect(() => {
        fetchMyEvents();
    }, [refresh]);
    
    return (
        <div style={{marginTop:"6rem"}}>
            {editingEvent ? (
                    <EventEditor event={editingEvent} onBack={() => setEditingEvent(null)}/>
                ) : (   
                <><h1>Event Schedular</h1>
                <div className="schedular-organize">
                    <div className="left-panel">
                        <EventSetupForm onCreated={() => setRefresh(prev => !prev)} allEvents={allEvents} />
                    </div>
                    <div className="right-panel">
                        <h2>All Created Events</h2>
                        <EventView refresh={refresh} onCreated={() => setRefresh(prev => !prev)} onEdit={(event) => setEditingEvent(event) } allEvents={allEvents} />
                    </div>
                </div></>
                )}
        </div>
    );
}

function EventView ({refresh, onEdit, onCreated, allEvents}) {
    const sortedEvents = [...allEvents].sort((a, b) => b.id - a.id);

    const handleDelete = async (ev) => {
        try{
            const response = await api.delete(`/events/${ev.id}`);
            console.log('Delete', response.data);
            toast.success(`Event ${response.data.message}`);
            onCreated();
        } catch (err) {
            console.error("Delete Error:", err.response?.data?.nsg || err.message);
            toast.error("Error: " + err.response?.data?.nsg || "Failed to delete");
        }
    };

    return (
        <div>
            {sortedEvents && sortedEvents.length > 0?
                (sortedEvents.map(ev => (
                    <Card key={ev.id} style={{padding: "10px", marginBottom: "10px"}}>
                        <p>Event: {ev.eventname} | Date: {ev.date}</p>
                        <p>{displayTime(ev.start)} - {ev.end? displayTime(ev.end) : "No end time defined"}</p>
                        <button onClick={() => onEdit(ev)} ><EditIcon fontSize="inherit" /></button>
                        <button onClick={() => handleDelete(ev)}><DeleteIcon fontSize="inherit"/></button>
                    </Card>
                ))
            ) : (
                <h3>No Events Added</h3>
            )}
        </div>
    );
}

function EventSetupForm ({onCreated, allEvents}) {
    const [eventname, setEventName] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [date, setDate] = useState("");
    
    function isDuplicate(newEvent) {
        return allEvents.some(existingEvent => 
            existingEvent.eventname === newEvent.eventname &&
            existingEvent.start === newEvent.start &&
            existingEvent.end === newEvent.end &&
            existingEvent.date === newEvent.date
        );
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const eventData = {eventname, start, end, date, id: Date.now(), talks: []};
            if (isDuplicate(eventData)) return toast.error("Event already Exists!"); 
            const response = await api.post("/events", eventData);
            toast.success("Event added!");
            onCreated();
        } catch (err){
            toast.error("Create Failed!" + err.data?.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="schedule-form">
            <h2>Organizer Setup</h2>

            <div className="form-row">
                <label>Event Label:</label>
                <input type="text" value={eventname} onChange={e => setEventName(e.target.value)} required />
            </div>

            <div className="form-row">
                <label>Start time:</label>
                <input type="time" value={start} onChange={e => setStart(e.target.value)} required />
            </div>

            <div className="form-row">
                <label>End time (optional):</label>
                <input type="time" value={end} onChange={e => setEnd(e.target.value)} />
            </div>

            <div className="form-row">
                <label>Event date:</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>

            <button type="submit">Create Event</button>
        </form>
    );
}

function displayTime(eventTime) {
    // console.log(eventTime);
    let [hours, minutes]  = eventTime.split(':').map(Number);
    const ampm = hours >= 12? "PM" : "AM";
    hours = String(hours % 12 || 12).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    return `${hours} : ${minutes} ${ampm}`;
}

function displayDuration(duration) {
    const Hours = Math.floor(Number(duration) / 60);
    const minutes = Number(duration) % 60;
    return Hours? `${Hours} hr ${minutes} mins` : `${minutes} mins`;
}

function addTime(talkTime, duration) {
    const [hours, minutes]  = talkTime.split(':').map(Number);
    const totalminutes = (hours * 60) + minutes + Number(duration);
    const newHours = Math.floor(totalminutes / 60);
    const newMinutes = totalminutes % 60;
    return `${newHours}:${newMinutes}`;
}   

function EventEditor({ event, onBack }) {
    const [talks, setTalks] = useState(event.talks || []);
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [presenter, setPresenter] = useState("");
    let talkend = "";
    let talkstart = "";

    
    const addTalk = () => {
        if (!title || !duration || duration < 0) return toast.error("Invalid Input!");
        talkstart = talks[talks.length - 1]?.talkend || event.start;
        talkend = addTime(talkstart, duration);
        setTalks([...talks, { presenter, title, duration, talkstart, talkend }]);
        setTitle("");
        setDuration("");    
        setPresenter("");
    };

    // console.log(JSON.stringify({id: event.id, talks: talks,}))
    const onSave = async () => {
        try {
            const response = await api.put(`/events/${event.id}/save-talks`, talks);
            toast.success("Event " + response.data.message);
        } catch (err) {
            toast.error("Error: " + err.message);
        }
    };
    // console.log(talks);

    function deleteRow(indexToremove) {
        const newtalks = talks.filter((_, index) => index !== indexToremove);
        setTalks(newtalks);
        return null;
    }

    return (
        <div>
            <ScrollToTop />
            <div style={{display:"flex"}}>
                <button onClick={onBack}><ArrowBack /></button>
                <h2>{event.eventname} on {event.date} | {displayTime(event.start)} {event.end? " to " + displayTime(event.end) : ""}</h2>
            </div>
            <div className="add-talk">
                <h3>Add Talk: </h3>
                <input className="talk-input" placeholder="Presenter" type="text" value={presenter} onChange={e => setPresenter(e.target.value)} required />
                <input className="talk-input" placeholder="Talk title" value={title} onChange={e => setTitle(e.target.value)} required />
                <input className="talk-input" placeholder="Duration (mins)" type="number" value={duration} onChange={e => setDuration(e.target.value)} required />

                <button onClick={addTalk}>Add</button>
                <button onClick={onSave}>Save</button>
            </div>
            <div  className="table-wrapper">
                <table className="talk-table">
                    <colgroup>
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "40%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "10%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Start Time - End Time</th>
                            <th>Duration</th>
                            <th>Title</th>
                            <th>Presenter</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {talks.map((talk, index) => (
                            <tr key={index}>
                                <td>{displayTime(talk.talkstart)} - {displayTime(talk.talkend)}</td>
                                <td>{displayDuration(talk.duration)}</td>
                                <td>{talk.title}</td>
                                <td>{talk.presenter}</td>
                                <td><button onClick={() => deleteRow(index)}><DeleteIcon fontSize="inherit"/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
