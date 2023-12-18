import { Data } from "./data.js";
import { changeOnDate, isLink } from "./dataVerification.js";
import { sorting, showFieldsAddingData, search } from "./tableActions.js";

export let DataTable = id();

function id() {
    /* Table ID */
    let tableId = 0;

    return async (config) => {
        tableId++;
        /* Default Settings */
        let numbering = config.numbering ?? true;
        let errorBorder = config.errorBorder ?? "2px solid red";
        let successBorder = config.successBorder ?? "2px solid green";

        let columnWidth = config.columnWidth;
        let paddingTable = config.paddingTable;
        /* Width of the first and remaining columns */
        let lastCaptionWindth = "116"
        let firstCaptionWindth = "40"

        const parent = config.parent;
        let columns = config.columns;
        let url = config.apiUrl;
        let updateTable;
        let isClosed = false; //true;
        let lineInputs = "lineInputs" + tableId;

        let data = new Data(url);
        let users = await data.getArrayOfData(url);
        const table = document.createElement("table");

        showTable();

        /* Creation of fields for searching and switching to another page,
         as well as buttons for displaying input data for saving*/
        let inputSearch = craeteElem("input", "", ["placeholder", "Search"]);
        inputSearch.addEventListener("input", async (e) => {
            users = await search(data.originUsers, users, inputSearch.value);
            updateTable();
        });

        const inputNewData = craeteElem("input", "", ["placeholder", "Введіть nfamily"]);
        inputNewData.addEventListener("keydown", async (e) => {
            if (e.key == "Enter") {
                let ar = url.split("/");
                ar[ar.length - 2] = inputNewData.value;
                url = ar.join("/");
                users = await data.getArrayOfData(url);

                updateTable();
            }
        });

        const buttonAdd = craeteElem("button", "Додати");
        buttonAdd.addEventListener("click", (e) => {
            isClosed = !isClosed;
            showFieldsAddingData(e, isClosed, lineInputs);
        });

        /* Wrapping and adding to the page */
        const wrapper = craeteElem("div", "", ["class", "wrap"]);
        wrapper.append(inputNewData, inputSearch, buttonAdd);
        table.before(wrapper);


        function showTable() {
            let thead, tbody;
            const windowWidth = document.documentElement.clientWidth;
            const elemParent = document.querySelector(parent);
            elemParent.append(table);

            createTable();

            /**
             * Creation of tables and data storage fields
             */
            function createTable() {
                tbody = document.createElement("tbody");
                thead = document.createElement("thead");
                table.append(thead, tbody);

                thead.append(createTitles());
                users.map(async (elem, i) => tbody.append(createRow(elem, i)));
                createInputs();
            }

            /**
             * Creating table headers and adding handlers when they are clicked
             */
            function createTitles() {
                let tr = document.createElement("tr");
                let caption;
                let firstWinth = 0;

                /* If numbering is enabled */
                if (numbering) {
                    let firstCaption = craeteElem("th", "№");
                    firstCaption.style.width = firstCaptionWindth + "px";
                    tr.append(firstCaption);
                    firstWinth = firstCaptionWindth;
                }

                /* Creating table headers */
                columns.map((colum, j) => {
                    let title = colum.title;
                    let value = colum.value;
                    let notSort = colum.notSort;
                    caption = craeteElem("th", title);

                    /* Sorting when clicking on the title */
                    caption.addEventListener("click", () => {
                        /* turning off sorting by a certain field */
                        if (notSort) return;
                        users = sorting(users, value);
                        updateTable();
                    });

                    tr.append(caption);
                    /* Column width if not specified */
                    caption.style.width = (columnWidth ?? (windowWidth - paddingTable - lastCaptionWindth - firstWinth) / columns.length) + "px";
                });

                /* Creating the last field */
                let lastCaption = craeteElem("th", "Дії");
                lastCaption.style.width = lastCaptionWindth + "px";
                caption.after(lastCaption);

                return tr;
            }

            /**
             * Creating rows and filling them with data
             *
             * @param {*} elem One element from the database
             * @param {*} i Number in order of element
             * @return {*} Returns the filled element of the table (row)
             */
            function createRow(elem, i) {
                let tr = document.createElement("tr");

                columns.map((colum, j) => {
                    let value = colum.value;

                    let contents = (typeof value === "function") ? value(elem) : elem[value];

                    /* Add number if numbering is enabled */
                    if (j == 0 && numbering) tr.append(craeteElem("td", i + 1));

                    contents = changeOnDate(contents);
                    tr.append(craeteElem("td", contents));
                    tbody.append(tr);

                    /* Create the last table cell and delete button in it */
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

            /**
             * Update the table after
             */
            updateTable = function updateTable() {
                tbody.remove();
                thead.remove();
                createTable();
            }

            /**
             * Creation of data input fields for saving them to the server
             */
            function createInputs() {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                /* Array of intuts for mandatory filling */
                let reqInputs = [];

                columns.map((elem, i) => {
                    let fildInput = elem.input;

                    /* Combining the first cell of the table with all the following */
                    if (i == 0) td.setAttribute("colspan", columns.length + 2);
                    /* Якщо відсутнє поле інпут в елемента  */
                    if (!fildInput) return elem;

                    if (fildInput.length > 0) {
                        /* multiple inputs per field */
                        fildInput.map(fildInput => createInput(fildInput));
                    } else {
                        /* one input per field */
                        createInput(fildInput)
                    }
                    tr.append(td);

                    function createInput(fildInput) {
                        let label, select, input = document.createElement("input");
                        let required = fildInput.required ?? true;

                        if (fildInput.type == "select") {
                            label = craeteElem("label", fildInput.label + " : ");
                            td.append(label);

                            select = craeteElem("select");
                            select.label = input.label;
                            select.setAttribute("name", fildInput.name);

                            fildInput.options.map(currency => {
                                let option = craeteElem("option", currency, ["value", currency]);
                                select.append(option);
                            })
                            input = select;
                        } else {
                            /* Adding a label or placeholder  */
                            if (fildInput.type == "date") {
                                td.append(craeteElem("label", fildInput.label + " : "));
                            } else {
                                input.placeholder = `Введіть поле ${elem.title}`;
                            }

                            input.name = fildInput.name ? fildInput.name : elem.value;
                            input.type = fildInput.type;
                        }
                        td.append(input);
                        if (required) reqInputs.push(input);

                        input.addEventListener("keydown", async (e) => {
                            if (e.key != "Enter") return;
                            /* An error that interrupts the execution of sending data  */
                            let isError = false;

                            reqInputs.map((input) => {
                                /* Verification of mandatory fields */
                                if (input.value.length == 0) {
                                    input.style.border = errorBorder;
                                    isError = true;
                                } else {
                                    input.style.border = successBorder;
                                }
                            });
                            if (isError) return;

                            let dataToServer = {};
                            let allInputs = tr.getElementsByTagName("input");
                            let selects = tr.getElementsByTagName("select");

                            /* Checking all fields for correctness of data and formatting of the required types */
                            for (let input of [...allInputs, ...selects]) {
                                let value = input.value;
                                switch (input.type) {
                                    case "number": value = +value; break;
                                    case "date": value = new Date(value); break;
                                    case "url": {
                                        if (!isLink(value)) {
                                            input.value = "";
                                            input.placeholder = "Введіть url типу http://...";
                                            input.style.border = errorBorder;

                                            isError = true;
                                        }
                                        break;
                                    }
                                }
                                /* The object sent to the server for storage */
                                dataToServer[input.name] = value;
                            }
                            if (isError) return;

                            if (await data.saveData(url, dataToServer)) {
                                users = await data.getArrayOfData(url);
                                alert("Дані додані до таблиці")
                                updateTable();
                            } else {
                                alert("Помилка збереження даних")
                            }
                        });
                    }
                });

                tr.classList.add(lineInputs);
                if (isClosed) tr.classList.add("hidden");
                tbody.prepend(tr);
            }
        }

        /**
         * Create an element, fill it with content and add an attribute
         *
         * @param {*} elem HTML element to be created (string)
         * @param {*} inscription The content of the element
         * @param {*} attribute An array of two values. The first element of the array is an attribute, and the second is its value
         * @return {*} Returns the created element
         */
        function craeteElem(elem, inscription, attribute) {
            const obj = document.createElement(elem);
            obj.innerHTML = inscription || "";

            if (attribute != undefined) {
                const nameAttribute = attribute[0];
                const valueAttribute = attribute[1];
                obj.setAttribute(nameAttribute, valueAttribute);
            }

            return obj;
        }
    }
}