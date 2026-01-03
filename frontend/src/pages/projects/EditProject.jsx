import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProjects } from "../../contexts/ProjectsContext";
import DeleteModal from "../../components/DeleteModal";

export default function EditProject() {
    const location = useLocation();
    const { id } = useParams();

    const [project, setProject] = useState(null);

    const { archiveProject, saveProject } = useProjects();

    useEffect(() => {
        fetch(`http://localhost:3001/projects/${id}`)
            .then(res => res.json())
            .then(data => {
                setProject(data);
                setTitle(data.title);
                setAddress(data.address);
                setStartMonth(data.start_month);
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

    const TITLE_MAX_LENGTH = 30;

    const navigate = useNavigate();

    function clickSave(e) {
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

        saveProject(project.id, title, address, startMonth, colour);
        console.log("Saved project");
        navigate("/projects", { state: { updated: true } }); // go back to projects list
    }

    if (!project) return <p>Loading...</p>;
    return (
        <>
            <form className="needs-validation" onSubmit={clickSave} noValidate>
                <h4>Edit project</h4>
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
                <button type="submit" className="btn btn-primary me-2">Save changes</button>
                <button type="button" className="btn btn-secondary me-2" onClick={() => {
                    archiveProject(project.id).then(() => {
                        navigate("/projects", { state: { archived: true } });
                    })
                }}>
                    Archive
                </button>
                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmation">Delete</button>
                {/* todo: the delete modal needs to redirect back to projects list */}
            </form>
            <DeleteModal projectId={project.id} />
        </>
    );
}