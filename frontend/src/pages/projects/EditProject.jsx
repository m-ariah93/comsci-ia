import { useLocation, Navigate, useParams } from "react-router-dom";

export default function EditProject() {
    const location = useLocation();
    const { id } = useParams();

    if (!location.state?.fromList) {
        return <Navigate to="/projects" replace />;
    }

    return (
        <div>
            <h4>Edit Project {id}</h4>
            <label for="startmonth">Start month:</label>
            <input type="month" id="startmonth" name="startmonth"></input>
        </div>
    );
}