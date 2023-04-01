import { verifyInputValue, registerCall, loginCall } from "./util/auth.js";
import { createPopup, hidePopup, navigateToPage } from "./util/domlib.js";
import { navigateToUrl } from "./util/routerCalls.js";

const formEl = document.getElementById("registrationForm");
const loginFormEl = document.getElementById("loginForm");

if (formEl) {
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userNameEl = document.getElementById("nameIpt");
    const emailEl = document.getElementById("emailIpt");
    const passwordEl = document.getElementById("passwordIpt");
    const confirmPasswordEl = document.getElementById("confirmIpt");

    const inputArr = [userNameEl, emailEl, passwordEl, confirmPasswordEl];
    const valArr = inputArr.map((el) => el.value);

    if (verifyInputValue(valArr, "register")) {
      console.log("Form is filled with correct data");
      try {
        const { success, msg } = await registerCall([
          userNameEl,
          emailEl,
          passwordEl,
        ]);
        if (success) {
          alert(msg);
          navigateToPage("./pages/login.html");
        } else {
          alert(msg);
        }
        formEl.reset();
      } catch (error) {
        console.log(error);
      }
    }
  });
}

if (loginFormEl) {
  loginFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailEl = document.getElementById("emailLogIpt");
    const passwordEl = document.getElementById("passwordLogIpt");

    const inputArr = [emailEl, passwordEl];
    const valueArr = inputArr.map((el) => el.value);

    if (verifyInputValue(inputArr, "login")) {
      try {
        const { success, msg, data = null } = await loginCall(valueArr);
        // await loginCall(valueArr);
        alert(msg);

        if (success) {
          if (data) {
            const { email, username } = data;
            localStorage.setItem("email", email);
            localStorage.setItem("username", username);
          }

          const options = {
            method: "GET",
          };
          const res = await navigateToUrl(
            "http://localhost:4000/content/dashboard",
            options
          );
          const { success, msg } = await res.json();

          if (success) location.href = msg;
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}
