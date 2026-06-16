import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user } = useAuth(); // check if user is logged in

    if (!user) { // if user is not authenticated
        return <Navigate to="/" replace />; // redirect to login page
    }

    return children; // if authenticated, return the requested page contents
}
