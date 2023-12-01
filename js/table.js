import { getArrayOfData, deleteData } from "./data.js";
import { isLink, changeOnDate } from "./dataVerification.js";
import { management } from "./config.js";
import { sorting, getOtherData, showFieldsAddingData, addEntry, search } from "./tableActions.js";


export async function DataTable(config) {
    const parent = config.parent;
    let columns = config.columns;
    let url = config.apiUrl;
    let updateTable;
    let isClosed = true;

    let users = await getArrayOfData(url);

    //  let t= columns.filter(e=>e.title=="Вік");
    //  let user=await users[0];
    //  console.log(t[0].value(user));

    const table = document.createElement("table");
    let inputSearch;

    showTable();

    inputSearch = craeteElem("input", "", ["placeholder", "Search"]);
    const inputNewData = craeteElem("input", "", ["placeholder", "Введіть nfamily"]);
    const buttonAdd = craeteElem("button", "Додати");
    const wrapper = craeteElem("div", "", ["class", "wrap"]);
    wrapper.append(inputNewData, inputSearch, buttonAdd);
    table.before(wrapper);

    inputNewData.addEventListener("keydown", async (e) => {
        if (e.key == "Enter") {
            let ar = url.split("/");
            ar[ar.length - 2] = inputNewData.value;
            url = ar.join("/");
            users = await getArrayOfData(url);

            updateTable();
        }
    });

    inputSearch.addEventListener("input", async (e) => {
        users = await search(users, inputSearch.value);
        updateTable();
    });

    buttonAdd.addEventListener("click", (e) => {
        isClosed = !isClosed;
        showFieldsAddingData(e, isClosed);
    });

    function showTable() {
        const windowWidth = document.documentElement.clientWidth;
        /* include management.numbering */
        const elemParent = document.querySelector(parent);
        let thead, tbody;
        const values = columns.map(elem => elem.value);
        elemParent.append(table);

        createTable();

        function createTable() {
            tbody = document.createElement("tbody");
            thead = document.createElement("thead");
            table.append(thead, tbody);

            thead.append(createTitles());
            users.map(async (elem, i) => tbody.append(createRow(elem, i)));
            createInputs();
        }

        function createTitles() {
            let tr = document.createElement("tr");
            let caption;

            if (management.numbering) tr.append(craeteElem("th", "№"));

            columns.map((colum, j) => {
                let title = colum.title;
                let value = colum.value;

                caption = craeteElem("th", title);
                caption.addEventListener("click", () => {
                    users = sorting(users, value);
                    updateTable();
                });

                tr.append(caption);
                caption.style.width = (management.columnWidth ?? (windowWidth - management.paddingTable) / values.length) + "px";
            });
            caption.after(craeteElem("th", "Дії"));

            return tr;
        }

        function createRow(elem, i) {
            let tr = document.createElement("tr");

            columns.map((colum, j) => {
                let value = colum.value;

                let contents = (typeof value === "function") ? value(elem) : elem[value];

                /* нумерація */
                if (j == 0 && management.numbering) tr.append(craeteElem("td", i + 1));

                contents = changeOnDate(contents);

                if (isLink(contents)) {
                    let td = document.createElement("td");
                    td.append(craeteElem("img", "", ["src", contents]));
                    tr.append(td);
                } else {
                    tr.append(craeteElem("td", contents));
                }
                tbody.append(tr);

                if (j == columns.length - 1) {
                    let td = document.createElement("td");
                    let buttonDel = craeteElem("button", "Видалити", ["class", "buttonDel"]);
                    td.append(buttonDel);
                    tr.append(td);

                    buttonDel.addEventListener("click", async (e) => {
                        users = await deleteData(url, elem.id);
                        updateTable();
                    });
                }
            });

            return tr;
        }

        updateTable = function updateTable() {
            tbody.remove();
            thead.remove();
            createTable();
        }

        function createInputs() {
            let td, input, tr = document.createElement("tr");
            let inputs = [];

            const titles = columns.map((colum) => {
                return (typeof colum.value == "function") ? null : [colum.title, colum.value];
            });

            if (management.numbering) titles.unshift(null);
            titles.push(null);
            titles.map((title) => {
                td = document.createElement("td");

                if (title != null) {
                    input = document.createElement("input");
                    inputs.push(input);
                    input.placeholder = `Введіть ${title[0]}`;
                    input.setAttribute("name", title[1]);
                    td.append(input);

                    input.addEventListener("keydown", async (e) => {
                        if (e.key == "Enter") {
                            let enteredData, ar = [];

                            inputs.map((input) => {
                                enteredData = input.value;
                                input.style.border = enteredData.length == 0 ? management.errorBorder : management.successBorder;

                                if (enteredData) ar.push(enteredData);
                            });

                            let inp = tr.getElementsByTagName("input");
                            if (ar.length == inp.length) {

                                let dataToServer = {};
                                for (let elem of inp) {
                                    dataToServer[elem.name] = elem.value;
                                }

                                users = await addEntry(url, dataToServer);
                                alert("Дані додані до таблиці")
                                updateTable();
                            }
                        }
                    });
                }
                tr.append(td);
            });

            tr.classList.add("lineInputs");
            if (isClosed) tr.classList.add("hidden");
            tbody.prepend(tr);
        }
    }

    function craeteElem(elem, inscription, attribute) {
        const obj = document.createElement(elem);
        obj.innerHTML = inscription;

        if (attribute != undefined) {
            const nameAttribute = attribute[0];
            const valueAttribute = attribute[1];
            obj.setAttribute(nameAttribute, valueAttribute);
        }

        return obj;
    }
}
