import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AppLayout() {
    const { logout } = useAuth();

    return (
        <div className="d-flex align-items-start">
            <div className="nav flex-column nav-pills me-3 mt-2" role="tablist" aria-orientation="vertical">
                <NavLink to="/calendar" end className={({ isActive }) => isActive ? "nav-link mb-1 active" : "nav-link mb-1"}>Calendar</NavLink>
                <NavLink to="/checklist" className={({ isActive }) => isActive ? "nav-link mb-1 active" : "nav-link mb-1"}>Checklist</NavLink>
                <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link mb-1 active" : "nav-link mb-1"}>Projects</NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link mb-1 active" : "nav-link mb-1"}>Settings</NavLink>
                <hr/>
                <button className="nav-link text-start" onClick={logout}>Logout</button>
            </div>

            <div className="tab-content w-100 vh-100" id="v-pills-tabContent" style={{ minWidth: 0 }}>
                <Outlet />
            </div>
        </div>
    );
}
