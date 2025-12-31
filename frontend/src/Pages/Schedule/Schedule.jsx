import { Card, Icon } from "@mui/material";
import "./Schedule.css"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ScrollToTop from "../../Components/ScrollUpButton/ScrollToTop.jsx";
import ArrowBack from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import LoadingModal from "../../Components/Loading.jsx";
import api from "../../api/axios.js";
import RichTextBox from "../../Components/RichTextBox.jsx";

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
                    <EventEditor onSaved={() => setRefresh(prev => !prev)} event={editingEvent} onBack={() => setEditingEvent(null)}/>
                ) : (   
                <><h1>Event Schedular</h1>
                <div className="schedular-organize">
                    <div className="left-panel">
                        <EventSetupForm onCreated={() => setRefresh(prev => !prev)} allEvents={allEvents} />
                    </div>
                    <div className="right-panel">
                        <h2>All Created Events</h2>
                        <EventView onCreated={() => setRefresh(prev => !prev)} onEdit={(event) => setEditingEvent(event) } allEvents={allEvents} />
                    </div>
                </div></>
                )}
        </div>
    );
}

function EventView ({onEdit, onCreated, allEvents}) {
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
            const eventData = {eventname, start, end, date, id: Date.now(), talks: [], eventheader: "", eventfooter: ""};
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

function EventEditor({ event, onBack, onSaved }) {
    const [talks, setTalks] = useState(event.talks || []);
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [presenter, setPresenter] = useState("");
    const [exceedTimeLimit, setExceedTimeLimit] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [headerText, setHeaderText] = useState(event.eventheader || "");
    const [footerText, setFooterText] = useState(event.eventfooter || "");
    let talkend = "";
    let talkstart = "";
    
    useEffect(() => {
        setExceedTimeLimit(talks[talks.length - 1]?.talkend > (event.end || 0));
    });

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
            const response = await api.put(`/events/${event.id}`, {
                talks,
                eventheader: headerText,
                eventfooter: footerText
            });
            toast.success("Event " + response.data.message);
            onSaved();
        } catch (err) {
            toast.error("Error: " + err.message);
        }
    };
    // console.log(talks);

    function deleteRow(indexToremove) {
        const newtalks = talks.filter((_, index) => index !== indexToremove);
        const subtractDuration = Number(event.talks[indexToremove].duration) * -1;
        // OLD LOGIC
        // for (indexToremove; indexToremove < newtalks.length; indexToremove++){
        //     newtalks[indexToremove].talkstart = newtalks[indexToremove - 1]?.talkend || event.start;
        //     newtalks[indexToremove].talkend = addTime(newtalks[indexToremove].talkstart, newtalks[indexToremove].duration);
        // }

        const modifiedtalks = [...newtalks].map((talk, index) => {
            if (index >= indexToremove){
                return {
                ...talk,
                talkstart: addTime(talk.talkstart, subtractDuration),
                talkend: addTime(talk.talkend, subtractDuration),
                };
            }
            return talk;
        });
        setTalks(modifiedtalks);
        return null;
    }

    async function genPDF(event) {
        console.log(event);
        setIsGenerating(true);
        try {
            const response = await api.get(`/events/pdf/${event._id}`, {
                responseType: 'blob',
                timeout: 30000,
            });


            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Event_Schedule.pdf');

            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            window.URL.revokeObjectURL(url);
            toast.success(response.data.message || "PDF Generated Successfully!");

        } catch (err) {
            console.error("PDF Generation Error", err);
            toast.error("Unable to generate PDF!");
        } finally {
            setIsGenerating(false);
        }
    }
    
    function moveRow(index, direction) {
        const moveIndex = index + direction;
        if (moveIndex >= talks.length || moveIndex < 0) return console.log("cannot move");
        const newtalks = [...talks];
        const moveTalk= talks[index];
        newtalks[index] = talks[moveIndex];
        newtalks[moveIndex] = moveTalk;
        for (index = 0; index < newtalks.length; index++){
            newtalks[index].talkstart = newtalks[index - 1]?.talkend || event.start;
            newtalks[index].talkend = addTime(newtalks[index].talkstart, newtalks[index].duration);
        }
        setTalks(newtalks)
        return;
    }

    return (
        <div>
            <ScrollToTop />
            <LoadingModal open={isGenerating} message="Generating PDF! Please wait!" />
            <div style={{display:"flex", padding:"10px"}}>
                <button style={{fontSize:"2px", borderRadius:"30%"}} onClick={onBack}><ArrowBack /></button>

                <h2>{event.eventname} on {event.date} | {displayTime(event.start)} {event.end? " to " + displayTime(event.end) : ""}</h2>
            </div>
            <div className="add-talk">
                <input className="talk-input" placeholder="Presenter" type="text" value={presenter} onChange={e => setPresenter(e.target.value)} required />
                <input className="talk-input" placeholder="Talk title" value={title} onChange={e => setTitle(e.target.value)} required />
                <input className="talk-input" placeholder="Duration (mins)" type="number" value={duration} onChange={e => setDuration(e.target.value)} required />
                <div className="add-talk-btn">
                <button onClick={addTalk}>Add Section</button>
                <button onClick={onSave}>Save</button>
                <button onClick={() => genPDF(event)}>Generate PDF</button>
                </div>
            </div>
            <h4 style={{color:"red", alignSelf:"left"}}>{exceedTimeLimit? "Schedule exceeds event end time!": ""}</h4>
            <h4 style={{textAlign:"left", paddingLeft:"30px"}}>Schedule header:</h4>
            <RichTextBox
                value={headerText}
                onChange={setHeaderText}
            />
            <div  className="table-wrapper">
                <table className="talk-table">
                    <colgroup>
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "45%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "5%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Move</th>
                            <th>Start Time - End Time</th>
                            <th>Duration</th>
                            <th>Title</th>
                            <th>Presenter</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {talks.map((talk, index) => (
                            <tr key={index}>
                                <td>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        aria-label="move-up"
                                        onClick={() => moveRow(index, -1)}
                                    ><ArrowUpwardIcon fontSize="small" /></IconButton>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        aria-label="move-up"
                                        onClick={() => moveRow(index, 1)}
                                    ><ArrowDownwardIcon fontSize="small" /></IconButton>
                                </td>
                                <td>{displayTime(talk.talkstart)} - {displayTime(talk.talkend)}</td>
                                <td>{displayDuration(talk.duration)}</td>
                                <td>{talk.title}</td>
                                <td>{talk.presenter}</td>
                                <td>
                                    <IconButton 
                                    size="small"
                                    onClick={() => deleteRow(index)}
                                    sx={{ 
                                        color: 'error.main', // Standard MUI red
                                        '&:hover': {
                                        backgroundColor: 'rgba(211, 47, 47, 0.04)', // Light red hover tint
                                        }
                                    }}
                                    >
                                    <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            <h4 style={{textAlign:"left", paddingLeft:"30px"}}>Schedule Footer:</h4>
            <RichTextBox
                value={footerText}
                onChange={setFooterText}
            />
            </div>
        </div>
    );
}


//==============HELPER FUNCTIONS==============================
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
//================================================================
