import { getArrayOfData, saveData, originUsers } from "./data.js";
import { isLink, changeOnDate } from "./dataVerification.js";

/*Parameters of the sorting function */
let parameters,
    /* parameter selection switch */
    parameterSwitch = true,
    /* the field that was sorted by in the past */
    passedProperty;

export function sorting(obj, property) {
    parameterSwitch = passedProperty !== property ? true : !parameterSwitch;

    obj.sort((a, b) => {
        if (typeof property == "function") {
            a = property(a);
            b = property(b);
        }else{
            a = a[property].toLocaleLowerCase();
            b = b[property].toLocaleLowerCase();
        }

        /* selection of parameters for the function */
        parameters = parameterSwitch ? [a, b] : [b, a];
        return sortTable(...parameters);
    });
    passedProperty = property;

    return obj;
}

/* table data sorting function */
const sortTable = (a, b) => b == a ? 0 : a > b ? 1 : -1;

export async function getOtherData(value) {
    let url = `https://mock-api.shpp.me/${value}/users`;
    return await getArrayOfData(url);
}

export function showFieldsAddingData(e, isClosed) {
    document.querySelector(".lineInputs").classList.toggle("hidden");
    e.target.innerHTML = isClosed ? "Додати" : "Приховати";
}

export async function addEntry(url, data) {
    await saveData(url, data);
    return await getArrayOfData(url);
}

export async function search(list, searchValue) {
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