import { createPortal } from "react-dom";
import { archiveProject, deleteProject } from "/src/utils/ProjectDbUtils";

export default function DeleteModal({projectId}) {
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
                        <button type="button" className="btn btn-secondary" onClick={() => archiveProject(projectId)}>Archive instead</button>
                        <button className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteProject(projectId)}>Yes, delete</button>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")
    );
}