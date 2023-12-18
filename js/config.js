export const config1 = {
  parent: '#usersTable',
  columns: [
    { title: 'Ім’я', value: 'name', input: { type: 'text' } },
    { title: 'Прізвище', value: 'surname', input: { type: 'text' } },
    { title: 'Вік', value: (user) => getAge(user.birthday), input: { type: 'date', label: 'День народження', name: "birthday" } },
    { title: 'День народження', value: 'birthday' },
    {
      title: 'Фото', value: (user) => `<img crossorigin="anonymous" src="${user.avatar}" alt="${user.name} ${user.surname}"/>`,
      input: { type: 'url', name: 'avatar' },
      /* disable sorting by field */
      notSort: true,
    },
  ],
  apiUrl: "https://mock-api.shpp.me/ysoroka/users",

  /* not necessarily propertyes*/
  /* default true */
  numbering: false,
  /* field empty = full width, or pixels */
  columnWidth: 200,
  /* sum of left and right padding */
  paddingTable: 0,
  /* defoult "2px solid red" */
  errorBorder: undefined,
  /* defoult "2px solid green" */
  successBorder: undefined,
};

export const config2 = {
  parent: '#productsTable',
  columns: [
    { title: 'Назва', value: 'title', input: { type: 'text' } },
    {
      title: 'Ціна',
      value: (product) => `${product.price} ${product.currency}`,
      input: [
        { type: 'number', name: 'price', label: 'Ціна' },
        { type: 'select', name: 'currency', label: 'Валюта', options: ['$', '€', '₴'], required: false }
      ]
    },
    {
      title: 'Колір',
      value: (product) => getColorLabel(product.color),
      input: { type: 'color', name: 'color' },
      notSort: true
    },
  ],
  apiUrl: "https://mock-api.shpp.me/ysoroka/products",

  numbering: true,
  columnWidth: undefined,
  paddingTable: 0,
  errorBorder: "2px solid red",
  successBorder: "2px solid green",
};

/**
 * @param {*} birthday Date string of type: (0000-00-00T00:00:00.000Z)
 * @return {*}  Number of years to date
 */
function getAge(birthday) {
  let minute = 1000 * 60;
  let year = 365 * 24 * minute * 60;
  let currentDate = new Date();

  let difference = currentDate - new Date(birthday) - currentDate.getTimezoneOffset() * minute;
  let years = difference / year | 0;
  years += (difference / year | 0) == 1 ? " рік" : " років";

  return years;
}

/**
 * @param {*} color Color in any format
 * @return {*} Html string in which the background of the block has a color and is assigned the "color" class.
 */
function getColorLabel(color) {
  return `<div class="color" style="background: ${color}"></div>`;
}

