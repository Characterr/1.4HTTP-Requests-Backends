export function isLink(str) {
    if(str==undefined) return false;
    return str.includes("http");
}

export function changeOnDate(str) {
    let date = new Date(str);
    return (date == "Invalid Date") ? str : date.toLocaleDateString();
}