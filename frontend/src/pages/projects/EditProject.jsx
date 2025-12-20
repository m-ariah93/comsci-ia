import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { archiveProject } from "/src/utils/ProjectDbUtils";

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
            });
    }, [id]);

    if (!location.state?.fromList) {
        return <Navigate to="/projects" replace />;
    }

    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [startMonth, setStartMonth] = useState("");

    const navigate = useNavigate();

    function saveProject() {
        // need to add form validation: character limit on title
        fetch(`http://localhost:3001/projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                address,
                startMonth,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Saved project:", data);
                navigate("/projects", {state: {updated: true}}); // go back to projects list
            })
            .catch(console.error);
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
            <button type="button" className="btn btn-primary" onClick={saveProject}>Save changes</button>
            <button type="button" className="btn btn-secondary" onClick={() => archiveProject(project.id)}>Archive</button>
            <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmation">Delete</button>

            <DeleteModal />
        </div>
    );
}

function DeleteModal() {
    return createPortal(
        <div className="modal fade" id="deleteConfirmation" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Wait!</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                        />
                    </div>
                    <div className="modal-body">
                        Are you sure you want to delete this project?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => archiveProject(project.id)}>Archive instead</button>
                        <button className="btn btn-danger">Yes, delete</button>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")
    );
}