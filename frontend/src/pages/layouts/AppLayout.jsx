import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AppLayout() {
    const { logout } = useAuth();

    return (
        <div className="d-flex align-items-start vh-100">
            <div className="h-100 me-3" style={{ backgroundColor: "#dbe5e8" }}>
            <div className="nav flex-column nav-pills mx-3 pt-3 gap-2" role="tablist" aria-orientation="vertical">
                <NavLink to="/calendar" end className={({ isActive }) => isActive ? "nav-link text-center active" : "nav-link text-center"}>Calendar</NavLink>
                <NavLink to="/checklist" className={({ isActive }) => isActive ? "nav-link text-center active" : "nav-link text-center"}>Checklist</NavLink>
                <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link text-center active" : "nav-link text-center"}>Projects</NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link text-center active" : "nav-link text-center"}>Settings</NavLink>
                <hr />
                <button className="nav-link text-center" onClick={logout}>Logout</button>
            </div>
            </div>

            <div className="tab-content w-100 flex-grow-1 d-flex flex-column vh-100" id="v-pills-tabContent" style={{ minWidth: 0 }}>
                <Outlet />
            </div>
        </div>
    );
}
