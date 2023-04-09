// const moment = require("moment");

const checkNull = (value) => (value == "" ? true : false);

const checkSameString = (str1, str2) => str1 === str2;

const checkEmail = (emailEl) => {
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return validRegex.test(emailEl.value);
};

const checkLength = (str) => str.length;

const dateFormation = () =>
  new Date().getFullYear() +
  "-" +
  parseInt(new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();

const clearForm = (el) => {
  el.forEach((el) => (el.innerHTML = null));
};

const formatDate = (date) => {
  return date.toString();
};

export {
  checkNull,
  checkSameString,
  checkEmail,
  checkLength,
  dateFormation,
  clearForm,
  formatDate,
};
