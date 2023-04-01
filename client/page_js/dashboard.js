import { logoutUser } from "../util/auth.js";
import { showForm, hideForm, blurIn, blurOut } from "../util/domlib.js";
import { dateFormation } from "../util/valueCheck.js";

const userNameEl = document.getElementById("username");
const logoutBtn = document.getElementById("logoutBtn");
const addTaskBtn = document.getElementById("addTasksBtn");

// Page Elements
const navBar = document.getElementById("navbar_dashboard");
const mainContent = document.getElementById("mainContentContainer");

//List Elements
const list_box = document.getElementById("list_box");

// Form Elements
const newTaskForm = document.getElementById("task_form");
const formTitle = document.getElementById("formTitle");
const titleIpt = document.getElementById("task_title");
const descIpt = document.getElementById("task_desc");
const statusIpt = document.getElementById("task_status_show");
const task_status_div = document.getElementById("task_status");
const dateIpt = document.getElementById("task_completion_date");
const taskSubmitBtn = document.getElementById("task_submit_btn");
const taskCancelBtn = document.getElementById("task_cancel_btn");

//CONFIRMATION BOX ELEMENTS
const confirmationBox = document.getElementById("confirmation_box");
const confirmationAction = document.getElementById("confirmation_action");
const confirmationOKBtn = document.getElementById("confirmation_ok_btn");
const confirmationCancelBtn = document.getElementById(
  "confirmation_cancel_btn"
);

const task_optionsList = document.getElementById("options_list");

onload = (event) => {
  if (localStorage.getItem("username")) {
    const userName = localStorage.getItem("username");
    userNameEl.innerHTML = userName;
  }
};

logoutBtn.addEventListener("click", logoutUser);

//----FORM SHOW FORM HIDE
addTaskBtn.addEventListener("click", () => {
  blurIn(navBar);
  blurIn(mainContent);

  formTitle.innerHTML = "Add a Task";
  task_status_div.classList.remove("hidden");
  statusIpt.classList.add("hidden");
  taskSubmitBtn.classList.remove("hidden");
  showForm(newTaskForm);
});

taskSubmitBtn.addEventListener("click", (e) => {
  // hideForm(newTaskForm);
  // blurOut(navBar);
  // blurOut(mainContent);

  blurIn(newTaskForm);
  confirmationAction.innerHTML = "Save";
  showForm(confirmationBox);
});

taskCancelBtn.addEventListener("click", (e) => {
  hideForm(newTaskForm);
  blurOut(navBar);
  blurOut(mainContent);
});

task_status_div.addEventListener("click", (e) => {
  showForm(task_optionsList);
});

newTaskForm.addEventListener("click", (e) => {
  if (
    task_optionsList.classList.contains("scale-y-100") &&
    e.target.id != "task_status"
  ) {
    hideForm(task_optionsList);
  }
});
//----FORM SHOW FORM HIDE

//----LIST BOX CLICK
list_box.addEventListener("click", (e) => {
  if (e.target.id == "edit_task_btn") {
    blurIn(navBar);
    blurIn(mainContent);

    formTitle.innerHTML = "Edit Task";
    _editFormConfiguration();
    showForm(newTaskForm);
  } else if (e.target.id == "delTaskBtn") {
    blurIn(navBar);
    blurIn(mainContent);
    showForm(confirmationBox);
  } else {
    blurIn(navBar);
    blurIn(mainContent);

    formTitle.innerHTML = "Task Detail";
    _detailFormConfiguration();
    showForm(newTaskForm);
  }
});

//---CONFIRMATION BOX CLICK
confirmationOKBtn.addEventListener("click", () => {
  blurOut(navBar);
  blurOut(mainContent);

  hideForm(confirmationBox);
  hideForm(newTaskForm);
});

confirmationCancelBtn.addEventListener("click", () => {
  blurOut(navBar);
  blurOut(mainContent);
  hideForm(confirmationBox);

  if (newTaskForm.classList.contains("scale-y-100")) {
    blurIn(navBar);
    blurIn(mainContent);
    blurOut(newTaskForm);
  }
});

const _detailFormConfiguration = () => {
  titleIpt.disabled = true;
  descIpt.disabled = true;
  task_status_div.classList.add("hidden");
  statusIpt.classList.remove("hidden");
  statusIpt.disabled = true;
  statusIpt.value = "OPEN";
  dateIpt.disabled = true;
  taskSubmitBtn.classList.add("hidden");
};

const _editFormConfiguration = () => {
  titleIpt.disabled = false;
  descIpt.disabled = false;
  task_status_div.classList.remove("hidden");
  statusIpt.classList.add("hidden");
  statusIpt.disabled = false;
  // statusIpt.value = "OPEN";
  dateIpt.disabled = false;
  taskSubmitBtn.classList.remove("hidden");
};
