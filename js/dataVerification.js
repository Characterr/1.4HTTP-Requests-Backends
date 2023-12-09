export function changeOnDate(str) {
    let date = new Date(str);
    return (date == "Invalid Date") ? str : date.toLocaleDateString();
}

export function isLink(str) {
    if(str==undefined) return false;

    if(typeof str=="number") return str;
    return str.includes("http");
}