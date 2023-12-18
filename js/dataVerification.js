/**
 * Tests whether a string matches a date string of type 0000-00-00T00:00:00.000Z.
 * If matches returns the date corresponding to this string, otherwise returns the starting string
 * 
 * @param {*} str The line that needs to be checked
 * @return {*} Returns the date corresponding to this (0000-00-00T00:00:00.000Z), otherwise returns the starting string
 */
export function changeOnDate(str) {
    if (str.length != 24 && str[str.length - 1] != "Z") return str;

    let date = new Date(str);
    return (date == "Invalid Date") ? str : date.toLocaleDateString();
}

/**
 * @param {*} str A string of type string
 * @return {*} True if the line contains a link and false if it does not
 */
export function isLink(str) {
    return typeof str == "string" && str.includes("http");
}
