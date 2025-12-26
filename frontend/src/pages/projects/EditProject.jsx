import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { archiveProject, saveProject } from "/src/utils/ProjectDbUtils";
import DeleteModal from "../../components/DeleteModal";

export default function EditProject() {
    const location = useLocation();
    const { id } = useParams();

    const [project, setProject] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/projects/${id}`)
            .then(res => res.json())
            .then(data => {
                setProject(data);
                setTitle(data.title);
                setAddress(data.address);
                setStartMonth(data.startMonth);
                setColour(data.colour);
            });
    }, [id]);

    if (!location.state?.fromList) {
        return <Navigate to="/projects" replace />;
    }

    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [startMonth, setStartMonth] = useState("");
    const [colour, setColour] = useState("");

    const navigate = useNavigate();

    function clickSave() {
        saveProject(project.id, title, address, startMonth, colour);
        console.log("Saved project");
        navigate("/projects", { state: { updated: true } }); // go back to projects list
    }

    if (!project) return <p>Loading...</p>;
    return (
        <div>
            <h4>Edit Project {id}</h4>
            <label htmlFor="titleInput" className="form-label">Title</label>
            <input type="text" className="form-control" id="titleInput" defaultValue={project.title} onChange={(e) => setTitle(e.target.value)} />
            <label htmlFor="addressInput" className="form-label">Address</label>
            <input type="text" className="form-control" id="addressInput" defaultValue={project.address} onChange={(e) => setAddress(e.target.value)} />
            <label htmlFor="startmonth" className="form-label">Start month:</label>
            <input type="month" className="form-control w-25" id="startmonth" defaultValue={project.startMonth} onChange={(e) => setStartMonth(e.target.value)} ></input>
            <label htmlFor="colourInput" className="form-label">Colour (for calendar events)</label>
            <input type="color" className="form-control form-control-color" title="Choose your colour" id="colourInput" defaultValue={project.colour} onChange={(e) => setColour(e.target.value)}></input>
            <button type="button" className="btn btn-primary" onClick={clickSave}>Save changes</button>
            <button type="button" className="btn btn-secondary" onClick={() => archiveProject(project.id)}>Archive</button>
            <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmation">Delete</button>

            <DeleteModal projectId={project.id} />
        </div>
    );
}