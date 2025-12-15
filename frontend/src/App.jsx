import CalendarPage from "./pages/CalendarPage";
import ProjectsPage from "./pages/ProjectsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>

      <div className="d-flex align-items-start fixed-top">
          <div className="nav flex-column nav-pills me-3 flex-shrink-0" role="tablist" aria-orientation="vertical">
            <NavLink to="/calendar" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Calendar</NavLink>
            <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Projects</NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Settings</NavLink>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Logout</NavLink>
          </div>

          <div className="tab-content flex-grow-1 w-100" id="v-pills-tabContent" style={{minWidth: 0}}>
            <Routes>
              <Route path="/" element={<Navigate to="/calendar" replace />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
      </div>
        
    </BrowserRouter>  
      
  );
}

export default App;
