export function sortProjects(projects, sortChoice) {
    const sorted = [...projects];

    sorted.sort((a, b) => {
        switch (sortChoice) {
            case "Start, latest":
                return new Date(b.startMonth) - new Date(a.startMonth);

            case "Start, earliest":
                return new Date(a.startMonth) - new Date(b.startMonth);

            case "Name, A-Z":
                return a.title.localeCompare(b.title);

            case "Name, Z-A":
                return b.title.localeCompare(a.title);

            default:
                return 0;
        }
    });

    return sorted;
}
