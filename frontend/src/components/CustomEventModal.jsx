import { useState } from "react";

export default function CustomEventModal({ projectId }) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const NAME_MAX_LENGTH = 30;

    function createEvent(e) {

        e.preventDefault();
        const form = e.target;
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        if (!name.trim() || !startDate.trim()) {
            form.classList.add("was-validated");
            return;
        }

        if (name.length > NAME_MAX_LENGTH) {
            form.classList.add("was-validated");
            return;
        }
        
        fetch("http://localhost:3001/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: name,
                start: startDate,
                end: endDate || null,
                project_id: projectId === 0 ? null : projectId,
                template_id: null
            })
        })
            .then((res) => res.json())
            // .then(handleEventsChanged)
            .then(console.log(`event added, title: ${name}, project id: ${projectId}`));
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("customEventModal")
        );
        modal.hide();
        setName("");
        setStartDate("");
        setEndDate("");
        form.classList.remove("was-validated");
    }

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    return (
        <div className="modal fade" id="customEventModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">New custom event</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body container">
                        <form className="needs-validation" onSubmit={createEvent} noValidate>
                            <div className="row gy-3">
                                <div className="col-12">
                                    <label htmlFor="nameInput" className="form-label">Event name (max 30 characters)</label>
                                    <input type="text" maxLength={NAME_MAX_LENGTH} className="form-control" id="nameInput" value={name} onChange={(e) => setName(e.target.value)} required />
                                    <div className="invalid-feedback">
                                        Please enter an event name.
                                    </div>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="startDateInput" className="form-label">Start date</label>
                                    <input type="date" className="form-control w-100" style={{ width: 200 }} id="startDateInput" value={startDate} onChange={(e) => setStartDate(e.target.value)} required></input>
                                    <div className="invalid-feedback mb-3">
                                        Please select a start date.
                                    </div>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="endDateInput" className="form-label">End date</label>
                                    <input type="date" className="form-control mb-3 w-100" style={{ width: 200 }} id="endDateInput" data-bs-toggle="tooltip" data-bs-placement="top" title="Leave blank for one-day event." value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                                </div>

                            </div>
                            <div className="row">
                                <div className="modal-footer pb-0">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Create</button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
