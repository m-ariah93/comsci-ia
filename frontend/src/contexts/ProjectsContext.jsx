import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const location = useLocation();

    const refreshProjects = () => {
        fetch("http://localhost:3001/projects?archived=0") // only unarchived projects
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch(console.error);
    }

    useEffect(() => {
        refreshProjects();
    }, [location]);

    return (
        <ProjectsContext.Provider value={{ projects, refreshProjects }}>
            {children}
        </ProjectsContext.Provider>
    );
}

export function useProjects() {
    return useContext(ProjectsContext);
}
