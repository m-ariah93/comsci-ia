export function filterProjects(projects, queryInput) {

    if (!queryInput) return projects;
    const query = queryInput.toLowerCase().trim();

    const filteredProjects = projects.filter((project) => {
        return (
            project.title.toLowerCase().includes(query) ||
            project.address.toLowerCase().includes(query)
        );
    });

    return filteredProjects;
}