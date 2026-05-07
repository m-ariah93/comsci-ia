import Calendar from "../components/Calendar";
import { useEffect, useRef, useState } from "react";
import { Draggable } from "@fullcalendar/interaction";
import { Link, useLocation } from "react-router-dom";
import { useProjects } from "../contexts/ProjectsContext";
import { formatDate, formatBookingDate, subtractDay } from "/src/utils/DateUtils";
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

    // call hook to access projects list
    const { activeProjects } = useProjects();

    // track which calendar is open 
    // all project view is 0
    const [currentProjectId, setCurrentProjectId] = useState(0);

    const [currentProject, setCurrentProject] = useState(null);

    // store current project (for colour for draggable events, and passing to Calendar)
    useEffect(() => {
        fetch(`/api/projects/${currentProjectId}`)
            .then(res => res.json())
            .then(data => {
                setCurrentProject(data);
            });
    }, [currentProjectId]);

    const [nextEvents, setNextEvents] = useState([]);
    const [nextEventsLoaded, setNextEventsLoaded] = useState(false);

    useEffect(() => {
        // fetch next events
        setNextEventsLoaded(false);
        fetch("/api/events/next")
            .then(res => res.json())
            .then(data => {
                setNextEvents(Array.isArray(data) ? data : []);
                setNextEventsLoaded(true);
            })
            .catch(() => {
                setNextEvents([]);
                setNextEventsLoaded(true);
            });

    }, []);

    const location = useLocation();

    const [templateBookings, setTemplateBookings] = useState(null);

    useEffect(() => {
        if (currentProjectId === 0) {
            return;
        }
        setTemplateBookings(null); // reset to null so spinner shows
        fetch(`/api/projects/${currentProjectId}/templates`)
            .then(res => res.json())
            .then(data => setTemplateBookings(data));
    }, [currentProjectId]);

    // declare ref with useRef hook
    const keyBookingsRef = useRef(null); // initially null

    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(false);

    // load events
    useEffect(() => {
        handleEventsChanged();
    }, [currentProjectId]);

    function refreshExternalEvents() {
        // refresh next up events cards and draggable bookings
        setNextEventsLoaded(false);
        fetch("/api/events/next")
            .then(res => res.json())
            .then(data => {
                setNextEvents(Array.isArray(data) ? data : []);
                setNextEventsLoaded(true);
            })
            .catch(() => {
                setNextEvents([]);
                setNextEventsLoaded(true);
            });
        fetch(`/api/projects/${currentProjectId}/templates`)
            .then(res => res.json())
            .then(data => setTemplateBookings(data));
    }

    const [selectedDate, setSelectedDate] = useState(null);

    function handleDateClick(dateStr) {
        setSelectedDate(dateStr);
        const modal = new bootstrap.Modal(document.getElementById('customEventModal'));
        modal.show();
    }

    useEffect(() => {
        const modal = document.getElementById('customEventModal');
        // reset dateStr to reset modal start date on close
        const handleModalHidden = () => setSelectedDate(null);
        modal?.addEventListener('hidden.bs.modal', handleModalHidden);
        return () => { // clean up event listener to hopefully fix weird bugs
            modal?.removeEventListener('hidden.bs.modal', handleModalHidden);
        };
    }, []);

    const secondaryColour = "#6F6D6B";

    function handleEventsChanged() {
        setEventsLoading(true); // show loading spinner
        refreshExternalEvents(); // refresh event data in calendar side panel
        const url = currentProjectId === 0 // ternary conditional
            ? "/api/events" // all events
            : `/api/events?project_id=${currentProjectId}`; // events from one project only
        fetch(url) // send request to API endpoint
            .then(res => res.json()) // parse json output into JS object
            .then(data => {
                setEvents(data.map(event => ({ // update events array state
                    ...event, // spread operator, copies existing properties

                    // set event colour props to match associated project
                    // default to secondary colour if projectColour is undefined
                    backgroundColor: event.projectColour || secondaryColour,
                    borderColor: event.projectColour || secondaryColour,
                    extendedProps: { // extra information, used elsewhere - REMOVE IN IA DOCUMENTATION SS
                        project_id: event.project_id,
                        template_id: event.template_id,
                        note: event.note
                    }
                })));
                setEventsLoading(false); // remove loading spinner
            });
    };

    function deleteNextEvent(eventId) {
        fetch(`/api/events/${eventId}`, {
            method: "DELETE",
        })
            .then(() => {
                // console.log(`Event ${nextEvent.id} deleted`);
                handleEventsChanged();
            })
            .catch(console.error);
    }

    const [emailGreeting, setEmailGreeting] = useState("");
    const [emailClosing, setEmailClosing] = useState("");

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                setEmailGreeting(data.emailGreeting);
                setEmailClosing(data.emailClosing);
            });
    }, []);

    useEffect(() => {
        var todayBtn = document.querySelector(".fc-today-button");
        todayBtn.classList.add("d-none", "d-md-inline");
        var weekBtn = document.querySelector(".fc-dayGridWeek-button");
        weekBtn.classList.add("d-none", "d-md-inline");
        var monthBtn = document.querySelector(".fc-dayGridMonth-button");
        monthBtn.classList.add("d-none", "d-md-inline");
        var weekBtn = document.querySelector(".fc-listMonth-button");
        weekBtn.classList.add("d-none", "d-md-inline");
    }, []);

    function mailtoLink(event) {
        let dateText;
        if (event.end) { // multi day event            
            dateText = `from ${formatBookingDate(event.start)} to ${formatBookingDate(subtractDay(event.end))}`;
        } else { // single day event
            dateText = `on ${formatBookingDate(event.start)}`;
        }
        const body = encodeURIComponent( // replaces special characters with escape sequences for URL safety
            emailGreeting + "\r\n\r\n" + // greeting and 2x newlines
            `Could you please confirm the booking for the ${event.title} ` + 
            dateText + 
            `${event.address ? `, at ${event.address}` : ""}` + // address clause if project address exists
            "?\r\n\r\n" + // 2x newlines
            emailClosing
        );
        const link = "mailto:?subject=Booking%20confirmation&body=" + body; // preset subject "Booking confirmation"
        return link;
    }

    function DraggableEventComponent({ event }) {
        return (
            <div className={`fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event ${event.used ? "opacity-50 user-select-none" : "fc-event-draggable"}`} style={{
                backgroundColor: currentProject.colour || secondaryColour,
                borderColor: currentProject.colour || secondaryColour,
                cursor: event.used ? "auto" : "pointer"
            }}
                data-template-id={event.bookingId}
            >
                <div className={`fc-event-main ${event.used && "text-decoration-line-through"}`}>{event.title}</div>
            </div>
        );
    }

    useEffect(() => {
        // initialise used event date popovers
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');

        const popovers = Array.from(popoverTriggerList).map((el) => {
            return bootstrap.Popover.getInstance(el) || new bootstrap.Popover(el);
        });

        // cleanup
        return () => {
            popovers.forEach(p => p.dispose());
        };
    }, [templateBookings]);

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
                        <Link to="/projects/add" state={{ from: location }} className="btn btn-outline-secondary mx-2 d-flex align-items-center justify-content-center mt-1" style={{ width: "30px", height: "30px" }}><i className="bi bi-plus fs-4"></i></Link>
                    </ul>
                </div>
            </div>
            <div className="row d-flex flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
                <div className="col-9 d-flex flex-column flex-grow-1 pb-2 pb-lg-4 mt-1 position-relative" style={{ minHeight: 0 }}>
                    {eventsLoading && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3" style={{ backgroundColor: "rgba(252, 252, 249, 0.5)" }}>
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    <Calendar
                        style={{ flex: 1 }}
                        currentProjectId={currentProjectId}
                        currentProject={currentProject}
                        keyBookingsRef={keyBookingsRef}
                        events={events}
                        onEventsChanged={handleEventsChanged} // callback to update events
                        onDateClick={handleDateClick}
                        mailtoLink={mailtoLink}
                    />
                </div>
                <div className="col-3 d-none d-lg-flex flex-column flex-grow-1 h-100 mt-2 pe-4" style={{ minHeight: 0 }} id="draggable-events">
                    {currentProjectId !== 0 ? (
                        <>
                            <h4>Key bookings</h4>
                            {!templateBookings ? (
                                <div className="spinner-border mt-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                // bookings template parent container
                                <div className="overflow-auto border d-grid gap-0 row-gap-1 mt-2" ref={keyBookingsRef}>
                                    {templateBookings.map((event) => (
                                        event.used ? (
                                            <div key={event.bookingId} className="d-inline-block" tabIndex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-placement="left" data-bs-content={formatDate(event.start)}>
                                                <DraggableEventComponent event={event} />
                                            </div>
                                        ) : (
                                            <DraggableEventComponent key={event.bookingId} event={event} />
                                        )
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        // next upcoming events
                        <>
                            <h4>Next up</h4>
                            <div className="pt-2 d-flex flex-column" style={{ minHeight: 0 }}>
                                {!nextEventsLoaded ? (
                                    <div className="spinner-border mt-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : nextEvents.length > 0 ? (
                                    <div className="overflow-auto d-grid gap-0 row-gap-2 mt-2 mb-2" style={{ minHeight: 0 }}>
                                        <div className="card px-2 pt-2">
                                            <div className="card-body mb-1">
                                                <div className="">{formatDate(nextEvents[0].start)}</div>
                                            </div>
                                            {nextEvents.map((event) => (
                                                <div key={event.id}>
                                                    <hr className="m-0" />
                                                    <div className="card-body pb-0 mt-2">
                                                        <h5 className="fw-bold">{event.title}</h5>
                                                        <div style={{ color: event.projectColour }}>{event.projectTitle || <em>No associated project</em>}</div>
                                                    </div>
                                                    <div className="card-body d-flex flex-wrap row-gap-2 mb-2">
                                                        <a href={mailtoLink(event)} className="btn btn-secondary btn-sm me-2">Request confirmation</a>
                                                        <a href="#" className="btn btn-danger btn-sm" onClick={() => deleteNextEvent(event.id)}>Delete</a>
                                                    </div>
                                                </div>
                                            ))}
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
            <CustomEventModal projectId={currentProjectId} onEventsChanged={handleEventsChanged} dateStr={selectedDate} />
        </div>
    );
}