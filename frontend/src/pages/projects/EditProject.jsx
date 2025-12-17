import { useLocation, Navigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";

export default function EditProject() {
    const location = useLocation();
    const { id } = useParams();

    if (!location.state?.fromList) {
        return <Navigate to="/projects" replace />;
    }

    return (
        <div>
            <h4>Edit Project {id}</h4>
            <label for="titleInput" className="form-label">Title</label>
            <input type="text" className="form-control" id="titleInput" />
            <label for="addressInput" className="form-label">Address</label>
            <input type="text" className="form-control" id="addressInput" />
            <label for="startmonth" className="form-label">Start month:</label>
            <input type="month" className="form-control w-25" id="startmonth"></input>
            <button type="button" className="btn btn-primary">Save changes</button>
            <button type="button" className="btn btn-secondary">Archive</button>
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
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}