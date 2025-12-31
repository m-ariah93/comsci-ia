export function sortProjects(projects, sortChoice) {
    const sorted = [...projects];

    sorted.sort((a, b) => {
        switch (sortChoice) {
            case "Start, latest":
                return new Date(b.start_month) - new Date(a.start_month);

            case "Start, earliest":
                return new Date(a.start_month) - new Date(b.start_month);

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
