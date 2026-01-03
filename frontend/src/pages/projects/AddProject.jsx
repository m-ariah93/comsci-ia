import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddProject() {

    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [startMonth, setStartMonth] = useState("");
    const [colour, setColour] = useState("#000000");

    const TITLE_MAX_LENGTH = 30;

    const navigate = useNavigate();
    const location = useLocation();
    const fromLocation = location.state?.from;

    function addProject(e) {
        e.preventDefault();
        const form = e.target;
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        if (!title.trim() || !address.trim() || !startMonth.trim()) {
            form.classList.add("was-validated");
            return;
        }

        if (title.length > TITLE_MAX_LENGTH) {
            form.classList.add("was-validated");
            return;
        }

        fetch("http://localhost:3001/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                address,
                start_month: startMonth,
                colour,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Created project:", data);
                if (fromLocation) {
                    navigate(fromLocation.pathname); // if coming from the calendar page
                } else {
                    navigate("/projects"); // go back to projects list
                }
            })
            .catch(console.error);
    }

    return (
        <form className="needs-validation" onSubmit={addProject} noValidate>
            <h4>New project</h4>
            <label htmlFor="titleInput" className="form-label">Title (max 30 characters)</label>
            <input type="text" maxLength={TITLE_MAX_LENGTH} className="form-control" id="titleInput" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div className="invalid-feedback">
                Please enter a project title.
            </div>

            <label htmlFor="addressInput" className="form-label">Address</label>
            <input type="text" className="form-control" id="addressInput" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <div className="invalid-feedback">
                Please enter an address.
            </div>
            <label htmlFor="startMonthInput" className="form-label">Start month</label>
            <input type="month" className="form-control w-25" id="startMonthInput" value={startMonth} onChange={(e) => setStartMonth(e.target.value)} required></input>
            <div className="invalid-feedback">
                Please select the project's start month.
            </div>
            <label htmlFor="colourInput" className="form-label">Colour (for calendar events)</label>
            <input type="color" className="form-control form-control-color" title="Choose your colour" id="colourInput" value={colour} onChange={(e) => setColour(e.target.value)}></input>
            <button type="submit" className="btn btn-primary">Create project</button>
        </form>
    );
}