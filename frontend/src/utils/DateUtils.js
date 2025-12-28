export function formatMonth(value) {
    const date = new Date(value + "-01");
    return date.toLocaleDateString("en-AU", {
        month: "long",
        year: "numeric",
    });
}

export function formatDate(value) {
    const date = new Date(value);
    return date.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export function subtractDay(value) {
    // for end dates which are exclusive in the database but should be shown inclusive

    const date = new Date(value);
    date.setDate(date.getDate() - 1);
    return date;
}