import { useProjects } from "../contexts/ProjectsContext";

export default function DeleteModal({ projectId, inArchive }) {

    const { archiveProject, deleteProject } = useProjects();

    return (
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
                        {inArchive ? (
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        ) : (
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => archiveProject(projectId)}>Archive instead</button>
                        )}

                        <button className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteProject(projectId)}>Yes, delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}