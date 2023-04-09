// const moment = require("moment");
import { logoutUser } from "../util/auth.js";
import {
  showForm,
  hideForm,
  blurIn,
  blurOut,
  createListItems,
} from "../util/domlib.js";
import { apiCall } from "../util/routerCalls.js";
import { clearForm, formatDate } from "../util/valueCheck.js";

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
const task_status_selected = document.getElementById("status_selected");
const dateIpt = document.getElementById("task_completion_date");
const taskSubmitBtn = document.getElementById("task_submit_btn");
const taskCancelBtn = document.getElementById("task_cancel_btn");
const dateShowVal = document.getElementById("dateShowBox");

//CONFIRMATION BOX ELEMENTS
const confirmationBox = document.getElementById("confirmation_box");
const confirmationAction = document.getElementById("confirmation_action");
const confirmationOKBtn = document.getElementById("confirmation_ok_btn");
const confirmationCancelBtn = document.getElementById(
  "confirmation_cancel_btn"
);

const task_optionsList = document.getElementById("options_list");

let taskArr = null;

onload = async (event) => {
  if (localStorage.getItem("username")) {
    const userName = localStorage.getItem("username");
    userNameEl.innerHTML = userName;
  }

  const { success, msg } = await _loadAllList();

  if (success) {
    taskArr = msg;
    taskArr.forEach((element) => {
      createListItems(element.title);
    });
  } else {
    alert(msg);
  }
};

logoutBtn.addEventListener("click", logoutUser);

//----FORM SHOW FORM HIDE
addTaskBtn.addEventListener("click", () => {
  //DOM MANIPULATION
  blurIn(navBar);
  blurIn(mainContent);

  formTitle.innerHTML = "Add a Task";
  task_status_div.classList.remove("hidden");
  statusIpt.classList.add("hidden");
  taskSubmitBtn.classList.remove("hidden");
  dateIpt.classList.remove("hidden");
  _clearForm();
  showForm(newTaskForm, "add", taskSubmitBtn);
});

taskSubmitBtn.addEventListener("click", (e) => {
  //DOM MANIPULATION
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

task_optionsList.addEventListener("click", (e) => {
  const selectedStatus = e.target.id;
  task_status_selected.innerHTML = selectedStatus;
  statusIpt.value = selectedStatus;
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
    _editItemHandler(e);
    dateIpt.classList.remove("hidden");
    _showItemHandler(e, "edit");
    showForm(newTaskForm, "edit", taskSubmitBtn);
  } else if (e.target.id == "delTaskBtn") {
    blurIn(navBar);
    blurIn(mainContent);
    confirmationAction.innerHTML = "Delete";
    showForm(confirmationBox, "delete", taskSubmitBtn);
  } else {
    blurIn(navBar);
    blurIn(mainContent);

    formTitle.innerHTML = "Task Detail";
    _detailFormConfiguration();
    _showItemHandler(e, "display");
    showForm(newTaskForm);
  }
});
//----LIST BOX CLICK

//---CONFIRMATION BOX CLICK
confirmationOKBtn.addEventListener("click", () => {
  //DOM MANIPULATION
  blurOut(navBar);
  blurOut(mainContent);

  const submitAction = taskSubmitBtn.value;

  if (submitAction == "add") {
    _postNewTask("http://localhost:4000/tasks/create");
  } else if (submitAction == "edit") {
  } else {
  }

  hideForm(confirmationBox);
  hideForm(newTaskForm);
  clearForm([titleIpt, descIpt, dateIpt, task_status_selected]);
  _loadAllList();
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

//---CONFIRMATION BOX CLICK
const _detailFormConfiguration = () => {
  titleIpt.disabled = true;
  descIpt.disabled = true;
  task_status_div.classList.add("hidden");
  task_status_selected.classList.add("hidden");
  statusIpt.classList.remove("hidden");
  statusIpt.disabled = true;
  statusIpt.value = "OPEN";
  dateIpt.disabled = true;
  taskSubmitBtn.classList.add("hidden");
  dateShowVal.classList.add("hidden");
};

const _editFormConfiguration = () => {
  titleIpt.disabled = false;
  descIpt.disabled = false;
  task_status_div.classList.remove("hidden");
  task_status_selected.classList.remove("hidden");
  statusIpt.classList.add("hidden");
  statusIpt.disabled = false;
  // statusIpt.value = "OPEN";
  dateIpt.disabled = false;
  taskSubmitBtn.classList.remove("hidden");
  dateShowVal.classList.add("hidden");
};

//CALL API

const _postNewTask = async (url) => {
  const formVal = {
    title: titleIpt.value,
    description: descIpt.value,
    completionDate: new Date(dateIpt.value),
    status: task_status_selected.innerHTML
      ? task_status_selected.innerHTML
      : statusIpt.value,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application.json",
    },
    body: JSON.stringify(formVal),
  };

  try {
    const res = await apiCall(url, options);
    const { success, msg } = await res.json();
    alert(msg);
  } catch (error) {
    console.log(error);
  }
};

const _loadAllList = async () => {
  const res = await apiCall("http://localhost:4000/tasks", {
    method: "GET",
  });
  const { success, msg } = await res.json();
  return { success, msg };
};

const _showItemHandler = (e, action) => {
  let selectedListTitle = e.target.innerText.replace("\n", "").split(" ")[0];
  if (action == "edit") {
    selectedListTitle = e.srcElement.parentElement.parentElement.innerText
      .replace("\n", "")
      .split(" ")[0];
  }

  const selectedItem = taskArr.find((el) => (el.title = selectedListTitle));

  titleIpt.value = selectedItem.title;
  descIpt.value = selectedItem.description;
  statusIpt.value = selectedItem.status;
  if (action == "display") {
    const dateVal = selectedItem.completionDate.replace("T", " ").split(" ")[0];
    const timeVal = selectedItem.completionDate
      .replace("T", " ")
      .split(" ")[1]
      .replace("Z", " ")
      .split(" ")[0];

    dateShowVal.value = dateVal + " " + timeVal;
    dateShowVal.disabled = true;
    dateIpt.classList.add("hidden");
    dateShowVal.classList.remove("hidden");
  } else if (action == "edit") {
    const dateVal = selectedItem.completionDate
      .replace("T", " ")
      .split(" ")[0]
      .replace(":", "-");
    const timeVal = selectedItem.completionDate
      .replace("T", " ")
      .split(" ")[1]
      .replace("Z", " ")
      .split(" ")[0];

    dateIpt.value = dateVal + "T" + timeVal;
  }
};

const _clearForm = () => {
  titleIpt.value = null;
  descIpt.value = null;
  statusIpt.value = null;
  dateIpt.value = null;
  dateShowVal.value = null;
};

const _editItemHandler = (e) => {};
