import Calendar from "../components/Calendar";
import { useEffect, useRef, useState } from "react";
import { Draggable } from "@fullcalendar/interaction";
import { Link, useLocation } from "react-router-dom";
import { useProjects } from "../contexts/ProjectsContext";
import { formatDate, subtractDay } from "/src/utils/DateUtils";
import CustomEventModal from "../components/CustomEventModal";

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
        fetch(`http://localhost:3001/projects/${currentProjectId}/templates`)
            .then(res => res.json())
            .then(data => setTemplateBookings(data));
    }, [currentProjectId]);

    const keyBookingsRef = useRef(null);

    const [events, setEvents] = useState([]);

    // load events
    useEffect(() => {
        handleEventsChanged();
    }, [currentProjectId]);

    function refreshExternalEvents() {
        // refresh next up event card and draggable bookings
        fetch("http://localhost:3001/events/next")
            .then(res => res.json())
            .then(data => setNextEvent(data))
            .catch(() => setNextEvent(null));
        fetch(`http://localhost:3001/projects/${currentProjectId}/templates`)
            .then(res => res.json())
            .then(data => setTemplateBookings(data));
    }

    const handleEventsChanged = () => {
        refreshExternalEvents();
        const url = currentProjectId === 0 ? "http://localhost:3001/events" : `http://localhost:3001/events?project_id=${currentProjectId}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const allDayEvents = data.map(event => ({
                    ...event,
                    backgroundColor: event.projectColour || "#6F6D6B", // default color if projectColour is not defined
                    borderColor: event.projectColour || "#6F6D6B",
                    extendedProps: { project_id: event.project_id }
                }));
                setEvents(allDayEvents);
            });
    };

    function deleteNextEvent() {
        fetch(`http://localhost:3001/events/${nextEvent.id}`, {
            method: "DELETE",
        })
            .then(() => {
                console.log(`Event ${nextEvent.id} deleted`);
                handleEventsChanged();
            })
            .catch(console.error);
    }

    return (
        <div className="container-fluid d-flex flex-column flex-grow-1 vh-100 ps-0" >
            <div className="row mb-2 mt-3">
                <div className="col-12 d-flex flex-nowrap">
                    <ul className="nav nav-tabs overflow-x-auto overflow-y-hidden flex-nowrap text-nowrap w-100" id="navTabsHorizontal">
                        <li className="nav-item">
                            <a className={`nav-link ${currentProjectId === 0 ? 'active fw-semibold' : ''}`} href="#" onClick={() => setCurrentProjectId(0)}>All</a>
                        </li>
                        {activeProjects.map((project) => (
                            <li className="nav-item" key={project.id}>
                                <a className={`nav-link ${currentProjectId === project.id ? 'active fw-semibold' : ''}`} href="#" style={{ color: project.colour }} onClick={() => setCurrentProjectId(project.id)}>{project.title}</a>
                            </li>
                        ))}
                        <Link to="/projects/add" state={{ from: location }} className="btn btn-outline-secondary ms-2 d-flex align-items-center justify-content-center p-0 mt-1" style={{ width: "30px", height: "30px" }}><i className="bi bi-plus fs-4"></i></Link>
                    </ul>
                </div>
            </div>
            <div className="row d-flex flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
                <div className="col-9 d-flex flex-column flex-grow-1 pb-4 mt-1" style={{ minHeight: 0 }}>
                    <Calendar
                        style={{ flex: 1 }}
                        // key={currentProjectId}
                        currentProjectId={currentProjectId}
                        currentProject={currentProject}
                        keyBookingsRef={keyBookingsRef}
                        events={events}
                        onEventsChanged={handleEventsChanged} // callback to update events
                    />
                </div>
                <div className="col-3 d-flex flex-column flex-grow-1 h-100 mt-2 pe-4" style={{ minHeight: 0 }} id="draggable-events">
                    {currentProjectId !== 0 ? (
                        <>
                            <h4>Key bookings</h4>
                            <div className="overflow-auto border d-grid gap-0 row-gap-1 mt-2" ref={keyBookingsRef}>
                                {templateBookings.map((event) => (
                                    <div key={event.bookingId} className={`fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event ${event.used ? "opacity-50 user-select-none" : "fc-event-draggable"}`} style={{
                                        backgroundColor: currentProject.colour,
                                        borderColor: currentProject.colour,
                                        cursor: event.used ? "auto" : "pointer"
                                    }}
                                        data-template-id={event.bookingId}
                                    >
                                        <div className={`fc-event-main ${event.used && "text-decoration-line-through"}`}>{event.title}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        // next upcoming event
                        <>
                            <h4>Next up</h4>
                            <div className="pt-2">
                                {nextEvent ? (
                                    <div className="card p-2">
                                        <div className="card-body">
                                            <h5 className="fw-bold">{nextEvent.title}</h5>
                                            <div style={{ color: nextEvent.projectColour }}>{nextEvent.projectTitle || <em>No associated project</em>}</div>
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
                                            <a href="#" className="btn btn-danger btn-sm" onClick={deleteNextEvent}>Delete</a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-secondary">No upcoming events :(</div>
                                )}
                            </div>
                        </>
                    )}
                    <div className="d-grid gap-2 mt-4 mb-5">
                        <button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#customEventModal">New custom event</button>
                    </div>

                </div>
            </div>
            <CustomEventModal projectId={currentProjectId} onEventsChanged={handleEventsChanged} />
        </div>
    );
}