import {
  checkNull,
  checkSameString,
  checkEmail,
  checkLength,
} from "./valueCheck.js";

import {
  showErrorMsg,
  suggestionErrorEl,
  removeSuggestionErrorEl,
  navigateToPage,
} from "./domlib.js";

const verifyInputValue = (elArr, type) => {
  const passwordEl = elArr.find((el) => el.placeholder == "Password");
  const emailEl = elArr.find((el) => el.placeholder == "Email");

  const emptyInput = elArr.find((el) => checkNull(el.value));

  if (emptyInput) {
    const id = "error_" + emptyInput.placeholder;
    const suggestionEl = suggestionErrorEl(
      id,
      `${emptyInput.placeholder} cannot be blank`
    );

    showErrorMsg(emptyInput, suggestionEl);

    removeSuggestionErrorEl(emptyInput, suggestionEl);

    emptyInput.innerHTML = "";
    emptyInput.focus();

    return false;
  } else if (!checkEmail(emailEl)) {
    const invalidEmail = suggestionErrorEl(
      "invalid_email",
      "Invalid Email Address"
    );
    showErrorMsg(emailEl, invalidEmail);

    removeSuggestionErrorEl(emailEl, invalidEmail);

    emailEl.innerHTML = "";
    emailEl.focus();

    return false;
  } else if (checkLength(passwordEl.value) <= 5) {
    const lessPassword = suggestionErrorEl(
      "less_password",
      "Password length cannot be less than 6"
    );
    showErrorMsg(passwordEl, lessPassword);

    removeSuggestionErrorEl(passwordEl, lessPassword);

    passwordEl.innerHTML = "";
    passwordEl.focus();

    return false;
  }

  if (type == "register") {
    const confirmPasswordEl = elArr.find(
      (el) => el.placeholder == "Confirm Password"
    );

    if (!_verifyPasswordS(passwordEl.value, confirmPasswordEl.value)) {
      const passwordNotMatchedEl = suggestionErrorEl(
        `mismatch_password`,
        `Confirm Password does not match Password value`
      );
      showErrorMsg(confirmPasswordEl, passwordNotMatchedEl);

      removeSuggestionErrorEl(confirmPasswordEl, passwordNotMatchedEl);

      confirmPasswordEl.innerHTML = "";
      confirmPasswordEl.focus();

      return false;
    }
  }

  return true;
};

const _verifyPasswordS = (passwordVal, confirmPasswordVal) =>
  checkSameString(passwordVal, confirmPasswordVal);

const registerCall = async (inputElArr) => {
  const inptVal = {
    username: inputElArr[0],
    email: inputElArr[1],
    password: inputElArr[2],
  };
  try {
    const res = await fetch(`http://localhost:4000/auth/register`, {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inptVal),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const loginCall = async (elArr) => {
  const loginObj = {
    email: elArr[0],
    password: elArr[1],
  };
  try {
    const data = await fetch(`http://localhost:4000/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginObj),
    });

    const result = await data.json();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const logoutUser = async () => {
  const username = localStorage.getItem("username");

  if (!username) return false;
  try {
    const res = await fetch("http://localhost:4000/auth/logout", {
      method: "GET",
    });

    navigateToPage(res.url);
  } catch (error) {
    console.log(error);
  }
};

export { verifyInputValue, registerCall, loginCall, logoutUser };
