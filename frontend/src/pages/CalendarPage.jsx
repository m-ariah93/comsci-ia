import Calendar from "../components/Calendar";
import { useEffect, useRef, useState } from "react";
import { Draggable } from "@fullcalendar/interaction";
import plusIcon from "../assets/plus-lg.svg";
import { Link, useLocation } from "react-router-dom";
import { useProjects } from "../contexts/ProjectsContext";
import { formatDate, subtractDay } from "/src/utils/DateUtils";

export default function CalendarPage() {
    const draggableRef = useRef(null);

    useEffect(() => {

        // event dragging
        const containerEl = document.getElementById("draggable-events");
        if (containerEl && !draggableRef.current) {
            // store the Draggable instance in the ref
            draggableRef.current = new Draggable(containerEl, {
                itemSelector: ".fc-event-draggable",
                eventData: function (eventEl) {
                    return {
                        title: eventEl.innerText,
                    };
                },
            });
        }

        // horizontal instead of vertical scrolling on navbar
        let horizontal = document.getElementById("navTabsHorizontal");
        horizontal.addEventListener('wheel', (e) => {
            e.preventDefault();
            horizontal.scrollLeft += e.deltaY * 0.2;
        });

    }, []); // runs once on page load

    const { activeProjects } = useProjects();

    // track which calendar is open 
    // all project view is 0
    const [currentProjectId, setCurrentProjectId] = useState(0);

    const [currentProject, setCurrentProject] = useState(null);

    // store current project (for colour for draggable events, and passing to Calendar)
    useEffect(() => {
        fetch(`http://localhost:3001/projects/${currentProjectId}`)
            .then(res => res.json())
            .then(data => {
                setCurrentProject(data);
            });
    }, [currentProjectId]);

    const [nextEvent, setNextEvent] = useState(null);

    useEffect(() => {
        // fetch next event
        fetch("http://localhost:3001/events/next")
            .then(res => res.json())
            .then(data => {
                console.log("events/next response:", data)
                setNextEvent(data)
            })
            .catch(() => setNextEvent(null));

    }, []);

    const location = useLocation();

    const [templateBookings, setTemplateBookings] = useState([]);

    useEffect(() => {
        if (currentProjectId === 0) {
            return;
        }
        fetch(`http://localhost:3001/projects/${currentProjectId}/bookings`)
            .then(res => res.json())
            .then(data => setTemplateBookings(data));
    }, [currentProjectId]);


    return (
        <div className="container-fluid d-flex flex-column vh-100">
            <div className="row my-2">
                <div className="col-9 d-flex flex-nowrap">
                    <ul className="nav nav-tabs overflow-x-auto overflow-y-hidden flex-nowrap text-nowrap w-100" id="navTabsHorizontal">
                        <li className="nav-item">
                            <a className={`nav-link ${currentProjectId === 0 ? 'active fw-semibold' : ''}`} href="#" onClick={() => setCurrentProjectId(0)}>All</a>
                        </li>
                        {activeProjects.map((project) => (
                            <li className="nav-item" key={project.id}>
                                <a className={`nav-link ${currentProjectId === project.id ? 'active fw-semibold' : ''}`} href="#" style={{ color: project.colour }} onClick={() => setCurrentProjectId(project.id)}>{project.title}</a>
                            </li>
                        ))}
                    </ul>
                    <Link to="/projects/add" state={{ from: location }} className="btn btn-outline-primary ms-auto"><img src={plusIcon} /></Link>
                </div>
                <div className="col-3">
                    <input type="text" className="form-control" placeholder="search" />
                </div>
            </div>
            <div className="row h-100 overflow-hidden">
                <div className="col-9 d-flex flex-column h-100 pb-4">
                    <Calendar
                        style={{ flex: 1 }}
                        // key={currentProjectId}
                        currentProjectId={currentProjectId}
                        currentProject={currentProject}
                        onEventsChanged={() => {
                            fetch("http://localhost:3001/events/next")
                                .then(res => res.json())
                                .then(data => setNextEvent(data))
                                .catch(() => setNextEvent(null));
                            fetch(`http://localhost:3001/projects/${currentProjectId}/bookings`)
                                .then(res => res.json())
                                .then(data => setTemplateBookings(data));
                        }} // run callback to refresh next up event card and draggable bookings
                    />
                </div>
                <div className="col-3 mh-100" id="draggable-events">
                    {currentProjectId !== 0 ? (
                        <>
                            <h4>Key bookings</h4>
                            <div className="overflow-auto h-50">
                                {templateBookings.map((event) => (
                                    <div key={event.bookingId} className={`fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event my-1 ${event.used ? "opacity-50" : "fc-event-draggable"}`} style={{
                                        backgroundColor: currentProject.colour,
                                        borderColor: currentProject.colour,
                                        cursor: event.used ? "auto" : "pointer"
                                    }}
                                        data-template-id={event.templateId}
                                    >
                                        <div className={`fc-event-main ${event.used && "text-decoration-line-through"}`}>{event.title}</div>
                                    </div>
                                ))}
                                {console.log("currentProject colour is: ", currentProject.colour)}
                            </div>
                        </>
                    ) : (
                        // next upcoming event
                        <>
                            <h4>Next up</h4>
                            <div className="h-50 pt-2">
                                {nextEvent ? (
                                    <div className="card p-2">
                                        <div className="card-body">
                                            <h5 className="fw-bold">{nextEvent.title}</h5>
                                            <div style={{ color: nextEvent.projectColour }}>{nextEvent.projectTitle || "No associated project"}</div>
                                        </div>
                                        <hr className="m-0" />
                                        <div className="card-body">
                                            <div className="">{nextEvent.end && "Start: "}{formatDate(nextEvent.start)}</div>
                                            {nextEvent.end && (
                                                <div className="small">End: {formatDate(subtractDay(nextEvent.end))}</div>
                                            )}
                                        </div>
                                        <hr className="m-0" />
                                        <div className="card-body">
                                            <a href="#" className="btn btn-secondary btn-sm me-2">Request confirmation</a>
                                            <a href="#" className="btn btn-danger btn-sm">Delete</a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-secondary">No upcoming events :(</div>
                                )}
                            </div>
                        </>
                    )}
                    <div className="d-grid gap-2 my-3">
                        <button className="btn btn-primary" type="button">New custom event</button>
                    </div>
                </div>
            </div>

        </div>
    );
}