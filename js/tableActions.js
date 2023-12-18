import { changeOnDate, isLink } from "./dataVerification.js";

/*Parameters of the sorting function */
let parameters,
    /* parameter selection switch */
    parameterSwitch = true,
    /* the field that was sorted by in the past */
    passedProperty;

/**
 * Sorting the object by property
 *
 * @param {*} obj Sorting object
 * @param {*} property The property by which we sort the elements of the object
 * @return {*} We return the sorted object
 */
export function sorting(obj, property) {
    /* The first sort is always from smallest to largest */
    parameterSwitch = passedProperty !== property ? true : !parameterSwitch;

    obj.sort((a, b) => {
        switch (typeof property) {
            /* Get a string based on type */
            case "function": {
                a = property(a);
                b = property(b);

                /* Sort by numbers if the string has letters and numbers */
                if (a.search(new RegExp("[0-9]")) > -1) {
                    a = leaveNumbers(a);
                    b = leaveNumbers(b);
                }
                break;
            }
            case "number": {
                a = a[property];
                b = b[property];
                break;
            }
            default: {
                a = a[property].toLocaleLowerCase();
                b = b[property].toLocaleLowerCase();
            }
        }

        /* selection of parameters for the function */
        parameters = parameterSwitch ? [a, b] : [b, a];
        return sortTable(...parameters);
    });
    passedProperty = property;

    return obj;
}
/**
 * Clear the line from letters
 * 
 * @param {*} str Start string
 * @return {*} Returns the numbers contained in the string
 */
function leaveNumbers(str) {
    return +str.split("")
        .filter(char => !char.search(new RegExp("[0-9]")))
        .join("");
}

/* table data sorting function */
const sortTable = (a, b) => b == a ? 0 : a > b ? 1 : -1;

/**
 * Shows or hides fields for adding data
 *
 * @param {*} e The button click event
 * @param {*} isClosed A state indicating whether the input fields are hidden
 * @param {*} lineInputs Fields for adding data
 */
export function showFieldsAddingData(e, isClosed, lineInputs) {
    document.querySelector("." + lineInputs).classList.toggle("hidden");
    e.target.innerHTML = isClosed ? "Додати" : "Приховати";
}

/**
 * Search on all fields of the table
 *
 * @param {*} originUsers The object in which the search takes place
 * @param {*} list A filtered object containing fields that satisfy the search conditions
 * @param {*} searchValue The meaning of what is being sought
 * @return {*} An object with fields that satisfy the search criteria, or the initial object if no search pattern is entered
 */
export async function search(originUsers, list, searchValue) {
    let reg = new RegExp(searchValue, "i");

    list = originUsers.filter(elem => {
        return Object.values(elem).some((value, i) => {
            if (typeof value == "number") value += "";
            if (isLink(value)) return false;

            value = changeOnDate(value);
            return value.search(reg) > -1;
        })
    });

    return searchValue.length == 0 ? originUsers : list;
}