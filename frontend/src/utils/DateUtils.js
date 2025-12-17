export function formatMonth(value) {
    const date = new Date(value + "-01");
    return date.toLocaleDateString("en-AU", {
        month: "long",
        year: "numeric",
    });
}