"use strict"
const config1 = {
  parent: '#usersTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Фото', value: 'avatar' },
    { title: 'День народження', value: 'birthday' },
  ],
  apiUrl: "https://mock-api.shpp.me/xsoroka/users"
};

DataTable(config1);

async function DataTable(config) {
  let apiUrl = config1.apiUrl;
  let users = await getArrayOfData(apiUrl);
  let updateTable;

  const table = document.createElement("table");

  showTable();
  showDataFromInput();

  async function getArrayOfData(url) {
    let data = await getData(url, {});
    let identifiers = Object.keys(data);

    return identifiers.map(identifier => {
      data[identifier].id = identifier;
      return data[identifier];
    });
  }

  async function getData(url, options) {
    const response = await fetch(url, options);
    const resJson = await response.json();
    return resJson.data;
  }

  function showTable() {
    /* include numbering */
    let numbering = true;
    const columns = config.columns;
    const parent = document.querySelector(config.parent);
    let thead, tbody;
    const values = columns.map(elem => elem.value);
    let open = false;
    /* sum of left and right padding */
    let paddingTable = 160;
    let windowWidth = document.documentElement.clientWidth;
    /*Parameters of the sorting function */
    let parameters,
      /* the field by which the sorting takes place */
      property,
      /* parameter selection switch */
      parameterSwitch = true,
      /* the field that was sorted by in the past */
      passedProperty,
      /* table data sorting function */
      sortTable = (a, b) => b == a ? 0 : a > b ? 1 : -1;

    parent.append(table);
    createTable();

    function createTable() {
      thead = document.createElement("thead");
      tbody = document.createElement("tbody");
      table.append(thead, tbody);

      users.map((elem, i) => {
        createRowTable(elem, i);
      });
      createInputs();
    }

    /**
     * Creating and filling the table
     *
     * @param {*} tagInTr Table tag that is placed in the line (tr)
     * @param {*} i Row number
     * @param {*} obj The object from which the data is taken
     * @param {*} strField The field of the object from which the data is taken
     * @return {*} Filled line (html element)
     */
    function createRowTable(elem, i) {
      let tr = document.createElement("tr");

      columns.map((colum, j) => {
        let title = colum.title;
        let value = colum.value;
        let contents = elem[value];

        let thOrTd = (i == 0) ? "th" : "td";
        /* нумерація */
        if (j == 0 && numbering) {
          let firstTag = document.createElement(thOrTd);
          firstTag.innerHTML = i == 0 ? "№" : i;
          tr.append(firstTag);
        }

        if (i == 0) {
          let caption = document.createElement("th");
          caption.innerHTML = title;
          caption.addEventListener("click", () => { sorting(value) });
          tr.append(caption);
          thead.append(tr);
          caption.style.width = (windowWidth - paddingTable) / values.length + "px";
        } else {
          let tag = document.createElement(thOrTd);
          let date = new Date(contents);
          contents = (date == "Invalid Date") ? contents : date.toLocaleDateString();

          if (contents.includes("http")) {
            let img = document.createElement("img");
            img.src = contents;
            // tadsTd[j + startnumbering].innerHTML = "";
            tag.append(img);
            tr.append(tag);

          } else {
            tag.innerHTML = contents;
            tr.append(tag);
          }

          tbody.append(tr);
        }

        if (j == columns.length - 1) {
          let buttonDel = document.createElement("button");
          let tag = document.createElement(thOrTd);
          buttonDel.innerHTML = (i == 0 && !open) ? "Додати" : "X";
          tag.append(buttonDel);
          tr.append(tag);


          let clickButton = i == 0 ? () => { showInputs(buttonDel) } : () => { deleteData(elem.id); }
          buttonDel.addEventListener("click", (e) => {
            clickButton();
          });

        }
      });
    }

    function sorting(property) {
      parameterSwitch = passedProperty !== property ? true : !parameterSwitch;

      users = users.sort((a, b) => {
        a = a[property];
        b = b[property];
        /* selection of parameters for the function */
        parameters = parameterSwitch ? [a, b] : [b, a];
        return sortTable(...parameters);
      });
      passedProperty = property;

      updateTable();
    }

    async function deleteData(id) {
      let urldel = `${apiUrl}/${id}`;
      await fetch(urldel, { method: "Delete" });

      users = await getArrayOfData(apiUrl);
      updateTable();
    }

    updateTable = function updateTable() {
      tbody.remove();
      thead.remove();
      createTable();
    }

    function showInputs(buttonDel) {
      document.querySelector(".lineInputs").classList.toggle("hidden");
      open = !open;
      buttonDel.innerHTML = open ? "X" : "Додати";
    }

    function createInputs() {
      let td, input, tr = document.createElement("tr");
      let inputs = [];

      let titles = columns.map((colum) => colum.title);
      if (numbering) titles.unshift("pusto");
      titles.push("pusto");
      titles.map((e) => {
        td = document.createElement("td");

        if (e != "pusto") {
          input = document.createElement("input");
          inputs.push(input);
          input.placeholder = `Введіть ${e}`;

          input.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
              addEntry(inputs);
            }
          });
          td.append(input);
        }

        tr.append(td);

      });


      tr.classList.add("lineInputs");
      if (!open) tr.classList.add("hidden");
      tbody.prepend(tr);
    }

    async function addEntry(inputs) {
      let enteredData;
      let ar = [];

      inputs.map((input) => {
        enteredData = input.value;
        input.style.border = enteredData == "" ? "2px solid red" : "2px solid green";

        if (enteredData) ar.push(enteredData);
      });

      if (ar.length == values.length) {
        let dataToServer = values.reduce((obj = {}, val, i) => {
          obj[val] = ar[i];
          return obj;
        }, {});
        saveData(apiUrl, dataToServer);
        alert("Дані додані до таблиці")

        users = await getArrayOfData(apiUrl);
        updateTable();
      }

    }

    async function saveData(url, data) {
      let options = {
        method: "POST",
        body: JSON.stringify(data),
      };
      await fetch(url, options);
    }
  }

  async function showDataFromInput() {
    let input = document.createElement("input");
    input.classList.add("dataInput");
    input.placeholder = "Введіть nfamily"

    input.addEventListener("keydown", (e) => {
      if (e.key == "Enter") getDataFromInput(input.value);
    });

    table.before(input);
  }

  async function getDataFromInput(nFamily) {
    let url = `https://mock-api.shpp.me/${nFamily}/users`;
    users = await getArrayOfData(url);
    updateTable();
  }

}
