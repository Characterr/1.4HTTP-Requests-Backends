import { Data } from "./data.js";
import { changeOnDate } from "./dataVerification.js";
import { management } from "./config.js";
import { sorting, showFieldsAddingData, search } from "./tableActions.js";

//showFieldsAddingData, addEntry, search
//export async function DataTable(config) 

export let DataTable = id();

function id() {
    let tableId = 0;

    return async (config) => {
        tableId++;
        const parent = config.parent;
        let columns = config.columns;
        let url = config.apiUrl;
        let updateTable;
        let isClosed = false; //true
        let lineInputs = "lineInputs" + tableId;

        let data = new Data(url);
        let users = await data.getArrayOfData(url);
        const table = document.createElement("table");

        showTable();

        let inputSearch = craeteElem("input", "", ["placeholder", "Search"]);
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
                users = await data.getArrayOfData(url);

                updateTable();
            }
        });

        inputSearch.addEventListener("input", async (e) => {
            users = await search(data.originUsers, users, inputSearch.value);
            updateTable();
        });

        buttonAdd.addEventListener("click", (e) => {
            isClosed = !isClosed;
            showFieldsAddingData(e, isClosed, lineInputs);
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
                    tr.append(craeteElem("td", contents));

                    tbody.append(tr);

                    if (j == columns.length - 1) {
                        let td = document.createElement("td");
                        let buttonDel = craeteElem("button", "Видалити", ["class", "buttonDel"]);
                        td.append(buttonDel);
                        tr.append(td);

                        buttonDel.addEventListener("click", async (e) => {
                            users = await data.deleteData(url, elem.id);
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
                let input, tr = document.createElement("tr");
                let td = document.createElement("td");
                let inputs = [];
                const titles = Object.entries(data.kaysAndTypes);


                titles.map((elem, i) => {
                    let title = elem[0];
                    if (i == titles.length - 1) td.setAttribute("colspan", Math.max(title.length, columns.length));
                    input = document.createElement("input");
                    inputs.push(input);
                    input.placeholder = `Введіть ${title}`;

                    let type;
                    switch (title) {
                        case "birthday": type = "date"; break;
                        case "color": type = "color"; break;
                        case "price": type = "number"; break;
                        default: type = "text";
                    }
                    input.setAttribute("type", type);
                    input.setAttribute("name", title);
                    td.append(input);

                    input.addEventListener("keydown", async (e) => {
                        if (e.key == "Enter") {
                            let enteredData, ar = [];

                            inputs.map((input) => {
                                enteredData = input.value;
                                input.style.border = enteredData.length == 0 ? management.errorBorder : management.successBorder;

                                if (enteredData) ar.push(enteredData);
                            });

                            let tagsInput = tr.getElementsByTagName("input");
                            if (ar.length == tagsInput.length) {

                                let dataToServer = {};
                                for (let input of tagsInput) {
                                    let value = data.kaysAndTypes[input.getAttribute("name")] == "number" ? +input.value : input.value;
                                    dataToServer[input.name] = value;
                                }

                                await data.saveData(url, dataToServer);
                                users = await data.getArrayOfData(url);
                                alert("Дані додані до таблиці")
                                updateTable();
                            }
                        }
                    });

                    tr.append(td);
                });

                tr.classList.add(lineInputs);
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
}