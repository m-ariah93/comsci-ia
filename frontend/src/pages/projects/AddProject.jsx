import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProject() {

    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [startMonth, setStartMonth] = useState("");

    const navigate = useNavigate();

    function addProject() {
        // need to add form validation: character limit on title
        fetch("http://localhost:3001/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                address,
                startMonth,
            })
        })
            .then((res) => res.json())
            // .then((newProject) => {
            //     setEvents((prev) => [...prev, { ...newProject, allDay: true }]);
            // });
            .then((data) => {
                console.log("Created project:", data);
                navigate("/projects"); // go back to projects list
            })
            .catch(console.error);
    }

    return (
        <div>
            <h4>New project</h4>
            <label htmlFor="titleInput" className="form-label">Title</label>
            <input type="text" className="form-control" id="titleInput" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label htmlFor="addressInput" className="form-label">Address</label>
            <input type="text" className="form-control" id="addressInput" value={address} onChange={(e) => setAddress(e.target.value)} />
            <label htmlFor="startMonth" className="form-label">Start month:</label>
            <input type="month" className="form-control w-25" id="startMonthInput" value={startMonth} onChange={(e) => setStartMonth(e.target.value)}></input>
            <button type="button" className="btn btn-primary" onClick={addProject}>Create project</button>
        </div>
    );
}