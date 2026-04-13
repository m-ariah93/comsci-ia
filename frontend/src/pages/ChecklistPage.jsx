import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProjects } from "../contexts/ProjectsContext";

export default function ChecklistPage() {

    const { activeProjects } = useProjects();
    const [currentProjectId, setCurrentProjectId] = useState(
        activeProjects.length > 0 ? activeProjects[0].id : null
    );

    const [checklist, setChecklist] = useState([]);
    const [checklistLoaded, setChecklistLoaded] = useState(false);

    useEffect(() => {
        if (activeProjects.length > 0) {
            // horizontal instead of vertical scrolling on navbar
            let horizontal = document.getElementById("navTabsHorizontal");
            horizontal.addEventListener('wheel', (e) => {
                e.preventDefault();
                horizontal.scrollLeft += e.deltaY * 0.2;
            });
        }
    }, []);

    useEffect(() => {
        if (!currentProjectId) return;
        setChecklistLoaded(false);
        fetch(`/api/projects/${currentProjectId}/checklist`)
            .then(res => res.json())
            .then(data => {
                setChecklist(data);
                setOrderDates({});
                setPickupDates({});
                setChecklistLoaded(true);
            });
    }, [currentProjectId]);

    const location = useLocation();

    const currentProject = activeProjects.find(p => p.id === currentProjectId);
    const minDate = currentProject ? `${currentProject.start_month}-01` : "";

    function onChecklistChange(itemId, checked) {
        // update local state optimistically before db updates
        setChecklist(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, done: checked ? 1 : 0 } : item
            )
        );

        fetch(`/api/projects/${currentProjectId}/checklist/${itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                done: checked ? 1 : 0,
            })
        });
    }

    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingOrderDateId, setEditingOrderDateId] = useState(null);
    const [editingPickupDateId, setEditingPickupDateId] = useState(null);
    const [orderDates, setOrderDates] = useState({});
    const [pickupDates, setPickupDates] = useState({});

    function saveOrderedDate(itemId, dateValue) {
        // update local state optimistically before db updates
        setChecklist(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, order_date: dateValue } : item
            )
        );

        fetch(`/api/projects/${currentProjectId}/checklist/${itemId}/orderDate`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: dateValue,
            })
        });
    }

    function savePickupDeliveryDate(itemId, dateValue) {
        // update local state optimistically before db updates
        setChecklist(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, pickup_delivery_date: dateValue } : item
            )
        );

        const checklistItem = checklist.find(item => item.id === itemId);
        
        if (dateValue) {
            // create or update pickup/delivery event in calendar
            if (checklistItem) {
                fetch(`/api/projects/${currentProjectId}/checklist/${itemId}/pickupEvent`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: `${checklistItem.title} - pickup/delivery`,
                        date: dateValue,
                    })
                });
            }
        }
        
        // update checklist date
        fetch(`/api/projects/${currentProjectId}/checklist/${itemId}/pickupDate`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: dateValue,
            })
        });
    }

    function saveNote(itemId, noteInput) {
        // update local state optimistically before db updates
        setChecklist(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, note: noteInput } : item
            )
        );

        fetch(`/api/projects/${currentProjectId}/checklistNote/${itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                note: noteInput,
            })
        });
    }

    return (
        <>
            {/* if no projects, show message */}
            {activeProjects.length === 0 ? (
                <div className="row gy-2 pt-3">
                    <div className="col-12">
                        <div className="alert alert-primary text-center mx-auto" role="alert">
                            No projects found :( Create one <Link to="/projects/add" className="alert-link text-reset">here</Link>.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container-fluid d-flex flex-column vh-100 ps-0 pe-0" style={{ minHeight: 0 }}>
                    <div className="d-flex flex-nowrap mt-3 mb-2">
                        <ul className="nav nav-tabs overflow-x-auto overflow-y-hidden flex-nowrap text-nowrap w-100" id="navTabsHorizontal">
                            {activeProjects.map((project) => (
                                <li className="nav-item" key={project.id}>
                                    <a className={`nav-link ${currentProjectId === project.id ? 'active fw-semibold' : ''}`} href="#" style={{ color: project.colour }} onClick={() => setCurrentProjectId(project.id)}>{project.title}</a>
                                </li>
                            ))}
                            <Link to="/projects/add" state={{ from: location }} className="btn btn-outline-secondary mx-2 d-flex align-items-center justify-content-center mt-1" style={{ width: "30px", height: "30px" }}><i className="bi bi-plus fs-4"></i></Link>
                        </ul>
                    </div>
                    <h4 className="py-2">Order checklist</h4>
                    {!checklistLoaded ? (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <ul className="list-group overflow-auto flex-grow-1 pb-3 me-2 me-md-4" style={{ minHeight: 0 }}>
                            {checklist.map((item, i) => (
                                <li key={`check-${i}`} className='list-group-item position-relative d-flex align-items-center py-0'>
                                    <input className="form-check-input me-2 my-3" type="checkbox" value="" id={`check-${i}`} onChange={(e) => onChecklistChange(item.id, e.target.checked)} checked={Boolean(item.done)} />
                                    <label className={`form-check-label ${item.done ? "text-decoration-line-through" : ""}`} htmlFor={`check-${i}`}>{item.title}</label>
                                    <div className="ms-auto d-flex gap-2 flex-nowrap align-items-center z-3">
                                        <div className="d-none d-lg-flex gap-0 column-gap-2 flex-nowrap align-items-center">
                                            <label className={`col-form-label col-form-label-sm z-3 ${!(orderDates[item.id] || item.order_date) ? "note-input" : ""}`} htmlFor={`orderedDate-${i}`}>Ordered:</label>
                                            {editingOrderDateId === item.id ? (
                                                <input
                                                    id={`orderedDate-${i}`}
                                                    type="date"
                                                    className="form-control form-control-sm z-3 text-muted"
                                                    style={{ width: "min-content" }}
                                                    min={minDate}
                                                    value={orderDates[item.id] || item.order_date || ""}
                                                    onChange={(e) => {
                                                        setOrderDates(prev => ({ ...prev, [item.id]: e.target.value }));
                                                        saveOrderedDate(item.id, e.target.value);
                                                    }}
                                                    onBlur={() => setEditingOrderDateId(null)}
                                                    onKeyDown={(e) => e.preventDefault()}
                                                    autoFocus
                                                />
                                            ) : orderDates[item.id] || item.order_date ? (
                                                <input
                                                    id={`orderedDate-${i}`}
                                                    type="date"
                                                    className="form-control form-control-sm border-0 text-muted z-3"
                                                    style={{ width: "min-content", cursor: "pointer" }}
                                                    min={minDate}
                                                    value={orderDates[item.id] || item.order_date || ""}
                                                    onClick={() => setEditingOrderDateId(item.id)}
                                                    onChange={(e) => {
                                                        setOrderDates(prev => ({ ...prev, [item.id]: e.target.value }));
                                                        saveOrderedDate(item.id, e.target.value);
                                                    }}
                                                    onKeyDown={(e) => e.preventDefault()}
                                                />
                                            ) : (
                                                <input
                                                    id={`orderedDate-${i}`}
                                                    type="date"
                                                    className="form-control form-control-sm z-3 note-input text-muted"
                                                    style={{ width: "min-content" }}
                                                    min={minDate}
                                                    value=""
                                                    onChange={(e) => {
                                                        setOrderDates(prev => ({ ...prev, [item.id]: e.target.value }));
                                                        saveOrderedDate(item.id, e.target.value);
                                                    }}
                                                    onFocus={() => setEditingOrderDateId(item.id)}
                                                    onKeyDown={(e) => e.preventDefault()}
                                                />
                                            )}
                                            <label className={`col-form-label col-form-label-sm z-3 ms-2 ${!(pickupDates[item.id] || item.pickup_delivery_date) ? "note-input" : ""}`} htmlFor={`pickupDeliveryDate-${i}`}>Pickup/delivery:</label>
                                            {editingPickupDateId === item.id ? (
                                                <input
                                                    id={`pickupDeliveryDate-${i}`}
                                                    type="date"
                                                    className="form-control form-control-sm z-3 text-muted"
                                                    style={{ width: "min-content" }}
                                                    min={minDate}
                                                    value={pickupDates[item.id] || item.pickup_delivery_date || ""}
                                                    onChange={(e) => {
                                                        setPickupDates(prev => ({ ...prev, [item.id]: e.target.value }));
                                                        savePickupDeliveryDate(item.id, e.target.value);
                                                    }}
                                                    onBlur={() => setEditingPickupDateId(null)}
                                                    onKeyDown={(e) => e.preventDefault()}
                                                    autoFocus
                                                />
                                            ) : pickupDates[item.id] || item.pickup_delivery_date ? (
                                                <input
                                                    id={`pickupDeliveryDate-${i}`}
                                                    type="date"
                                                    className="form-control form-control-sm border-0 text-muted z-3"
                                                    style={{ width: "min-content", cursor: "pointer" }}
                                                    min={minDate}
                                                    value={pickupDates[item.id] || item.pickup_delivery_date || ""}
                                                    onClick={() => setEditingPickupDateId(item.id)}
                                                    onChange={(e) => {
                                                        setPickupDates(prev => ({ ...prev, [item.id]: e.target.value }));
                                                        savePickupDeliveryDate(item.id, e.target.value);
                                                    }}
                                                    onKeyDown={(e) => e.preventDefault()}
                                                />
                                            ) : (
                                                <input
                                                    id={`pickupDeliveryDate-${i}`}
                                                    type="date"
                                                    className="form-control form-control-sm z-3 note-input text-muted"
                                                    style={{ width: "min-content" }}
                                                    min={minDate}
                                                    value=""
                                                    onChange={(e) => {
                                                        setPickupDates(prev => ({ ...prev, [item.id]: e.target.value }));
                                                        savePickupDeliveryDate(item.id, e.target.value);
                                                    }}
                                                    onFocus={() => setEditingPickupDateId(item.id)}
                                                    onKeyDown={(e) => e.preventDefault()}
                                                />
                                            )}
                                        </div>
                                        {editingNoteId === item.id ? (
                                            <input
                                                id={`noteInput-${i}`}
                                                type="text"
                                                defaultValue={item.note || ""}
                                                placeholder="Add note..."
                                                maxLength="30"
                                                autoFocus
                                                className="form-control form-control-sm position-relative z-3 flex-shrink-0"
                                                style={{ width: "150px" }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        const trimmed = e.target.value.trim();
                                                        saveNote(item.id, trimmed);
                                                        setEditingNoteId(null);
                                                        e.target.blur();
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    const trimmed = e.target.value.trim();
                                                    saveNote(item.id, trimmed);
                                                    setEditingNoteId(null);
                                                }}
                                            />
                                        ) : item.note ? (
                                            <input
                                                id={`noteInput-${i}`}
                                                type="text"
                                                className="form-control form-control-sm border-0 mb-0 text-muted position-relative z-3 flex-shrink-0"
                                                style={{ cursor: "pointer", width: "150px" }}
                                                onClick={() => setEditingNoteId(item.id)}
                                                value={item.note}>
                                            </input>
                                        ) : (
                                            <input
                                                id={`noteInput-${i}`}
                                                type="text"
                                                placeholder="Add note..."
                                                maxLength="30"
                                                className="form-control form-control-sm position-relative z-3 note-input flex-shrink-0"
                                                style={{ width: "150px" }}
                                                onFocus={() => setEditingNoteId(item.id)}
                                            />
                                        )}
                                    </div>


                                    <label
                                        htmlFor={`check-${i}`}
                                        className="stretched-link"
                                        style={{ cursor: "pointer" }}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
            )}
        </>
    );
}