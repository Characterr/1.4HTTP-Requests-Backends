import { getArrayOfData, deleteData } from "./data.js";
import { isLink, changeOnDate } from "./dataVerification.js";
import { management } from "./config.js";
import { sorting, getOtherData, showFieldsAddingData, addEntry, search } from "./tableActions.js";


export async function DataTable(config) {
    const parent = config.parent;
    let columns = config.columns;
    const url = config.apiUrl;
    let updateTable;
    let isClosed = true;

    let users = await getArrayOfData(url);
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
            users = await getOtherData(inputNewData.value);
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
                let contents = elem[value];

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

            const titles = columns.map((colum) => colum.title);
            if (management.numbering) titles.unshift("pusto");
            titles.push("pusto");
            titles.map((title) => {
                td = document.createElement("td");

                if (title != "pusto") {
                    input = document.createElement("input");
                    inputs.push(input);
                    input.placeholder = `Введіть ${title}`;
                    td.append(input);

                    input.addEventListener("keydown", async (e) => {

                        if (e.key == "Enter") {
                            let enteredData, ar = [];

                            inputs.map((input) => {
                                enteredData = input.value;
                                input.style.border = enteredData.length == 0 ? management.errorBorder : management.successBorder;

                                if (enteredData) ar.push(enteredData);
                            });

                            if (ar.length == values.length) {
                                let dataToServer = values.reduce((obj = {}, val, i) => {
                                    obj[val] = ar[i];
                                    return obj;
                                }, {});


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
