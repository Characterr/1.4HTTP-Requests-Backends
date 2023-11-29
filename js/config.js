export const config1 = {
  parent: '#usersTable',
  columns: [
    { title: 'Ім’я', value: 'name' },
    { title: 'Прізвище', value: 'surname' },
    { title: 'Фото', value: 'avatar' },
    { title: 'День народження', value: 'birthday' },
  ],
  apiUrl: "https://mock-api.shpp.me/ysoroka/users"
};

export const management = {
  numbering: true,
  columnWidth: undefined,
  /* sum of left and right padding */
  paddingTable: 160,
  errorBorder: "2px solid red",
  successBorder: "2px solid green",

};



