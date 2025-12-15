import CalendarPage from "./pages/CalendarPage";
import ProjectsPage from "./pages/ProjectsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>

      <div className="d-flex align-items-start">
        <div className="nav flex-column nav-pills me-3" role="tablist" aria-orientation="vertical">
          <NavLink to="/calendar" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Calendar</NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Projects</NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Settings</NavLink>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Logout</NavLink>
        </div>
        {/* <div class="tab-content" id="v-pills-tabContent">
          <div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab" tabindex="0">...</div>
          <div class="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabindex="0">...</div>
          <div class="tab-pane fade" id="v-pills-disabled" role="tabpanel" aria-labelledby="v-pills-disabled-tab" tabindex="0">...</div>
          <div class="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab" tabindex="0">...</div>
          <div class="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab" tabindex="0">...</div>
        </div>  */}
        <div className="tab-content" id="v-pills-tabContent">
          {/* <CalendarPage /> */}
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
