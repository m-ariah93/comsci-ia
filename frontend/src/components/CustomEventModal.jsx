import { useState } from "react";

export default function CustomEventModal() {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const NAME_MAX_LENGTH = 30;

    function createEvent() {
        // write this
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
                        <form>
                            <div className="row">
                                <div className="col-12">
                                    <label htmlFor="nameInput" className="form-label">Event name (max 30 characters)</label>
                                    <input type="text" maxLength={NAME_MAX_LENGTH} className="form-control mb-3" id="nameInput" value={name} onChange={(e) => setName(e.target.value)} required />
                                    <div className="invalid-feedback">
                                        Please enter an event name.
                                    </div>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="startDateInput" className="form-label">Start date</label>
                                    <input type="date" className="form-control mb-3 w-100" style={{ width: 200 }} id="startDateInput" value={startDate} onChange={(e) => setStartDate(e.target.value)} required></input>
                                    <div className="invalid-feedback">
                                        Please select a start date.
                                    </div>
                                </div>

                                <div className="col-6">
                                    <label htmlFor="endDateInput" className="form-label">End date</label>
                                    <input type="date" className="form-control mb-3 w-100" style={{ width: 200 }} id="endDateInput" data-bs-toggle="tooltip" data-bs-placement="top" title="Leave blank for one-day event." value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                                </div>

                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary" onClick={createEvent}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
