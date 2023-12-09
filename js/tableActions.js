import { changeOnDate, isLink } from "./dataVerification.js";

/*Parameters of the sorting function */
let parameters,
    /* parameter selection switch */
    parameterSwitch = true,
    /* the field that was sorted by in the past */
    passedProperty;

export function sorting(obj, property) {
    parameterSwitch = passedProperty !== property ? true : !parameterSwitch;

    obj.sort((a, b) => {

        switch (typeof property) {
            case "function": {
                a = property(a);
                b = property(b);

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

function leaveNumbers(str) {
    return +str.split("")
        .filter(char => !char.search(new RegExp("[0-9]")))
        .join("");
}

/* table data sorting function */
const sortTable = (a, b) => b == a ? 0 : a > b ? 1 : -1;

export function showFieldsAddingData(e, isClosed,lineInputs) {
    document.querySelector("."+lineInputs).classList.toggle("hidden");
    e.target.innerHTML = isClosed ? "Додати" : "Приховати";
}


export async function search(originUsers,list, searchValue) {
    let reg = new RegExp(searchValue, "i");

    list = originUsers.filter(elem => {
        return Object.values(elem).some((value, i) => {
            if (isLink(value)) return false;
            value = changeOnDate(value);
            return value.search(reg) > -1;
        })
    });

    return searchValue.length == 0 ? originUsers : list;
}