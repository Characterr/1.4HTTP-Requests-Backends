export const config1 = {
  parent: '#usersTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Фото', value: 'avatar' },
    { title: 'Вік', value: (user) => getAge(user.birthday) },
    { title: 'День народження', value: 'birthday' },

    //  {title: 'Фото', value: (user) => `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>` 
  ],
  apiUrl: "https://mock-api.shpp.me/ysoroka/users"
};

// export const config2 = {
//   parent: '#productsTable',
//   columns: [
//     {title: 'Назва', value: 'title'},
//    // {title: 'Ціна', value: (product) => `${product.price} ${product.currency}`},
//   //  {title: 'Колір', value: (product) => getColorLabel(product.color)}, // функцію getColorLabel вам потрібно створити
//   ],
//   apiUrl: "https://mock-api.shpp.me/<nsurname>/products"
// };

export const management = {
  numbering: true,
  columnWidth: undefined,
  /* sum of left and right padding */
  paddingTable: 160,
  errorBorder: "2px solid red",
  successBorder: "2px solid green",

};


function getAge(birthday) {
  let minute = 1000 * 60;
  let year = 365 * 24 * minute * 60;
  let currentDate = new Date();

  let difference = currentDate - new Date(birthday) - currentDate.getTimezoneOffset() * minute;
  let years = difference / year | 0;
  years += difference / year | 0 == 1 ? " рік" : " років";

  return years;
}

